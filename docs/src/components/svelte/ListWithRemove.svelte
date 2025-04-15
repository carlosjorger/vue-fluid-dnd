<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";
type Props = {
  removingClass?: string;
  delayBeforeRemove?: number;
}
const { removingClass, delayBeforeRemove }:Props = $props();

const list = $state([1, 2, 3, 4, 5]);
const [ parent,_,removeAt ] = useDragAndDrop(list,{ 
  removingClass,
  delayBeforeRemove
});
</script>

<ul use:parent class="number-list p-8 bg-[var(--sl-color-gray-6)]">
  {#each list as element, index (element)}
    <li class="number"  data-index={index}>
      { element }
      <button class="remove-button" onclick={removeAt(index)}>x</button>
    </li>
  {/each}
</ul>

<style>
.number {
  border-style: solid;
  padding-left: 5px;
  margin-top: 0.25rem;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
  opacity: 1;
  transition: opacity 200ms ease;
  display: flex;
  justify-content: space-between
  /*
    ...
  */
}
:global(.number.removed){
  opacity: 0;
}
.number-list {
  display: block;
  padding-inline: 25px;
}
.remove-button{
  cursor: pointer;
  margin-bottom: 0 !important;
  background-color: red
}
:global(.temp-child){
  margin-top: 0 !important;
}
</style>