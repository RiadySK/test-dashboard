<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
  import ConfirmationModal from './ConfirmationModal.svelte';
  import { updateBookingDates, toggleBookingLock } from '$lib/stores/bookings';
  export let booking: any;
  export let dates: string[];
  export let left: string;
  export let width: string;
  const dispatch = createEventDispatcher();

  let isResizing = false;
  let startX: number;
  let startLeft: number;
  let startWidth: number;
  let resizeDirection: 'left' | 'right' | null = null;
  const dayWidth = 6; // width of one day in rem
  let draggedBookingData: any = null;
  
  // Modal state
  let showResizeModal = false;
  let pendingResizeChanges: { 
    startDate: string; 
    endDate: string;
    originalStartDate: string;
    originalEndDate: string;
  } | null = null;

  // Tooltip state
  let showTooltip = false;
  let tooltipX = 0;
  let tooltipY = 0;

  function handleLockClick(e: MouseEvent) {
    e.stopPropagation();
    toggleBookingLock(booking.id);
  }

  function handleResizeStart(e: MouseEvent, direction: 'left' | 'right') {
    if (booking.isLocked) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    isResizing = true;
    resizeDirection = direction;
    startX = e.clientX;
    startLeft = parseFloat(left);
    startWidth = parseFloat(width);
    
    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
  }

  function handleResizeMove(e: MouseEvent) {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startX;
    
    if (resizeDirection === 'left') {
      const newLeft = Math.max(0, startLeft + deltaX);
      const newWidth = startWidth - (newLeft - startLeft);
      
      // Calculate which day we're on
      const startDayIndex = Math.floor(startLeft / dayWidth);
      const newDayIndex = Math.floor(newLeft / dayWidth);
      
      // Only update if we've crossed a day boundary
      if (newDayIndex !== startDayIndex && newWidth >= dayWidth) {
        const endIndex = Math.floor((startLeft + startWidth) / dayWidth);
        if (newDayIndex < endIndex) {
          pendingResizeChanges = {
            startDate: dates[newDayIndex],
            endDate: booking.endDate,
            originalStartDate: booking.startDate,
            originalEndDate: booking.endDate
          };
          // Only update visual position
          left = `${newDayIndex * dayWidth}rem`;
          width = `${(endIndex - newDayIndex + 1) * dayWidth}rem`;
        }
      }
    } else {
      const newWidth = startWidth + deltaX;
      
      // Calculate which day we're on
      const endDayIndex = Math.floor((startLeft + startWidth) / dayWidth);
      const newEndDayIndex = Math.floor((startLeft + newWidth) / dayWidth);
      
      // Only update if we've crossed a day boundary
      if (newEndDayIndex !== endDayIndex && newWidth >= dayWidth) {
        const startIndex = Math.floor(startLeft / dayWidth);
        if (newEndDayIndex > startIndex && newEndDayIndex < dates.length) {
          pendingResizeChanges = {
            startDate: booking.startDate,
            endDate: dates[newEndDayIndex],
            originalStartDate: booking.startDate,
            originalEndDate: booking.endDate
          };
          // Only update visual position
          width = `${(newEndDayIndex - startIndex + 1) * dayWidth}rem`;
        }
      }
    }
  }

  function handleResizeEnd() {
    isResizing = false;
    resizeDirection = null;
    window.removeEventListener('mousemove', handleResizeMove);
    window.removeEventListener('mouseup', handleResizeEnd);
    
    if (pendingResizeChanges) {
      showResizeModal = true;
    }
  }

  function handleResizeConfirm() {
    if (pendingResizeChanges) {
      // Check for conflicts before applying changes
      const success = updateBookingDates(
        booking.id,
        pendingResizeChanges.startDate,
        pendingResizeChanges.endDate
      );

      if (success) {
        // Apply the actual date changes
        booking.startDate = pendingResizeChanges.startDate;
        booking.endDate = pendingResizeChanges.endDate;
        dispatch('resize', { booking });
      } else {
        // Show conflict alert
        alert('Cannot resize booking: There is a conflict with another booking in this room.');
        // Revert changes
        handleResizeCancel();
      }
      
      pendingResizeChanges = null;
    }
  }

  function handleResizeCancel() {
    if (pendingResizeChanges) {
      // Revert changes
      booking.startDate = pendingResizeChanges.originalStartDate;
      booking.endDate = pendingResizeChanges.originalEndDate;
      left = `${dates.indexOf(booking.startDate) * dayWidth}rem`;
      width = `${(dates.indexOf(booking.endDate) - dates.indexOf(booking.startDate) + 1) * dayWidth}rem`;
      pendingResizeChanges = null;
    }
  }

  function handleDragStart(e: DragEvent) {
    if (booking.isLocked || isResizing) {
      e.preventDefault();
      return;
    }
    // Store the original booking data for reference
    draggedBookingData = { ...booking };
    e.dataTransfer?.setData('application/json', JSON.stringify(draggedBookingData));
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!draggedBookingData) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const dayIndex = Math.floor(x / (dayWidth * 16)); // Convert rem to pixels (assuming 16px = 1rem)

    if (dayIndex >= 0 && dayIndex < dates.length) {
      const daysDiff = dates.indexOf(draggedBookingData.endDate) - dates.indexOf(draggedBookingData.startDate);
      const newStartDate = dates[dayIndex];
      const newEndDate = dates[Math.min(dayIndex + daysDiff, dates.length - 1)];
      
      // Check for conflicts before updating
      const success = updateBookingDates(booking.id, newStartDate, newEndDate);
      
      if (success) {
        // Update the booking with new dates while maintaining the duration
        booking.startDate = newStartDate;
        booking.endDate = newEndDate;
        
        // Update the visual position
        left = `${dayIndex * dayWidth}rem`;
        width = `${(daysDiff + 1) * dayWidth}rem`;

        // Dispatch update event with both date and room changes
        dispatch('update', { booking });
      } else {
        // Show conflict alert
        alert('Cannot move booking: There is a conflict with another booking in this room.');
        // Revert to original position
        left = `${dates.indexOf(draggedBookingData.startDate) * dayWidth}rem`;
        width = `${(daysDiff + 1) * dayWidth}rem`;
        booking.startDate = draggedBookingData.startDate;
        booking.endDate = draggedBookingData.endDate;
      }
    }
  }

  function handleMouseEnter(e: MouseEvent) {
    showTooltip = true;
    tooltipX = e.clientX;
    tooltipY = e.clientY;
  }

  function handleMouseMove(e: MouseEvent) {
    if (showTooltip) {
      tooltipX = e.clientX;
      tooltipY = e.clientY;
    }
  }

  function handleMouseLeave() {
    showTooltip = false;
  }
