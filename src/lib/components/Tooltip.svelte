<script lang="ts">
  import { useFloating } from "@skeletonlabs/floating-ui-svelte";

  export let content = '';
  let reference: HTMLElement;
  let floatingEl: HTMLDivElement;
  let floating: ReturnType<typeof useFloating>;
</script>

<span bind:this={reference}>
  <slot />
  {#if content}
    <div
      bind:this={floatingEl}
      use:floating={{ reference, floating: floatingEl, placement: 'top' }}
      class="z-50 bg-black text-white text-xs rounded px-2 py-1 shadow-lg absolute"
    >
      {content}
    </div>
  {/if}
</span> 