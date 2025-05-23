<script lang="ts">
  import { page } from '$app/stores';
</script>

<header class="h-screen w-64 bg-white shadow-lg flex flex-col">
  <nav class="flex-1 px-4 py-6">
    <div class="flex flex-col space-y-2">
      <a 
        href="/" 
        class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/' ? 'bg-blue-50 text-blue-600' : ''}"
      >
        Home
      </a>
      <a 
        href="/reservations" 
        class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname.startsWith('/reservations') ? 'bg-blue-50 text-blue-600' : ''}"
      >
        Reservation List
      </a>
    </div>
  </nav>
</header> 