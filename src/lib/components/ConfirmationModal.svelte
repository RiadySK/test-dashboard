<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let show = false;
  export let title = 'Confirm Changes';
  export let message = '';
  
  const dispatch = createEventDispatcher();
  
  function handleConfirm() {
    dispatch('confirm');
    show = false;
  }
  
  function handleCancel() {
    dispatch('cancel');
    show = false;
  }
</script>

{#if show}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">{title}</h3>
      <p class="text-gray-600 mb-6">{message}</p>
      <div class="flex justify-end space-x-4">
        <button
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          on:click={handleCancel}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          on:click={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
{/if} 