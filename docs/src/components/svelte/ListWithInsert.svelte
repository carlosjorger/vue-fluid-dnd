<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";

type Props = {
  insertingFromClass?: string;
  delayBeforeInsert?: number;
}
const { insertingFromClass, delayBeforeInsert }:Props = $props();

const list = $state([] as number []);
const [ parent, insertAt ] = useDragAndDrop(list,{
  insertingFromClass,
  delayBeforeInsert,
});
</script>

<ul use:parent class="number-list px-8 py-4 bg-[var(--sl-color-gray-6)]">
  {#each list as element, index (element) }
    <li class="number" data-index={index}>
      { element }
    </li>
  {/each}
</ul>
<button class="insert-button mx-5 bg-slate-100 rounded-2xl w-12" onclick={insertAt(list.length, list.length)}>+</button>

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
:global(.number.inserting){
  opacity: 0;
}
.number-list {
  display: block;
  padding-inline: 25px;
  min-height: 101px;
}
.insert-button{
  cursor: pointer;
  margin-bottom: 0 !important;
}
:global(.temp-child){
  margin-top: 0 !important;
}
</style>