<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";

const list = $state([1, 2, 3, 4, 5]);
const [ parent ] = useDragAndDrop(list, { direction: "horizontal" });
</script>
<div use:parent class="number-list">
  {#each list as element, index (element)}
    <div class="number" data-index = {index}>
      { element }
    </div>
  {/each}
</div>
<style>
.number {
  border-style: solid;
  padding-inline: 35px;
  margin-left: 10px;
  margin-top: 0.25rem !important;
  padding-bottom: 40px;
  padding-top: 40px;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
}
.number-list {
  display: flex;
  flex-direction: row;
  border-style: solid;
  border-width: 2px;
  padding: 20px;
  overflow-x: auto;
}
</style>
