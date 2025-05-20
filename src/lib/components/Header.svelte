<script lang="ts">
  import { page } from '$app/stores';
</script>

<header class="bg-white shadow">
  <nav class="container mx-auto px-4 py-4">
    <div class="flex space-x-8">
      <a 
        href="/" 
        class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/' ? 'text-blue-600' : ''}"
      >
        Home
      </a>
      <a 
        href="/reservations" 
        class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname.startsWith('/reservations') ? 'text-blue-600' : ''}"
      >
        Reservation List
      </a>
    </div>
  </nav>
</header> 