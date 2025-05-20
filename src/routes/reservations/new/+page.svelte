<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { createReservation, isLoading, error } from '$lib/stores/reservationStore';
  import type { CreateReservationRequest } from '$lib/types';
  
  let formData: CreateReservationRequest = {
    ConfirmationNumber: '',
    profile: {
      FirstName: '',
      LastName: '',
      EmailAddress: '',
      PhoneNumber: ''
    },
    reservationStays: [{
      ArrivalDate: '',
      DepartureDate: '',
      RoomTypeID: 0,
      RoomID: undefined
    }],
    BookingChannelCode: 'DIRECT',
    PropertyID: 1 // Default property ID
  };
  
  let successMessage = '';
  
  // For display purposes, we'll have a list of room types
  let roomTypes = [
    { id: 1, name: 'Standard' },
    { id: 2, name: 'Deluxe' },
    { id: 3, name: 'Suite' },
    { id: 4, name: 'Executive Suite' }
  ];
  
  async function handleSubmit() {
    try {
      const result = await createReservation(formData);
      if (result) {
        successMessage = `Reservation created successfully with confirmation #${result.confirmationNumber}`;
        
        // Redirect to the new reservation after a short delay
        setTimeout(() => {
          goto(`/reservations/${result.ReservationID}`);
        }, 2000);
      }
    } catch (err) {
      // Error handling is done in the store
    }
  }
  
  function addStay() {
    formData.reservationStays = [
      ...formData.reservationStays,
      {
        ArrivalDate: '',
        DepartureDate: '',
        RoomTypeID: 0,
        RoomID: undefined
      }
    ];
  }
  
  function removeStay(index: number) {
    if (formData.reservationStays.length > 1) {
      formData.reservationStays = formData.reservationStays.filter((_, i) => i !== index);
    }
  }
  
  function generateConfirmationNumber() {
    const prefix = 'RES';
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    formData.ConfirmationNumber = `${prefix}${randomNum}`;
  }
  
  onMount(() => {
    generateConfirmationNumber();
  });
</script>

<svelte:head>
  <title>New Reservation | Admin Dashboard</title>
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
  
  {#if successMessage}
    <div class="p-4 bg-green-100 text-green-700 rounded mb-6">{successMessage}</div>
  {/if}
  
  <div class="mb-6">
    <h1 class="text-2xl font-bold">Create New Reservation</h1>
  </div>
  
  <form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow p-6">
    <!-- Guest Information Section -->
    <div class="mb-6">
      <h2 class="text-lg font-medium mb-4">Guest Information</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            type="text" 
            bind:value={formData.profile.FirstName} 
            required
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            type="text" 
            bind:value={formData.profile.LastName} 
            required
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            bind:value={formData.profile.EmailAddress} 
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            bind:value={formData.profile.PhoneNumber} 
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
    
    <!-- Reservation Details Section -->
    <div class="mb-6">
      <h2 class="text-lg font-medium mb-4">Reservation Details</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmation Number</label>
          <div class="flex">
            <input 
              type="text" 
              bind:value={formData.ConfirmationNumber} 
              required
              class="w-full border-gray-300 rounded-l-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button 
              type="button" 
              on:click={generateConfirmationNumber}
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
            >
              Generate
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Booking Channel</label>
          <select 
            bind:value={formData.BookingChannelCode} 
            required
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="DIRECT">Direct</option>
            <option value="WEB">Website</option>
            <option value="OTA">Online Travel Agency</option>
            <option value="PHONE">Phone</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Stays Section -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">Stays</h2>
        <button 
          type="button" 
          on:click={addStay}
          class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
        >
          + Add Stay
        </button>
      </div>
      
      {#each formData.reservationStays as stay, index}
        <div class="bg-gray-50 p-4 rounded-md mb-4">
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-sm font-medium">Stay {index + 1}</h4>
            
            {#if formData.reservationStays.length > 1}
              <button 
                type="button" 
                on:click={() => removeStay(index)}
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            {/if}
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <input 
                type="date" 
                bind:value={stay.ArrivalDate} 
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <input 
                type="date" 
                bind:value={stay.DepartureDate} 
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select 
                bind:value={stay.RoomTypeID} 
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="0">Select a room type</option>
                {#each roomTypes as roomType}
                  <option value={roomType.id}>{roomType.name}</option>
                {/each}
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Room ID (Optional)</label>
              <input 
                type="number" 
                bind:value={stay.RoomID} 
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="flex justify-end space-x-2">
      <a 
        href="/reservations"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Cancel
      </a>
      <button 
        type="submit"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        disabled={$isLoading}
      >
        {$isLoading ? 'Creating...' : 'Create Reservation'}
      </button>
    </div>
  </form>
</div> 