<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
  import ConfirmationModal from './ConfirmationModal.svelte';
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

  function handleResizeStart(e: MouseEvent, direction: 'left' | 'right') {
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
      // Apply the actual date changes
      booking.startDate = pendingResizeChanges.startDate;
      booking.endDate = pendingResizeChanges.endDate;
      dispatch('resize', { booking });
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
    if (isResizing) {
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
      
      // Update the booking with new dates while maintaining the duration
      booking.startDate = dates[dayIndex];
      booking.endDate = dates[Math.min(dayIndex + daysDiff, dates.length - 1)];
      
      // Update the visual position
      left = `${dayIndex * dayWidth}rem`;
      width = `${(daysDiff + 1) * dayWidth}rem`;

      // Dispatch update event with both date and room changes
      dispatch('update', { booking });
    }
  }
</script>

<div
  class="absolute top-1 bottom-1 rounded bg-blue-500 text-white px-2 py-1 text-sm cursor-move select-none group"
  style="left: {left}; width: {width};"
  draggable="true"
  data-booking-id={booking.id}
  on:dragstart={handleDragStart}
  on:dragover={handleDragOver}
>
  <div
    class="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100"
    on:mousedown={e => handleResizeStart(e, 'left')}
  ></div>
  <div
    class="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100"
    on:mousedown={e => handleResizeStart(e, 'right')}
  ></div>
  <span>{booking.guestName}</span>
  <span class="ml-1">({booking.status})</span>
  <span class="ml-1">💼</span>
  <slot />
</div>

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
</style> 