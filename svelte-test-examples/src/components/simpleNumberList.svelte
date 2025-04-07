<script lang="ts">
	import '../app.css';
	let numbers = $state([1, 2, 3]);
</script>

<ul class="bg-slate-700 flex flex-col gap-2 max-w-2xl p-2">
   {#each numbers as number, index}
      <li class="bg-slate-400">
         {number}
      </li>
   {/each}
</ul>
