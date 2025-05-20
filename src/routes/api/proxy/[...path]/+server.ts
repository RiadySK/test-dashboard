import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_BASE = 'https://lotus-hms.vercel.app/frontend_api';

export const GET: RequestHandler = async ({ params, url }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const queryString = url.search;
	const targetUrl = `${API_BASE}/${path}${queryString}`;

	try {
		const response = await fetch(targetUrl);
		const data = await response.json();
		return json(data);
	} catch (error: unknown) {
		console.error('Proxy error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const POST: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE}/${path}`;
	const body = await request.json();

	try {
		const response = await fetch(targetUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		const data = await response.json();
		return json(data);
	} catch (error: unknown) {
		console.error('Proxy error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE}/${path}`;
	const body = await request.json();

	try {
		const response = await fetch(targetUrl, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		const data = await response.json();
		return json(data);
	} catch (error: unknown) {
		console.error('Proxy error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE}/${path}`;
	const body = await request.json();

	try {
		const response = await fetch(targetUrl, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		const data = await response.json();
		return json(data);
	} catch (error: unknown) {
		console.error('Proxy error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
