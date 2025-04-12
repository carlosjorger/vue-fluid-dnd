<script lang="ts">
    import { useDragAndDrop } from "fluid-dnd/svelte";
    const list = $state([1, 2, 3]);
    const [ parent ] = useDragAndDrop(list);
</script>
<ul use:parent class="number-list p-8 bg-[var(--sl-color-gray-6)]">
    {#each list as element, index (element)}
        <li  class="number" data-index={index}>
            {element}
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
    }
    .number-list {
        display: block;
        padding-inline: 25px;
    }
    :global(.temp-child){
        margin-top: 0 !important;
    }
</style>
    