import type {
	Reservation,
	DetailedReservation,
	CreateReservationRequest,
	ReservationFilter,
	UserProfile,
	ProfileListResponse
} from './types';

const API_BASE = '/api/proxy';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || `API error: ${response.status}`);
	}
	return (await response.json()) as T;
}

// Function to build URL with query parameters
function buildUrl(path: string, params?: Record<string, string>): string {
	const url = new URL(`${API_BASE}${path}`, window.location.origin);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value) {
				url.searchParams.append(key, value);
			}
		});
	}

	return url.toString();
}

// Profile API functions
export const profileApi = {
	// List all profiles
	async list(): Promise<UserProfile[]> {
		const response = await fetch(`${API_BASE}/profiles`);
		return handleResponse<ProfileListResponse>(response);
	}
};

// Reservation API functions
export const reservationApi = {
	// List all reservations with optional filters
	async list(filters?: ReservationFilter): Promise<Reservation[]> {
		const url = buildUrl('/reservations', filters as Record<string, string>);
		const response = await fetch(url);
		return handleResponse<Reservation[]>(response);
	},

	// Get detailed reservation data
	async getById(id: number): Promise<DetailedReservation> {
		const response = await fetch(`${API_BASE}/reservations/${id}`);
		return handleResponse<DetailedReservation>(response);
	},

	// Create a new reservation
	async create(
		data: CreateReservationRequest
	): Promise<{ ReservationID: number; confirmationNumber: string; guestName: string }> {
		const response = await fetch(`${API_BASE}/reservations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		return handleResponse(response);
	},

	// Update reservation
	async update(
		id: number,
		data: { notes?: string; stays?: Array<any> }
	): Promise<DetailedReservation> {
		const response = await fetch(`${API_BASE}/reservations/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		return handleResponse<DetailedReservation>(response);
	},

	// Cancel reservation
	async cancel(id: number, reason: string): Promise<{ message: string }> {
		const response = await fetch(`${API_BASE}/reservations/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ reason })
		});
		return handleResponse(response);
	},

	// Check-in a guest
	async checkIn(
		id: number,
		data: any
	): Promise<{ message: string; reservation: DetailedReservation }> {
		const response = await fetch(`${API_BASE}/reservations/${id}/check-in`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		return handleResponse(response);
	},

	// Check-out a guest
	async checkOut(id: number): Promise<{ message: string; reservation: DetailedReservation }> {
		const response = await fetch(`${API_BASE}/reservations/${id}/check-out`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return handleResponse(response);
	}
};
