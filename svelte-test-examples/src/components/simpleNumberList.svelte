<script lang="ts">
	import '../app.css';
   
   import useDragAndDrop from '../../../src/svelte/useDragAndDrop.svelte.ts';
	let numbers = $state([1, 2, 3]);
   const [dragAnDrop, removeAt] = useDragAndDrop(numbers,{
      removingClass: "removed",
      delayBeforeRemove: 400,
   });
   const RemoveFirst = () => {
      if (numbers.length > 0) {
         removeAt(0);
      }
   }
</script>

<ul class="bg-slate-700 flex flex-col gap-2 max-w-2xl p-2" use:dragAnDrop>
   {#each numbers as number, index (number)}
      <li class="bg-slate-400 number" data-index={index}>
         {number}
      </li>
   {/each}
</ul>
<button class="bg-slate-400 p-2" onclick={RemoveFirst}>Remove first</button>
<style>
   .number {
      opacity: 1;
      transition: opacity 200ms ease;
   }
   :global(.number.removed) {
      opacity: 0;
   }
</style>
