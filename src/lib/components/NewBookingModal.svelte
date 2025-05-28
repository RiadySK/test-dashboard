<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { addBooking } from '$lib/stores/bookings';
  import type { Booking } from '$lib/stores/bookings';

  export let show = false;
  export let rooms: { id: string; title: string; type: string }[] = [];
  export let dates: string[] = [];

  const dispatch = createEventDispatcher();

  const DEFAULT_START_DATE = '2025-08-03';
  const DEFAULT_END_DATE = '2025-08-10';
  const DEFAULT_RATE_PLAN = 'CORP';
  const DEFAULT_STATUS = 'Reserved' as const;

  let guestName = '';
  let selectedRoomId = '';
  let startDate = DEFAULT_START_DATE;
  let endDate = DEFAULT_END_DATE;
  let ratePlan = DEFAULT_RATE_PLAN;
  let price = 0;
  let status: 'Reserved' | 'InHouse' = DEFAULT_STATUS;
  let notes = '';

  let errors: Record<string, string> = {};
  let isSubmitting = false;

  const ratePlans = ['CORP', 'RACK', 'PROMO'];

  function validateForm(): boolean {
    errors = {};

    if (!guestName.trim()) {
      errors.guestName = 'Guest name is required';
    }

    if (!selectedRoomId) {
      errors.room = 'Room must be selected';
    }

    if (!startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!endDate) {
      errors.endDate = 'End date is required';
    }

    if (startDate && endDate && startDate >= endDate) {
      errors.endDate = 'End date must be after start date';
    }

    if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) return;

    isSubmitting = true;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      guestName,
      roomId: selectedRoomId,
      startDate,
      endDate,
      status,
      ratePlan,
      price
    };

    const success = addBooking(newBooking);

    if (success) {
      // Reset form
      guestName = '';
      selectedRoomId = '';
      startDate = DEFAULT_START_DATE;
      endDate = DEFAULT_END_DATE;
      ratePlan = DEFAULT_RATE_PLAN;
      price = 0;
      status = DEFAULT_STATUS;
      notes = '';
      
      // Close modal
      show = false;
      dispatch('success');
    } else {
      errors.general = 'Cannot create booking: There is a conflict with another booking in this room.';
    }

    isSubmitting = false;
  }

  function handleCancel() {
    show = false;
    dispatch('cancel');
  }

  // Calculate minimum dates
  $: minStartDate = new Date().toISOString().split('T')[0];
  $: minEndDate = startDate || minStartDate;
</script>

{#if show}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
      <h2 class="text-2xl font-bold mb-4">New Booking</h2>

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <!-- Guest Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Guest Name</label>
          <input
            type="text"
            bind:value={guestName}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter guest name"
          />
          {#if errors.guestName}
            <p class="mt-1 text-sm text-red-600">{errors.guestName}</p>
          {/if}
        </div>

        <!-- Room Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Room</label>
          <select
            bind:value={selectedRoomId}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a room</option>
            {#each rooms as room}
              <option value={room.id}>
                {room.title} ({room.type})
              </option>
            {/each}
          </select>
          {#if errors.room}
            <p class="mt-1 text-sm text-red-600">{errors.room}</p>
          {/if}
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              bind:value={startDate}
              min={minStartDate}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {#if errors.startDate}
              <p class="mt-1 text-sm text-red-600">{errors.startDate}</p>
            {/if}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              bind:value={endDate}
              min={minEndDate}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {#if errors.endDate}
              <p class="mt-1 text-sm text-red-600">{errors.endDate}</p>
            {/if}
          </div>
        </div>

        <!-- Rate Plan and Price -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Rate Plan</label>
            <select
              bind:value={ratePlan}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {#each ratePlans as plan}
                <option value={plan}>{plan}</option>
              {/each}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              bind:value={price}
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {#if errors.price}
              <p class="mt-1 text-sm text-red-600">{errors.price}</p>
            {/if}
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <select
            bind:value={status}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Reserved">Reserved</option>
            <option value="InHouse">In House</option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            bind:value={notes}
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Optional notes about the booking"
          ></textarea>
        </div>

        {#if errors.general}
          <p class="text-sm text-red-600">{errors.general}</p>
        {/if}

        <!-- Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            on:click={handleCancel}
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if} 