<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    fetchReservations, 
    paginatedReservations, 
    isLoading, 
    error, 
    currentPage, 
    itemsPerPage, 
    totalItems,
    currentFilter
  } from '$lib/stores/reservationStore';
  import type { ReservationFilter } from '$lib/types';

  // Pagination
  $: totalPages = Math.ceil($totalItems / $itemsPerPage);
  
  // Filters
  let filters: ReservationFilter = {
    confirmationNumber: '',
    lastName: '',
    arrivalDate: '',
    status: ''
  };

  function handleFilter() {
    fetchReservations(filters);
  }

  function clearFilters() {
    filters = {
      confirmationNumber: '',
      lastName: '',
      arrivalDate: '',
      status: ''
    };
    fetchReservations({});
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage.set(page);
    }
  }

  onMount(async () => {
    await fetchReservations();
  });
</script>

<svelte:head>
  <title>Hotel Reservations | Admin Dashboard</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Reservations</h1>
    <a href="/reservations/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
      New Reservation
    </a>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-lg font-medium mb-4">Filters</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Confirmation Number</label>
        <input 
          type="text" 
          bind:value={filters.confirmationNumber} 
          class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Guest Last Name</label>
        <input 
          type="text" 
          bind:value={filters.lastName} 
          class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
        <input 
          type="date" 
          bind:value={filters.arrivalDate} 
          class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          bind:value={filters.status} 
          class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
    <div class="flex justify-end mt-4 space-x-2">
      <button 
        on:click={clearFilters}
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Clear
      </button>
      <button 
        on:click={handleFilter}
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  </div>

  <!-- Results -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    {#if $error}
      <div class="p-4 bg-red-100 text-red-700">{$error}</div>
    {/if}

    {#if $isLoading}
      <div class="p-8 text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p class="mt-2 text-gray-600">Loading reservations...</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reservation ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-out
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#if $paginatedReservations.length === 0}
              <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  No reservations found
                </td>
              </tr>
            {:else}
              {#each $paginatedReservations as reservation}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reservation.ConfirmationNumber}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.profile?.nameInfo?.FirstName || ''} {reservation.profile?.nameInfo?.LastName || ''}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.reservationStay?.room?.RoomNumber || ''} ({reservation.reservationStay?.roomType?.Description || ''})
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.reservationStay?.ArrivalDate ? new Date(reservation.reservationStay.ArrivalDate).toLocaleDateString() : ''}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.reservationStay?.DepartureDate ? new Date(reservation.reservationStay.DepartureDate).toLocaleDateString() : ''}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      {reservation.StatusCode === 'confirmed' ? 'bg-green-100 text-green-800' : 
                       reservation.StatusCode === 'checked-in' ? 'bg-blue-100 text-blue-800' : 
                       reservation.StatusCode === 'checked-out' ? 'bg-gray-100 text-gray-800' : 
                       'bg-red-100 text-red-800'}">
                      {reservation.StatusCode}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/reservations/${reservation.ReservationID}`} class="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </a>
                    <a href={`/reservations/${reservation.ReservationID}/edit`} class="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </a>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              on:click={() => goToPage($currentPage - 1)} 
              disabled={$currentPage === 1}
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                     {$currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
              Previous
            </button>
            <button 
              on:click={() => goToPage($currentPage + 1)} 
              disabled={$currentPage === totalPages}
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                     {$currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{($currentPage - 1) * $itemsPerPage + 1}</span> to <span class="font-medium">{Math.min($currentPage * $itemsPerPage, $totalItems)}</span> of <span class="font-medium">{$totalItems}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  on:click={() => goToPage($currentPage - 1)} 
                  disabled={$currentPage === 1}
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50
                         {$currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
                  <span class="sr-only">Previous</span>
                  <!-- Heroicon name: solid/chevron-left -->
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                {#each Array(totalPages) as _, i}
                  {#if i + 1 === $currentPage || i + 1 === 1 || i + 1 === totalPages || (i + 1 >= $currentPage - 1 && i + 1 <= $currentPage + 1)}
                    <button 
                      on:click={() => goToPage(i + 1)} 
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium 
                             {$currentPage === i + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}">
                      {i + 1}
                    </button>
                  {:else if i + 1 === $currentPage - 2 || i + 1 === $currentPage + 2}
                    <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  {/if}
                {/each}
                
                <button 
                  on:click={() => goToPage($currentPage + 1)} 
                  disabled={$currentPage === totalPages}
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50
                         {$currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
                  <span class="sr-only">Next</span>
                  <!-- Heroicon name: solid/chevron-right -->
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div> 