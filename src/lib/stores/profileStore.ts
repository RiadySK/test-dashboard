import { writable, derived } from 'svelte/store';
import type { UserProfile } from '$lib/types';
import { profileApi } from '$lib/api';

// Store for profile list
export const profiles = writable<UserProfile[]>([]);

// Store for loading state
export const isLoading = writable(false);

// Store for error state
export const error = writable<string | null>(null);

// Derived store for filtered profiles
export const filteredProfiles = derived([profiles], ([$profiles]) => $profiles);

// Load profiles
export async function loadProfiles() {
	isLoading.set(true);
	error.set(null);
	try {
		const data = await profileApi.list();
		profiles.set(data);
	} catch (e) {
		error.set(e instanceof Error ? e.message : 'Failed to fetch profiles');
	} finally {
		isLoading.set(false);
	}
}
