<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { createReservation, isLoading, error } from '$lib/stores/reservationStore';
  import { profiles, loadProfiles } from '$lib/stores/profileStore';
  import type { CreateReservationRequest, UserProfile } from '$lib/types';
  import CustomDropdown from '$lib/components/CustomDropdown.svelte';
  import { getVIPStatusColor } from '$lib/utils/vipStatusColors';
  
  const initialGuestInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  };
  
  let formData = {
    profileId: undefined as number | undefined,
    PropertyID: 1, // Default property ID
    bookingChannel: 'DIRECT' as const,
    stays: [{
      roomTypeId: 0,
      arrivalDate: '',
      departureDate: '',
      adultCount: 1,
      childCount: 0,
      rateAmount: '0'
    }],
    guestInfo: initialGuestInfo
  } satisfies CreateReservationRequest;
  
  let successMessage = '';
  let selectedProfile: UserProfile | null = null;
  let showNewGuestForm = false;
  
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
    formData.stays = [
      ...formData.stays,
      {
        roomTypeId: 0,
        arrivalDate: '',
        departureDate: '',
        adultCount: 1,
        childCount: 0,
        rateAmount: '0'
      }
    ];
  }
  
  function removeStay(index: number) {
    if (formData.stays.length > 1) {
      formData.stays = formData.stays.filter((_, i) => i !== index);
    }
  }
  
  function selectProfile(profile: UserProfile) {
    selectedProfile = profile;
    formData.profileId = profile.ProfileID;
    showNewGuestForm = false;
  }
  
  function showNewGuest() {
    selectedProfile = null;
    formData.profileId = undefined;
    formData.guestInfo = { ...initialGuestInfo };
    showNewGuestForm = true;
  }
  
  onMount(async () => {
    await loadProfiles();
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
    <!-- Guest Selection Section -->
    <div class="mb-6">
      <h2 class="text-lg font-medium mb-4">Guest Information</h2>
      
      {#if !selectedProfile && !showNewGuestForm}
        <div class="mb-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Select Existing Guest</h3>
          <CustomDropdown
            options={$profiles.map(profile => ({
              value: profile.ProfileID,
              label: `${profile.FirstName} ${profile.LastName}`,
              profile
            }))}
            selectedValue={formData.profileId}
            placeholder="-- Select a guest --"
            optionLabel="label"
            optionValue="value"
            showHeader={true}
            on:select={({ detail }) => {
              if (detail.option.profile) selectProfile(detail.option.profile);
            }}
          >
            <div slot="option" let:option>
              <div class="grid grid-cols-12 gap-2 items-center">
                <div class="col-span-4 font-medium">{option.profile.FirstName} {option.profile.LastName}</div>
                <div class="col-span-5 text-gray-600">{option.profile.EmailAddress}</div>
                <div class="col-span-3 text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getVIPStatusColor(option.profile.VIPStatusCode)}">
                    {option.profile.VIPStatusCode}
                  </span>
                </div>
              </div>
            </div>
          </CustomDropdown>
        </div>
        <div class="text-center">
          <button
            type="button"
            on:click={showNewGuest}
            class="text-blue-600 hover:text-blue-800"
          >
            + Add New Guest
          </button>
        </div>
      {:else if showNewGuestForm}
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-medium text-gray-700">New Guest Information</h3>
            <button
              type="button"
              on:click={() => showNewGuestForm = false}
              class="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                bind:value={formData.guestInfo.firstName} 
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                bind:value={formData.guestInfo.lastName} 
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                bind:value={formData.guestInfo.email} 
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                bind:value={formData.guestInfo.phoneNumber} 
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      {:else if selectedProfile}
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-medium text-gray-700">Selected Guest</h3>
            <button
              type="button"
              on:click={() => selectedProfile = null}
              class="text-gray-500 hover:text-gray-700"
            >
              Change Guest
            </button>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-md">
            <div class="font-medium">{selectedProfile.FirstName} {selectedProfile.LastName}</div>
            <div class="text-sm text-gray-500">{selectedProfile.EmailAddress}</div>
            <div class="text-sm text-gray-500">{selectedProfile.PhoneNumber}</div>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Reservation Details Section -->
    <div class="mb-6">
      <h2 class="text-lg font-medium mb-4">Reservation Details</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Booking Channel</label>
          <select 
            bind:value={formData.bookingChannel} 
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
      
      {#each formData.stays as stay, index}
        <div class="bg-gray-50 p-4 rounded-md mb-4">
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-sm font-medium">Stay {index + 1}</h4>
            
            {#if formData.stays.length > 1}
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
                bind:value={stay.arrivalDate} 
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <input 
                type="date" 
                bind:value={stay.departureDate} 
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select 
                bind:value={stay.roomTypeId} 
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Rate Amount</label>
              <input 
                type="number" 
                bind:value={stay.rateAmount} 
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Adults</label>
              <input 
                type="number" 
                bind:value={stay.adultCount} 
                min="1"
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Children</label>
              <input 
                type="number" 
                bind:value={stay.childCount} 
                min="0"
                required
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