import { writable } from 'svelte/store';

export interface Booking {
	id: string;
	guestName: string;
	roomId: string;
	startDate: string;
	endDate: string;
	status: 'InHouse' | 'Reserved';
	ratePlan: string;
	price: number;
	isLocked: boolean;
}

// Initial bookings data
const initialBookings: Booking[] = [
	{
		id: 'booking-1',
		guestName: 'Susan Halim',
		roomId: '102',
		startDate: '2025-08-04',
		endDate: '2025-08-07',
		status: 'InHouse',
		ratePlan: 'CORP',
		price: 5000000,
		isLocked: false
	},
	{
		id: 'booking-2',
		guestName: 'Ibu Olivia Tanuwijaya',
		roomId: '101',
		startDate: '2025-08-10',
		endDate: '2025-08-14',
		status: 'Reserved',
		ratePlan: 'CORP',
		price: 4000000,
		isLocked: false
	}
];

// Create the store
export const bookings = writable<Booking[]>(initialBookings);

// Helper function to parse date string to YYYY-MM-DD format
function parseDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toISOString().split('T')[0];
}

// Helper function to check for booking conflicts
function hasBookingConflict(
	bookings: Booking[],
	roomId: string,
	startDate: string,
	endDate: string,
	excludeBookingId?: string
): boolean {
	// Parse dates to YYYY-MM-DD format for consistent comparison
	const newStart = parseDate(startDate);
	const newEnd = parseDate(endDate);

	return bookings.some((booking) => {
		if (booking.roomId !== roomId) return false;
		if (excludeBookingId && booking.id === excludeBookingId) return false;

		const existingStart = parseDate(booking.startDate);
		const existingEnd = parseDate(booking.endDate);

		// A booking conflicts if:
		// 1. New booking starts before existing booking ends AND
		// 2. New booking ends after existing booking starts
		// This ensures no overlap between bookings
		return newStart < existingEnd && newEnd > existingStart;
	});
}

// Helper function to check for conflicts when changing rooms
export function checkRoomChangeConflict(
	bookings: Booking[],
	bookingId: string,
	newRoomId: string,
	newStartDate: string,
	newEndDate: string
): boolean {
	const booking = bookings.find((b) => b.id === bookingId);
	if (!booking) return false;

	// Check if there are any conflicts in the new room
	return hasBookingConflict(bookings, newRoomId, newStartDate, newEndDate);
}

// Helper functions to update bookings
export function updateBookingDates(bookingId: string, newStartDate: string, newEndDate: string) {
	let hasConflict = false;

	bookings.update((currentBookings) => {
		const booking = currentBookings.find((b) => b.id === bookingId);
		if (!booking) return currentBookings;

		// Check if booking is locked
		if (booking.isLocked) return currentBookings;

		// Check for conflicts with other bookings (excluding this one)
		hasConflict = hasBookingConflict(
			currentBookings,
			booking.roomId,
			newStartDate,
			newEndDate,
			bookingId
		);

		if (hasConflict) return currentBookings;

		return currentBookings.map((booking) =>
			booking.id === bookingId
				? { ...booking, startDate: newStartDate, endDate: newEndDate }
				: booking
		);
	});

	return !hasConflict;
}

export function updateBookingRoomAndDates(
	bookingId: string,
	newRoomId: string,
	newStartDate: string,
	newEndDate: string
) {
	let hasConflict = false;

	bookings.update((currentBookings) => {
		const booking = currentBookings.find((b) => b.id === bookingId);
		if (!booking) return currentBookings;

		// Check if booking is locked
		if (booking.isLocked) return currentBookings;

		// Check for conflicts in the new room (excluding this booking)
		hasConflict = hasBookingConflict(
			currentBookings,
			newRoomId,
			newStartDate,
			newEndDate,
			bookingId
		);

		if (hasConflict) return currentBookings;

		return currentBookings.map((booking) =>
			booking.id === bookingId
				? { ...booking, roomId: newRoomId, startDate: newStartDate, endDate: newEndDate }
				: booking
		);
	});

	return !hasConflict;
}

export function addBooking(booking: Booking) {
	let hasConflict = false;

	bookings.update((currentBookings) => {
		hasConflict = hasBookingConflict(
			currentBookings,
			booking.roomId,
			booking.startDate,
			booking.endDate
		);

		if (hasConflict) return currentBookings;
		return [...currentBookings, booking];
	});

	return !hasConflict;
}

export function removeBooking(bookingId: string) {
	bookings.update((currentBookings) =>
		currentBookings.filter((booking) => booking.id !== bookingId)
	);
}

// Add new function to toggle lock status
export function toggleBookingLock(bookingId: string) {
	bookings.update((currentBookings) =>
		currentBookings.map((booking) =>
			booking.id === bookingId ? { ...booking, isLocked: !booking.isLocked } : booking
		)
	);
}
