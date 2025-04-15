<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";

const list = $state([1, 2, 3]);
const [ parent ] = useDragAndDrop(list, {
  draggingClass: "dragging",
});
</script>
<ul use:parent class="block px-6 p-8 bg-[var(--sl-color-gray-6)]">
  {#each list as element, index (element) }
      <li class="number border-solid mt-1 pl-1 border-2 border-[var(--sl-color-gray-1)]" data-index = {index}>
          { element }
      </li>
  {/each}
</ul>
<style>
:global(.temp-child) {
  margin-top: 0 !important;
}
:global(.dragging) {
  transition: background-color color 150ms ease-in, color 150ms ease-in;
  background-color: var(--sl-color-gray-1);
  color: black;
}
</style>