</script>

<div
  class="absolute top-1 bottom-1 rounded text-white px-2 py-1 text-sm cursor-move select-none group"
  class:bg-blue-500={!booking.isLocked}
  class:bg-gray-500={booking.isLocked}
  style="left: {left}; width: {width};"
  draggable={!booking.isLocked}
  data-booking-id={booking.id}
  on:dragstart={handleDragStart}
  on:dragover={handleDragOver}
  on:mouseenter={handleMouseEnter}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
>
  <div
    class="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100"
    class:opacity-0={booking.isLocked}
    on:mousedown={e => handleResizeStart(e, 'left')}
  ></div>
  <div
    class="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100"
    class:opacity-0={booking.isLocked}
    on:mousedown={e => handleResizeStart(e, 'right')}
  ></div>
  <div class="flex items-center justify-between">
    <div>
      <span>{booking.guestName}</span>
      <span class="ml-1">({booking.status})</span>
      <span class="ml-1">💼</span>
    </div>
    <button
      class="ml-2 opacity-0 group-hover:opacity-100 hover:opacity-100"
      on:click={handleLockClick}
      title={booking.isLocked ? "Unlock booking" : "Lock booking"}
    >
      {booking.isLocked ? "🔒" : "🔓"}
    </button>
  </div>
  <slot />
</div>

{#if showTooltip}
  <div
    class="fixed z-50 bg-white text-gray-800 rounded-lg shadow-lg p-4 max-w-sm"
    style="left: {tooltipX + 10}px; top: {tooltipY + 10}px;"
  >
    <div class="space-y-2">
      <div class="font-semibold text-lg">{booking.guestName}</div>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="text-gray-600">Check-in:</div>
        <div>{booking.startDate}</div>
        <div class="text-gray-600">Check-out:</div>
        <div>{booking.endDate}</div>
        <div class="text-gray-600">Room:</div>
        <div>{booking.roomId}</div>
        <div class="text-gray-600">Status:</div>
        <div class="flex items-center">
          <span class="mr-1">{booking.status}</span>
          {#if booking.status === 'InHouse'}
            <span class="text-green-500">●</span>
          {:else if booking.status === 'Reserved'}
            <span class="text-blue-500">●</span>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<ConfirmationModal
  bind:show={showResizeModal}
  title="Confirm Booking Resize"
  message={pendingResizeChanges ? 
    `Are you sure you want to change the booking dates from ${pendingResizeChanges.originalStartDate} to ${pendingResizeChanges.originalEndDate} to ${pendingResizeChanges.startDate} to ${pendingResizeChanges.endDate}?` 
    : ''}
  on:confirm={handleResizeConfirm}
  on:cancel={handleResizeCancel}
/>

<style>
  div {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  /* Add smooth transition for tooltip */
  .fixed {
    transition: opacity 0.2s ease-in-out;
  }
</style> 