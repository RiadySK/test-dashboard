<script lang="ts">
  import BookingBlock from './BookingBlock.svelte';
  import ConfirmationModal from './ConfirmationModal.svelte';
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { bookings as bookingsStore, updateBookingDates, updateBookingRoomAndDates } from '$lib/stores/bookings';
  import type { Booking } from '$lib/stores/bookings';

  export let rooms: { id: string; title: string; type: string }[] = [];
  export let bookings: Booking[] = [];
  export let dates: string[] = [];

  let localBookings: Booking[] = [];
  
  // Modal state
  let showDropModal = false;
  let pendingDropChanges: { booking: Booking; roomId: string; startDate: string; endDate: string } | null = null;
  
  // Update localBookings whenever bookings change
  $: {
    localBookings = bookings.map(b => ({ ...b }));
  }

  function handleBookingUpdate(event: CustomEvent<{ booking: Booking }>) {
    const { booking } = event.detail;
    // Update the booking in the store with both date and room changes
    bookingsStore.update(currentBookings => 
      currentBookings.map(b => 
        b.id === booking.id 
          ? { ...b, startDate: booking.startDate, endDate: booking.endDate, roomId: booking.roomId }
          : b
      )
    );
  }

  function handleResize(event: CustomEvent<{ booking: Booking }>) {
    const { booking } = event.detail;
    // Update the booking in the store
    bookingsStore.update(currentBookings => 
      currentBookings.map(b => 
        b.id === booking.id 
          ? { ...b, startDate: booking.startDate, endDate: booking.endDate }
          : b
      )
    );
  }

  function handleRoomDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function handleRoomDrop(e: DragEvent) {
    e.preventDefault();
    const roomId = (e.currentTarget as HTMLElement).getAttribute('data-room-id');
    if (!roomId) return;

    const bookingData = e.dataTransfer?.getData('application/json');
    if (!bookingData) return;

    const booking = JSON.parse(bookingData);
    
    // Check if booking is locked
    if (booking.isLocked) {
      alert('Cannot move booking: This booking is locked.');
      return;
    }
    
    // Get the current position of the booking block
    const bookingBlock = document.querySelector(`[data-booking-id="${booking.id}"]`);
    if (!bookingBlock) return;
    
    const rect = bookingBlock.getBoundingClientRect();
    const parentRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left - parentRect.left;
    const dayWidth = 96; // 6rem * 16px (assuming 1rem = 16px)
    const dayIndex = Math.floor(x / dayWidth);
    
    if (dayIndex >= 0 && dayIndex < dates.length) {
      const daysDiff = dates.indexOf(booking.endDate) - dates.indexOf(booking.startDate);
      const newStartDate = dates[dayIndex];
      const newEndDate = dates[Math.min(dayIndex + daysDiff, dates.length - 1)];
      
      // Store pending changes
      pendingDropChanges = {
        booking,
        roomId,
        startDate: newStartDate,
        endDate: newEndDate
      };
      
      // Show confirmation modal
      showDropModal = true;
    }
  }

  function handleDropConfirm() {
    if (pendingDropChanges) {
      const { booking, roomId, startDate, endDate } = pendingDropChanges;
      
      // Check if booking is locked
      if (booking.isLocked) {
        alert('Cannot move booking: This booking is locked.');
        pendingDropChanges = null;
        return;
      }
      
      // Check for conflicts and update both room and dates
      const success = updateBookingRoomAndDates(
        booking.id,
        roomId,
        startDate,
        endDate
      );
      
      if (success) {
        // The store update is handled inside updateBookingRoomAndDates
        showDropModal = false;
      } else {
        // Show conflict alert
        alert('Cannot move booking: There is a conflict with another booking in the target room.');
      }
      
      pendingDropChanges = null;
    }
  }

  function handleDropCancel() {
    pendingDropChanges = null;
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
      <div 
        class="flex border-b min-h-[48px] hover:bg-blue-50 group relative"
        data-room-id={room.id}
        on:dragover={handleRoomDragOver}
        on:drop={handleRoomDrop}
      >
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
              on:update={handleBookingUpdate}
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<ConfirmationModal
  bind:show={showDropModal}
  title="Confirm Booking Move"
  message={pendingDropChanges ? `Are you sure you want to move the booking to ${rooms.find(r => r.id === pendingDropChanges?.roomId)?.title} from ${pendingDropChanges?.startDate} to ${pendingDropChanges?.endDate}?` : ''}
  on:confirm={handleDropConfirm}
  on:cancel={handleDropCancel}
/>

<style>
  :global(*) {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style> 