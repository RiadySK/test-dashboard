<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
</script>

<header>
	<div class="logo">
		<a href="https://svelte.dev/docs/kit">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>
				<a href="/sverdle">Sverdle</a>
			</li>
		</ul>
	</nav>

	<div class="github">
		<a href="https://github.com/sveltejs/kit">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		flex-direction: column;
		width: 250px;
		background: white;
		padding: 1rem;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
		height: 100vh;
	}

	.logo {
		padding: 1rem 0;
		text-align: center;
	}

	.logo img {
		width: 2.5em;
		height: 2.5em;
		object-fit: contain;
	}

	nav {
		flex: 1;
		margin: 2rem 0;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	li {
		width: 100%;
	}

	li[aria-current='page'] {
		background: var(--color-theme-1);
		border-radius: 4px;
	}

	li[aria-current='page'] a {
		color: white;
	}

	nav a {
		display: block;
		padding: 0.75rem 1rem;
		color: var(--color-text);
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		border-radius: 4px;
	}

	nav a:hover {
		background: rgba(0, 0, 0, 0.05);
		color: var(--color-theme-1);
	}

	.github {
		padding: 1rem 0;
		text-align: center;
		margin-top: auto;
	}

	.github img {
		width: 2em;
		height: 2em;
		opacity: 0.7;
		transition: opacity 0.2s ease;
	}

	.github img:hover {
		opacity: 1;
	}
</style>
