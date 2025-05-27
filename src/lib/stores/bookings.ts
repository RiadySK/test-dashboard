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
}

// Initial bookings data
const initialBookings: Booking[] = [
	{
		id: 'booking-1',
		guestName: 'Susan Halim',
		roomId: '102',
		startDate: '2023-08-04',
		endDate: '2023-08-07',
		status: 'InHouse',
		ratePlan: 'CORP',
		price: 5000000
	},
	{
		id: 'booking-2',
		guestName: 'Ibu Olivia Tanuwijaya',
		roomId: '101',
		startDate: '2023-08-10',
		endDate: '2023-08-14',
		status: 'Reserved',
		ratePlan: 'CORP',
		price: 4000000
	}
];

// Create the store
export const bookings = writable<Booking[]>(initialBookings);

// Helper functions to update bookings
export function updateBookingDates(bookingId: string, newStartDate: string, newEndDate: string) {
	bookings.update((currentBookings) =>
		currentBookings.map((booking) =>
			booking.id === bookingId
				? { ...booking, startDate: newStartDate, endDate: newEndDate }
				: booking
		)
	);
}

export function addBooking(booking: Booking) {
	bookings.update((currentBookings) => [...currentBookings, booking]);
}

export function removeBooking(bookingId: string) {
	bookings.update((currentBookings) =>
		currentBookings.filter((booking) => booking.id !== bookingId)
	);
}
