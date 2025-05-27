<script lang="ts">
  export let rooms = [];
  export let onRoomHover = () => {};
</script>
<ul>
  {#each rooms as room}
    <li class="p-2 hover:bg-gray-100 cursor-pointer" on:mouseenter={() => onRoomHover(room)}>
      <span class="font-semibold">{room.title}</span>
      <span class="ml-2 text-xs text-gray-500">{room.type}</span>
      <span title="Clean" class="ml-1">🧹</span>
      <span title="Smoking" class="ml-1">🚬</span>
    </li>
  {/each}
</ul> 