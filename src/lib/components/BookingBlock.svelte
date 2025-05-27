<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
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
    const dayWidth = 6; // width of one day in rem
    
    if (resizeDirection === 'left') {
      const newLeft = Math.max(0, startLeft + deltaX);
      const newWidth = startWidth - (newLeft - startLeft);
      const minWidth = dayWidth; // minimum width of 1 day
      
      if (newWidth >= minWidth) {
        const startIndex = Math.floor(newLeft / dayWidth);
        const endIndex = Math.floor((newLeft + newWidth) / dayWidth);
        
        if (startIndex < endIndex) {
          booking.startDate = dates[startIndex];
          left = `${newLeft}rem`;
          width = `${newWidth}rem`;
        }
      }
    } else {
      const newWidth = Math.max(dayWidth, startWidth + deltaX);
      const endIndex = Math.floor((startLeft + newWidth) / dayWidth);
      const startIndex = Math.floor(startLeft / dayWidth);
      
      if (endIndex > startIndex && endIndex < dates.length) {
        booking.endDate = dates[endIndex];
        width = `${newWidth}rem`;
      }
    }
  }

  function handleResizeEnd() {
    isResizing = false;
    resizeDirection = null;
    window.removeEventListener('mousemove', handleResizeMove);
    window.removeEventListener('mouseup', handleResizeEnd);
    dispatch('resize', { booking });
  }
</script>

<div
  class="absolute top-1 bottom-1 rounded bg-blue-500 text-white px-2 py-1 text-sm cursor-move select-none group"
  style="left: {left}; width: {width};"
  draggable="true"
  use:dndzone={{ items: [booking], flipDurationMs: 150 }}
  on:consider={e => dispatch('consider', e)}
  on:finalize={e => dispatch('finalize', e)}
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

<style>
  div {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style> 