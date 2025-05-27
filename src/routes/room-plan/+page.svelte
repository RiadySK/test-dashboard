<script lang="ts">
import RoomList from '$lib/components/RoomList.svelte';
import BookingTimeline from '$lib/components/BookingTimeline.svelte';
import Tooltip from '$lib/components/Tooltip.svelte';
import { bookings } from '$lib/stores/bookings';

// Mock data for rooms and bookings (as per requirements)
const ROOMS = [
  { id: '101', title: 'Room 101', type: 'GLSK' },
  { id: '102', title: 'Room 102', type: 'GLSK' },
  { id: '201', title: 'Room 201', type: 'DBPK' },
  { id: '202', title: 'Room 202', type: 'DBPK' },
  { id: '203', title: 'Room 203', type: 'DBPK' },
  { id: '204', title: 'Room 204', type: 'GLSK' },
  { id: '205', title: 'Room 205', type: 'DBPK' },
  { id: '206', title: 'Room 206', type: 'DLXK' },
  { id: '207', title: 'Room 207', type: 'DLXK' },
  { id: '208', title: 'Room 208', type: 'DLXK' }
];

const dates = [
  '2023-08-03',
  '2023-08-04',
  '2023-08-05',
  '2023-08-06',
  '2023-08-07',
  '2023-08-08',
  '2023-08-09',
  '2023-08-10',
  '2023-08-11',
  '2023-08-12',
  '2023-08-13',
  '2023-08-14',
  '2023-08-15',
  '2023-08-16'
];

function incrementSusanDates() {
  bookings.update(currentBookings => {
    return currentBookings.map(booking => {
      if (booking.guestName === 'Susan Halim') {
        // Increment both dates
        const currentStartDate = new Date(booking.startDate);
        const currentEndDate = new Date(booking.endDate);
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        currentEndDate.setDate(currentEndDate.getDate() + 1);
        
        // Get random room ID (excluding current room)
        const availableRooms = ROOMS.filter(room => room.id !== booking.roomId);
        const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
        
        return {
          ...booking,
          startDate: currentStartDate.toISOString().split('T')[0],
          endDate: currentEndDate.toISOString().split('T')[0],
          roomId: randomRoom.id
        };
      }
      return booking;
    });
  });
}
</script>

<div class="flex flex-col h-full w-full bg-gray-50">
  <!-- Test Button -->
  <div class="p-2 bg-white border-b">
    <button 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      on:click={incrementSusanDates}
    >
      Increment Susan's Dates & Change Room
    </button>
  </div>

  <div class="flex flex-row flex-1 overflow-hidden">
    <!-- Left Pane: Room List -->
    <aside class="w-48 bg-white border-r border-gray-200 overflow-y-auto sticky left-0 top-0 z-10">
      <div class="font-bold p-2 border-b">Rooms</div>
      <RoomList rooms={ROOMS} />
    </aside>

    <!-- Main Pane: Booking Timeline -->
    <main class="flex-1 overflow-x-auto">
      <BookingTimeline rooms={ROOMS} bookings={$bookings} dates={dates} />
    </main>
  </div>
  <!-- Legend -->
  <footer class="bg-white border-t p-2 text-xs flex flex-wrap gap-4">
    <div><span class="inline-block w-4 h-4 bg-orange-300 border border-orange-500 mr-1 align-middle"></span> Reserved</div>
    <div><span class="inline-block w-4 h-4 bg-green-300 border border-green-500 mr-1 align-middle"></span> In House</div>
    <div><span class="mr-1">🧹</span> Clean</div>
    <div><span class="mr-1">🚬</span> Smoking</div>
    <div><span class="mr-1">💼</span> VIP</div>
    <!-- Add more legend items as needed -->
  </footer>
</div> 