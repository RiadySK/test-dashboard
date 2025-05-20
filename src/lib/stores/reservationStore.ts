import { writable, derived } from 'svelte/store';
import type { Reservation, DetailedReservation, ReservationFilter } from '$lib/types';
import { reservationApi } from '$lib/api';

// Store for reservation list
export const reservations = writable<Reservation[]>([]);
export const isLoading = writable(false);
export const error = writable<string | null>(null);
export const currentFilter = writable<ReservationFilter>({});

// Store for pagination
export const currentPage = writable(1);
export const itemsPerPage = writable(10);
export const totalItems = writable(0);

// Store for detailed reservation
export const currentReservation = writable<DetailedReservation | null>(null);

// Derived store for paginated reservations
export const paginatedReservations = derived(
  [reservations, currentPage, itemsPerPage],
  ([$reservations, $currentPage, $itemsPerPage]) => {
    const start = ($currentPage - 1) * $itemsPerPage;
    const end = start + $itemsPerPage;
    return $reservations.slice(start, end);
  }
);

// Actions
export async function fetchReservations(filters?: ReservationFilter) {
  isLoading.set(true);
  error.set(null);
  
  try {
    if (filters) {
      currentFilter.set(filters);
    }
    
    const data = await reservationApi.list(filters);
    reservations.set(data);
    totalItems.set(data.length);
    currentPage.set(1);
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to fetch reservations');
    reservations.set([]);
  } finally {
    isLoading.set(false);
  }
}

export async function fetchReservationById(id: number) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const data = await reservationApi.getById(id);
    currentReservation.set(data);
    return data;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to fetch reservation details');
    currentReservation.set(null);
    return null;
  } finally {
    isLoading.set(false);
  }
}

export async function createReservation(data: any) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const result = await reservationApi.create(data);
    await fetchReservations();
    return result;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to create reservation');
    return null;
  } finally {
    isLoading.set(false);
  }
}

export async function updateReservation(id: number, data: any) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const result = await reservationApi.update(id, data);
    await fetchReservationById(id);
    await fetchReservations(currentFilter);
    return result;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to update reservation');
    return null;
  } finally {
    isLoading.set(false);
  }
}

export async function cancelReservation(id: number, reason: string) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const result = await reservationApi.cancel(id, reason);
    await fetchReservations(currentFilter);
    return result;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to cancel reservation');
    return null;
  } finally {
    isLoading.set(false);
  }
}

export async function checkInGuest(id: number, data: any) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const result = await reservationApi.checkIn(id, data);
    await fetchReservationById(id);
    await fetchReservations(currentFilter);
    return result;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to check in guest');
    return null;
  } finally {
    isLoading.set(false);
  }
}

export async function checkOutGuest(id: number) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const result = await reservationApi.checkOut(id);
    await fetchReservationById(id);
    await fetchReservations(currentFilter);
    return result;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to check out guest');
    return null;
  } finally {
    isLoading.set(false);
  }
} 