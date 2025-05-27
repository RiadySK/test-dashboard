<script lang="ts">
  import BookingBlock from './BookingBlock.svelte';
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { bookings as bookingsStore } from '$lib/stores/bookings';
  import type { Booking } from '$lib/stores/bookings';

  export let rooms: { id: string; title: string; type: string }[] = [];
  export let bookings: Booking[] = [];
  export let dates: string[] = [];

  let localBookings: Booking[] = [];
  
  // Update localBookings whenever bookings change
  $: {
    localBookings = bookings.map(b => ({ ...b }));
  }

  function handleDndFinalize(event: CustomEvent<DndEvent<Booking>>) {
    const { items } = event.detail;
    localBookings = items;
  }

  function handleResize(event: CustomEvent<{ booking: Booking }>) {
    const { booking } = event.detail;
    // Update the booking in the store
    bookingsStore.update((currentBookings: Booking[]) => 
      currentBookings.map((b: Booking) => 
        b.id === booking.id 
          ? { ...b, startDate: booking.startDate, endDate: booking.endDate }
          : b
      )
    );
  }
</script>

<div class="min-w-max">
  <div class="flex border-b bg-gray-100 sticky top-0 z-10">
    <div class="w-48"></div>
    {#each dates as date}
      <div class="w-24 text-center py-2 border-l text-xs font-semibold">{date}</div>
    {/each}
  </div>
  <div class="relative">
    {#each rooms as room}
      <div class="flex border-b min-h-[48px] hover:bg-blue-50 group relative">
        <div class="w-48 flex items-center px-2 py-1 border-r font-medium">
          {room.title}
          <span class="ml-2 text-xs text-gray-400">{room.type}</span>
        </div>
        <div class="flex-1 relative">
          {#each localBookings.filter(b => b.roomId === room.id) as booking (booking.id)}
            <BookingBlock
              {booking}
              {dates}
              left={(dates.indexOf(booking.startDate) * 6) + 'rem'}
              width={((dates.indexOf(booking.endDate) - dates.indexOf(booking.startDate) + 1) * 6) + 'rem'}
              on:resize={handleResize}
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  :global(*) {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style> 