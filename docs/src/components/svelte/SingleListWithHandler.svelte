<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";
import Handler from "@/components/icons/svelte/handler.svelte";

const handlerSelector = ".handler";
const list = $state([1, 2, 3, 4, 5]);
const [ parent ] = useDragAndDrop(list, {
  handlerSelector,
});
</script>
<ul use:parent class="number-list p-8 bg-[var(--sl-color-gray-6)]">
  {#each list as element, index}
    <li class="number" data-index={index}>
      <Handler class="handler" />
      { element }
    </li>
  {/each}
</ul>

<style>
  .number {
    border-style: solid;
    padding-left: 10px;
    padding-block: 5px;
    margin-top: 0.25rem;
    border-width: 2px;
    border-color: var(--sl-color-gray-1);
    display: flex;
    flex-direction: row;
    gap: 0.4rem;
    align-items: center;
    color: var(--sl-color-gray-2);
  }
  
  .number-list {
    display: block;
    padding-inline: 25px;
  }
  :global(.handler){
    width: 0.5rem;
    margin-bottom: 0 !important;
  }
  :global(.temp-child) {
    margin-top: 0 !important;
  }
</style>
