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

### Booking Information Display

- **Hover Information**:

  - Display a tooltip when hovering over any booking block
  - Show the following information:
    - Guest Name
    - Check-in Date and Time
    - Check-out Date and Time
    - Room Number
    - Booking Status (e.g., InHouse, Reserved)

- **Tooltip Design**:

  - Clean, modern design with clear information hierarchy
  - Use icons to represent different types of information
  - Color-coded status indicators
  - Responsive layout that works on all screen sizes
  - Maximum width to prevent oversized tooltips
  - Smooth fade-in/fade-out animation
  - Position tooltip to avoid screen edges

- **Interaction Behavior**:

  - Show tooltip after a short hover delay (e.g., 200ms)
  - Keep tooltip visible while hovering
  - Allow tooltip to be dismissed by moving mouse away
  - Prevent tooltip from interfering with drag operations
  - Support keyboard navigation for accessibility

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

### Timeline View Options

- **View Toggle**:

  - Integrated into table headers for intuitive interaction
  - Click on date header to toggle between views for that specific date
  - Example: Clicking "5 Aug 2025" header toggles between:
    - Daily view (default)
    - Hourly view for that specific date
  - Visual indicators:
    - Clock icon (🕒) appears when hovering over date header
    - Header background changes when in hourly view
    - Tooltip shows "Click to toggle hourly view"

- **Header Interaction**:

  - Single click: Toggle between daily and hourly view for that date
  - Double click: Expand to show full hourly view for that date
  - Right click: Show context menu with view options
    - "Show as Daily"
    - "Show as Hourly"
    - "Show as Monthly"
  - Visual feedback:
    - Header color changes when in different view modes
    - Hour markers appear/disappear with animation
    - Smooth transition between view modes

- **Hourly View Features**:

  - Display 24-hour timeline for selected date
  - Show hour markers (00:00 to 23:00)
  - Allow booking blocks to be placed by hour
  - Support for half-hour increments
  - Visual indicators for AM/PM periods
  - Zoom controls for detailed hour view
  - Collapse button to return to daily view

- **Day View Features**:

  - Default view showing daily bookings
  - Maintain existing functionality
  - Clear date headers with toggle indicators
  - Support for multiple bookings per day
  - Quick toggle to hourly view per date

- **Month View Features**:
  - Calendar-style monthly overview
  - Color-coded booking indicators
  - Hover to show booking details
  - Quick navigation between months
  - Visual indicators for:
    - Fully booked days
    - Partially booked days
    - Available days
  - Click on month header to expand/collapse

### Datetime-Based Booking

- **Booking Data Structure**:

  ```ts
  {
    id: 'booking-1',
    guestName: 'Susan Halim',
    roomId: '102',
    startDateTime: '2023-08-04T14:00:00', // ISO 8601 format
    endDateTime: '2023-08-07T12:00:00',   // ISO 8601 format
    status: 'InHouse',
    isLocked: boolean
  }
  ```

- **Time Handling**:

  - Store all dates as ISO 8601 datetime strings
  - Support for:
    - Check-in/check-out times
    - Hourly bookings
    - Half-day bookings
    - Full-day bookings
  - Default check-in time: 14:00
  - Default check-out time: 12:00

- **Booking Creation**:

  - Add time selection to booking form
  - Time picker for:
    - Check-in time
    - Check-out time
  - Validation rules:
    - Minimum stay duration (e.g., 1 hour)
    - Maximum stay duration
    - Valid check-in/check-out times
    - Room preparation time between bookings

- **Conflict Prevention**:

  - Enhanced conflict detection for time-based bookings
  - Consider:
    - Hour overlaps
    - Preparation time requirements
    - Room cleaning schedules
  - Show detailed conflict information including time

- **Visual Representation**:
  - Hourly view: Show exact booking times
  - Day view: Show check-in/check-out times in tooltips
  - Month view: Show booking duration indicators
