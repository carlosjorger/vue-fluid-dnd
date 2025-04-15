<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";

const list = $state([1, 2, 3, 4, 5]);
const [ parent1 ] = useDragAndDrop(list, {
  droppableGroup: "group1",
  droppableClass: 'droppable-hover'
});

const list2 = $state([6, 7, 8, 9, 10]);
const [ parent2 ] = useDragAndDrop(list2, {
  droppableGroup: "group1",
  direction: "horizontal",
  droppableClass: 'droppable-hover'
});

</script>

<div class="group-list bg-[var(--sl-color-gray-6)]">
  <ul use:parent1 class="number-list">
    {#each list as element, index (element) }
      <li class="number"  data-index={index}>
        { element }
      </li>
    {/each}
  </ul>
  <div use:parent2 class="number-list-h">
    {#each list2 as element, index (element) }
      <div class="number"  data-index={index}>
        { element }
      </div>
    {/each}
  </div>
</div>

<style>
.number {
  border-style: solid;
  padding-left: 10px;
  padding-block: 5px;
  margin-top: 0.25rem !important;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
  color: var(--sl-color-gray-2);
  min-width: 120px;
  width: 120px;
}

.number-list {
  display: block;
  height: 290px;
  overflow-y: auto;
  background-color: var(--sl-color-gray-5);
  padding: 1.5rem;
  transition: background-color 150ms ease-in;
}
:global(.number-list.droppable-hover){
  background-color: var(--sl-color-gray-4);
}
.number-list-h {
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  padding-inline: 25px;
  margin-top: 0 !important;
  padding: 1.5rem;
  transition: background-color 150ms ease-in;
}
:global(.number-list-h.droppable-hover){
  background-color: var(--sl-color-gray-4);
}
:global(.temp-child) {
  margin-top: 0 !important;
}
</style>
