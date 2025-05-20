<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { 
    fetchReservationById, 
    updateReservation,
    currentReservation, 
    isLoading, 
    error 
  } from '$lib/stores/reservationStore';
  
  let formData = {
    notes: '',
    stays: []
  };
  let successMessage = '';
  
  onMount(async () => {
    const id = Number($page.params.id);
    if (!isNaN(id)) {
      await fetchReservationById(id);
      
      if ($currentReservation) {
        // Initialize form data based on current reservation
        formData.stays = $currentReservation.reservationStays.map(stay => ({
          stayId: stay.stayId || 0,
          arrivalDate: stay.ArrivalDate,
          departureDate: stay.DepartureDate,
          adultCount: stay.adultCount || 1,
          childCount: stay.childCount || 0,
          roomTypeId: stay.roomType?.roomTypeId || 0,
          rateAmount: stay.rateAmount || 0
        }));
      }
    }
  });
  
  async function handleSubmit() {
    if (!$currentReservation) return;
    
    try {
      const result = await updateReservation($currentReservation.ReservationID, formData);
      if (result) {
        successMessage = 'Reservation updated successfully';
        
        // Reset message after 3 seconds
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      }
    } catch (err) {
      // Error handling is done in the store
    }
  }
  
  function cancelEdit() {
    goto(`/reservations/${$page.params.id}`);
  }
</script>

<svelte:head>
  <title>Edit Reservation | Admin Dashboard</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href={`/reservations/${$page.params.id}`} class="text-blue-600 hover:text-blue-800">
      &larr; Back to Reservation
    </a>
  </div>
  
  {#if $error}
    <div class="p-4 bg-red-100 text-red-700 rounded mb-6">{$error}</div>
  {/if}
  
  {#if successMessage}
    <div class="p-4 bg-green-100 text-green-700 rounded mb-6">{successMessage}</div>
  {/if}
  
  {#if $isLoading}
    <div class="p-8 text-center">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      <p class="mt-2 text-gray-600">Loading reservation details...</p>
    </div>
  {:else if $currentReservation}
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Edit Reservation #{$currentReservation.ConfirmationNumber}</h1>
    </div>
    
    <form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-medium mb-4">Reservation Details</h2>
      
      <!-- Stays Section -->
      <div class="mb-6">
        <h3 class="text-md font-medium mb-3">Stays</h3>
        
        {#each formData.stays as stay, index}
          <div class="bg-gray-50 p-4 rounded-md mb-4">
            <h4 class="text-sm font-medium mb-2">Stay {index + 1}</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <input 
                  type="date" 
                  bind:value={stay.arrivalDate} 
                  class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                <input 
                  type="date" 
                  bind:value={stay.departureDate} 
                  class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                <input 
                  type="number" 
                  bind:value={stay.adultCount} 
                  min="1" 
                  class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Children</label>
                <input 
                  type="number" 
                  bind:value={stay.childCount} 
                  min="0" 
                  class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rate Amount</label>
                <input 
                  type="number" 
                  bind:value={stay.rateAmount} 
                  step="0.01" 
                  min="0" 
                  class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Notes Section -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea 
          bind:value={formData.notes} 
          rows="4" 
          class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add any additional notes about this reservation..."
        ></textarea>
      </div>
      
      <div class="flex justify-end space-x-2">
        <button 
          type="button"
          on:click={cancelEdit}
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          disabled={$isLoading}
        >
          {$isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  {:else}
    <div class="bg-white rounded-lg shadow p-8 text-center">
      <p class="text-lg text-gray-600">Reservation not found</p>
    </div>
  {/if}
</div> 