<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";
const list = $state([1, 2, 3, 4]);
const [ parent ] = useDragAndDrop(list, {
  isDraggable: (el) => !el.classList.contains("is-not-draggable"),
});
</script>
<ul use:parent class="number-list p-8 bg-[var(--sl-color-gray-6)]">
  {#each list as element, index (element)}
    <li class="number { element % 2 == 0? 'is-not-draggable' : ''}" data-index={index}>
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
.is-not-draggable {
  background-color: var(--sl-color-gray-3);
}
:global(.temp-child) {
  margin-top: 0 !important;
}
</style>
