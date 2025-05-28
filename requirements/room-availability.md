## RoomReservationCalendar

### Overview

Displays a visual timeline of room bookings by date. Allows drag-n-drop and resizing of reservation blocks, with hover-based detail views.

---

### Data Handling

- **Mock Data Only**: Use hardcoded data for rooms and reservations in constants.

```ts
// rooms.ts
export const ROOMS = [
	{ id: '101', title: 'Room 101', type: 'GLSK' },
	{ id: '102', title: 'Room 102', type: 'GLSK' }
	// ...
];

// bookings.ts
export const BOOKINGS = [
	{
		id: 'booking-1',
		guestName: 'Susan Halim',
		roomId: '102',
		startDate: '2023-08-04',
		endDate: '2023-08-07',
		status: 'InHouse'
		// ...
	}
	// ...
];
```

---

### Layout Requirements

- **Left Pane: Room List**

  - Displays room number and type.
  - Tooltip on hover to show room details (e.g., type, status).
  - Include icons (e.g., smoking, clean) as in the legend.

- **Main Pane: Booking Timeline**

  - Each column represents a date.
  - Each row represents a room.
  - Booking items are shown as horizontal bars.
  - Bars can:

    - Be resized (start and end dates).
    - Be dragged to different rooms and/or dates.
    - Show tooltip on hover with guest and booking details (e.g., guest name, rate plan, etc.).

  - Show different statuses using colors and icons (refer to the legend in screenshot).

---

### Component Behavior

| Feature                       | Description                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| Drag & Drop                   | Can move bookings across rooms and days.                           |
| Resizable                     | Booking blocks should be resizable by left/right edges.            |
| Tooltip (Hover: Booking Item) | Shows guest info, dates, status, price, etc.                       |
| Tooltip (Hover: Room Row)     | Shows room type, status, and additional room-level metadata.       |
| Icons                         | Use emojis or imported icons to simulate Clean, VIP, Smoking, etc. |
| Lock Control                  | Each booking block has a lock button to prevent modifications.     |

### Lock Functionality

- **Lock Button**:

  - Display a lock icon button on each booking block
  - Position: Right corner of the booking block
  - Visual states:
    - Unlocked: Open lock icon
    - Locked: Closed lock icon
  - Toggle between locked/unlocked states on click

- **Locked State Behavior**:

  - Prevent drag and drop operations
  - Disable resizing functionality
  - Visual indication of locked state (e.g., different border style or different color block)

- **Unlocked State Behavior**:

  - Enable all normal booking block interactions
  - Allow drag and drop
  - Allow resizing
  - Return to default visual style

- **Lock Status Storage**:

  - Store lock status in the booking data
  - Include lock status in booking object:
    ```ts
    {
      id: 'booking-1',
      guestName: 'Susan Halim',
      roomId: '102',
      startDate: '2023-08-04',
      endDate: '2023-08-07',
      status: 'InHouse',
      isLocked: boolean
    }
    ```

- **Lock Button Interaction**:
  - Show tooltip on hover explaining lock functionality
  - Animate icon transition between states
  - Provide visual feedback on click
  - Maintain lock state during all booking operations

### Booking Conflict Prevention

- **Conflict Detection**:

  - Prevent overlapping bookings in the same room
  - Check for conflicts when:
    - Adding new bookings
    - Updating existing booking dates
    - Moving bookings to different rooms
  - A booking conflicts if:
    - New booking starts before existing booking ends AND
    - New booking ends after existing booking starts
  - Exclude the booking being updated from conflict check

- **Conflict Handling**:

  - Show alert message when conflict is detected
  - Revert booking to original state after conflict
  - Prevent the operation from completing
  - Alert message should indicate:
    - Type of operation (move/resize)
    - Target room (if moving)
    - Reason for conflict

- **Date Handling**:
  - Use YYYY-MM-DD format for consistent date comparison
  - Allow bookings to end on same day another starts
  - Allow bookings to start on same day another ends
  - This ensures room preparation time between bookings

### Confirmation Modals

- **Resize Confirmation**:

  - Show modal when resizing booking dates
  - Display:
    - Original dates (from-to)
    - New dates (from-to)
    - Guest name
  - Buttons:
    - Confirm: Apply the changes
    - Cancel: Revert to original state
  - Handle conflicts after confirmation

- **Room Change Confirmation**:

  - Show modal when moving booking to different room
  - Display:
    - Original room and dates
    - New room and dates
    - Guest name
  - Buttons:
    - Confirm: Apply the room change
    - Cancel: Revert to original room
  - Handle conflicts after confirmation

- **Modal Behavior**:
  - Prevent interaction with timeline while modal is open
  - Close modal automatically after successful operation
  - Keep modal open if conflict is detected
  - Allow cancellation at any time
  - Maintain booking's visual state during confirmation

### New Booking Creation

- **Create Button**:

  - Fixed position button in the top-right corner
  - Icon: Plus (+) symbol
  - Label: "New Booking"
  - Hover effect to indicate clickability

- **Creation Modal**:

  - Form fields:
    - Guest Name (text input)
    - Room Selection (dropdown)
      - Show room number and type
      - Disable rooms with conflicts
    - Start Date (date picker)
      - Min date: today
      - Max date: configurable
    - End Date (date picker)
      - Min date: start date
      - Max date: configurable
    - Rate Plan (dropdown)
      - Options: CORP, RACK, etc.
    - Price (number input)
      - Auto-calculate based on rate plan and duration
      - Allow manual override
    - Status (dropdown)
      - Options: Reserved, InHouse
    - Notes (optional text area)

- **Validation Rules**:

  - Guest name is required
  - Room must be selected
  - End date must be after start date
  - Minimum stay duration: 1 day
  - Maximum stay duration: configurable
  - Price must be positive number
  - Check for conflicts before allowing creation

- **Modal Behavior**:

  - Show loading state during conflict check
  - Display error messages for validation failures
  - Show conflict warning if dates overlap
  - Auto-close on successful creation
  - Clear form on cancel
  - Maintain form data if validation fails

- **Success Handling**:

  - Add new booking to timeline
  - Highlight new booking briefly
  - Show success message
  - Option to create another booking

- **Error Handling**:
  - Display specific error messages
  - Keep form data on error
  - Allow retry after fixing errors
  - Show conflict details if applicable

---

### Suggested Libraries (Svelte Compatible)

- **Timeline Rendering**:

  - [`svelte-calendar-timeline`](https://github.com/bmartel/svelte-calendar-timeline)
  - _OR_ custom build using `d3` or `svelte-dnd-action`

- **Drag and Drop**:

  - [`svelte-dnd-action`](https://github.com/isaacHagoel/svelte-dnd-action)

- **Tooltip**:

  - [`floating-ui-svelte`](https://github.com/codediodeio/floating-ui-svelte)
  - Or custom `<div class="tooltip">` on hover

---

### Responsiveness

- Scrollable horizontally by date.
- Left sidebar sticky with vertical scroll.
- Ensure drag/drop and resize works on both desktop and tablet.

---

### Legend

- Bottom section for icon explanation (Clean, Inspect, Smoking, VIP, etc.).
- Can be static or collapsible panel.

---

### Components to Implement

1. `<RoomList />`: Shows room names and hoverable info
2. `<BookingTimeline />`: Renders timeline with drag-resize blocks
3. `<BookingBlock />`: Each block with guest info
4. `<Tooltip />`: Shows hover details
5. `<Legend />`: Color/icon explanations
