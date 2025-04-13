<script lang="ts">
    import { useDragAndDrop } from "fluid-dnd/svelte";
    
    const list = $state([...Array(20).keys()]);
    const [ parent ] = useDragAndDrop(list);
</script>
<ul use:parent class="block px-2 overflow-y-auto w-10/12 h-80 pl-7">
    {#each list as element, index }
        <li class="solid mt-1 border-2" data-index = {index}>
            { element }
        </li>
    {/each }
</ul>
<style>
    :global(.temp-child){
      margin-top: 0 !important;
    }
</style>