<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from '$lib/actions/clickOutside';
  
  interface Option {
    value: any;
    label: string;
    [key: string]: any;
  }
  
  export let options: Option[] = [];
  export let selectedValue: any = null;
  export let placeholder = 'Select an option';
  export let optionLabel = 'label';
  export let optionValue = 'value';
  export let showHeader = false;
  
  let isOpen = false;
  let selectedLabel = '';
  
  const dispatch = createEventDispatcher();
  
  function toggleDropdown() {
    isOpen = !isOpen;
  }
  
  function selectOption(option: Option) {
    selectedValue = option[optionValue];
    selectedLabel = option[optionLabel];
    isOpen = false;
    dispatch('select', { value: selectedValue, option });
  }
  
  function closeDropdown() {
    isOpen = false;
  }
  
  $: if (selectedValue && options.length > 0) {
    const selected = options.find(opt => opt[optionValue] === selectedValue);
    if (selected) {
      selectedLabel = selected[optionLabel];
    }
  }
</script>

<div class="relative" use:clickOutside={closeDropdown}>
  <button
    type="button"
    class="w-full flex items-center justify-between px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    on:click={toggleDropdown}
  >
    <span class="block truncate">
      {selectedLabel || placeholder}
    </span>
    <svg
      class="h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  {#if isOpen}
    <div
      class="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
    >
      {#if showHeader}
        <div class="px-3 py-2 border-b border-gray-200">
          <slot name="header">
            <div class="grid grid-cols-12 gap-2">
              <div class="col-span-4 font-medium text-gray-500">Name</div>
              <div class="col-span-5 font-medium text-gray-500">Email</div>
              <div class="col-span-3 font-medium text-gray-500 text-right">VIP Code</div>
            </div>
          </slot>
        </div>
      {/if}
      {#each options as option}
        <div
          class="cursor-pointer select-none relative py-2 px-3 hover:bg-blue-50 {selectedValue === option[optionValue] ? 'bg-blue-100' : ''}"
          on:click={() => selectOption(option)}
        >
          <slot name="option" {option}>
            {option[optionLabel]}
          </slot>
        </div>
      {/each}
    </div>
  {/if}
</div> 