<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { 
    fetchReservationById, 
    currentReservation, 
    isLoading, 
    error,
    cancelReservation,
    checkInGuest,
    checkOutGuest
  } from '$lib/stores/reservationStore';
  
  let confirmCancel = false;
  let cancelReason = '';
  let showCheckInModal = false;
  let checkInData = {
    roomId: 0,
    guestDetails: {
      useReservedGuest: true,
      guests: []
    },
    paymentMethod: 'card',
    specialRequests: ''
  };
  
  let confirmCheckOut = false;

  onMount(async () => {
    const id = Number($page.params.id);
    if (!isNaN(id)) {
      await fetchReservationById(id);
    }
  });
  
  async function handleCancel() {
    if (!$currentReservation) return;
    
    const result = await cancelReservation($currentReservation.ReservationID, cancelReason);
    if (result) {
      confirmCancel = false;
      cancelReason = '';
    }
  }
  
  async function handleCheckIn() {
    if (!$currentReservation) return;
    
    // If using the reserved guest, prepare the guest data from currentReservation
    if (checkInData.guestDetails.useReservedGuest && $currentReservation.profile.nameInfos.length > 0) {
      const primaryGuest = $currentReservation.profile.nameInfos[0];
      checkInData.guestDetails.guests = [{
        firstName: primaryGuest.FirstName,
        lastName: primaryGuest.LastName,
        isPrimary: true
      }];
    }
    
    const result = await checkInGuest($currentReservation.ReservationID, checkInData);
    if (result) {
      showCheckInModal = false;
    }
  }
  
  async function handleCheckOut() {
    if (!$currentReservation) return;
    
    const result = await checkOutGuest($currentReservation.ReservationID);
    if (result) {
      confirmCheckOut = false;
    }
  }
  
  function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Reservation Details | Admin Dashboard</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/reservations" class="text-blue-600 hover:text-blue-800">
      &larr; Back to Reservations
    </a>
  </div>
  
  {#if $error}
    <div class="p-4 bg-red-100 text-red-700 rounded mb-6">{$error}</div>
  {/if}
  
  {#if $isLoading}
    <div class="p-8 text-center">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      <p class="mt-2 text-gray-600">Loading reservation details...</p>
    </div>
  {:else if $currentReservation}
    <div class="flex justify-between items-start mb-6">
      <div>
        <h1 class="text-2xl font-bold">Reservation #{$currentReservation.ConfirmationNumber}</h1>
        <p class="text-gray-600 mt-1">
          <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
            {$currentReservation.StatusCode === 'confirmed' ? 'bg-green-100 text-green-800' : 
            $currentReservation.StatusCode === 'checked-in' ? 'bg-blue-100 text-blue-800' : 
            $currentReservation.StatusCode === 'checked-out' ? 'bg-gray-100 text-gray-800' : 
            'bg-red-100 text-red-800'}">
            {$currentReservation.StatusCode}
          </span>
        </p>
      </div>
      
      <div class="flex space-x-2">
        {#if $currentReservation.StatusCode === 'confirmed'}
          <!-- Check-in button -->
          <button 
            on:click={() => showCheckInModal = true}
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Check In
          </button>
          <!-- Cancel button -->
          <button 
            on:click={() => confirmCancel = true}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Cancel
          </button>
        {:else if $currentReservation.StatusCode === 'checked-in'}
          <!-- Check-out button -->
          <button 
            on:click={() => confirmCheckOut = true}
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
          >
            Check Out
          </button>
        {/if}
        
        <a 
          href={`/reservations/${$currentReservation.ReservationID}/edit`}
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          Edit
        </a>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Reservation Information -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-medium mb-4">Reservation Information</h2>
        <div class="space-y-3">
          <div class="grid grid-cols-2">
            <div class="text-gray-600">Property:</div>
            <div>{$currentReservation.property.PropertyName}</div>
          </div>
          <div class="grid grid-cols-2">
            <div class="text-gray-600">Confirmation #:</div>
            <div>{$currentReservation.ConfirmationNumber}</div>
          </div>
          <div class="grid grid-cols-2">
            <div class="text-gray-600">Status:</div>
            <div>{$currentReservation.StatusCode}</div>
          </div>
          {#if $currentReservation.CancellationReason}
            <div class="grid grid-cols-2">
              <div class="text-gray-600">Cancelled Reason:</div>
              <div>{$currentReservation.CancellationReason}</div>
            </div>
            <div class="grid grid-cols-2">
              <div class="text-gray-600">Cancelled Date:</div>
              <div>{formatDate($currentReservation.CancellationDate)}</div>
            </div>
          {/if}
          {#if $currentReservation.creator}
            <div class="grid grid-cols-2">
              <div class="text-gray-600">Created By:</div>
              <div>{$currentReservation.creator.FirstName} {$currentReservation.creator.LastName}</div>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Guest Information -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-medium mb-4">Guest Information</h2>
        <div class="space-y-3">
          <div class="grid grid-cols-2">
            <div class="text-gray-600">Primary Guest:</div>
            <div>
              {#if $currentReservation.profile.nameInfos.length > 0}
                {$currentReservation.profile.nameInfos[0].FirstName} {$currentReservation.profile.nameInfos[0].LastName}
              {:else}
                N/A
              {/if}
            </div>
          </div>
          <div class="grid grid-cols-2">
            <div class="text-gray-600">Email:</div>
            <div>{$currentReservation.profile.EmailAddress || 'N/A'}</div>
          </div>
          <div class="grid grid-cols-2">
            <div class="text-gray-600">Phone:</div>
            <div>{$currentReservation.profile.PhoneNumber || 'N/A'}</div>
          </div>
          {#if $currentReservation.profile.nameInfos.length > 1}
            <div class="mt-4">
              <h3 class="text-md font-medium mb-2">Additional Guests</h3>
              <ul class="list-disc pl-5 space-y-1">
                {#each $currentReservation.profile.nameInfos.slice(1) as guest}
                  <li>{guest.FirstName} {guest.LastName}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Stay Information -->
      {#each $currentReservation.reservationStays as stay, index}
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium mb-4">Stay Information {$currentReservation.reservationStays.length > 1 ? `#${index+1}` : ''}</h2>
          <div class="space-y-3">
            <div class="grid grid-cols-2">
              <div class="text-gray-600">Check-in Date:</div>
              <div>{formatDate(stay.ArrivalDate)}</div>
            </div>
            <div class="grid grid-cols-2">
              <div class="text-gray-600">Check-out Date:</div>
              <div>{formatDate(stay.DepartureDate)}</div>
            </div>
            <div class="grid grid-cols-2">
              <div class="text-gray-600">Room Type:</div>
              <div>{stay.roomType.Description}</div>
            </div>
            <div class="grid grid-cols-2">
              <div class="text-gray-600">Room Number:</div>
              <div>{stay.room.RoomNumber}</div>
            </div>
            {#if stay.guestNameInfos && stay.guestNameInfos.length > 0}
              <div class="mt-4">
                <h3 class="text-md font-medium mb-2">Guests for this Stay</h3>
                <ul class="list-disc pl-5 space-y-1">
                  {#each stay.guestNameInfos as guestInfo}
                    <li>{guestInfo.nameInfo.FirstName} {guestInfo.nameInfo.LastName}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Cancel Reservation Modal -->
    {#if confirmCancel}
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Cancel Reservation</h2>
          <p class="mb-4">Are you sure you want to cancel this reservation? This action cannot be undone.</p>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
            <textarea 
              bind:value={cancelReason} 
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3" 
              required
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              on:click={() => confirmCancel = false}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              on:click={handleCancel}
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              disabled={!cancelReason}
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Check-in Modal -->
    {#if showCheckInModal}
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-lg">
          <h2 class="text-xl font-bold mb-4">Check In Guest</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
            <input 
              type="number" 
              bind:value={checkInData.roomId} 
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Guest Details</label>
            <div class="flex items-center mb-2">
              <input 
                type="checkbox" 
                id="useReservedGuest" 
                bind:checked={checkInData.guestDetails.useReservedGuest} 
                class="mr-2"
              />
              <label for="useReservedGuest">Use reserved guest information</label>
            </div>
            
            {#if !checkInData.guestDetails.useReservedGuest}
              <!-- Guest information form would go here -->
              <div class="bg-gray-100 p-3 rounded">
                <p class="text-gray-500 text-sm">Custom guest information fields would be displayed here</p>
              </div>
            {/if}
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select 
              bind:value={checkInData.paymentMethod} 
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="card">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
            <textarea 
              bind:value={checkInData.specialRequests} 
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="2"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              on:click={() => showCheckInModal = false}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              on:click={handleCheckIn}
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Complete Check-in
            </button>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Check-out Confirmation Modal -->
    {#if confirmCheckOut}
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Confirm Check Out</h2>
          <p class="mb-4">Are you sure you want to check out this guest?</p>
          
          <div class="flex justify-end space-x-2">
            <button 
              on:click={() => confirmCheckOut = false}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              on:click={handleCheckOut}
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Confirm Check-out
            </button>
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <div class="bg-white rounded-lg shadow p-8 text-center">
      <p class="text-lg text-gray-600">Reservation not found</p>
    </div>
  {/if}
</div> 