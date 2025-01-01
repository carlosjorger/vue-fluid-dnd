<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
import Droppable from "./Droppable.vue";

const droppables = ref(['A', 'B']);
const { parent } = useDragAndDrop<number>(droppables as any, {
  direction: "horizontal",
});
function getList(droppable: string){
    return Array.from({length:3}, (_,index)=>index).map(number=>`${droppable}-${number}`)
}
const { id } = defineProps<{
  id: string;
}>();

</script>
<template>
  <div ref="parent" :id="id" class="list">
    <div
      v-for="(element, index) in droppables"
      :index="index"
      :id="'horizontal-child-' + +element.toString()"
      class="droppable-child"
    >
      {{ element }}
      <Droppable :list="getList(element)" />
    </div>
  </div>
</template>
<style scoped>
.list {
  display: flex;
  padding: 10px;
  flex-direction: row;
}
.droppable-child {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 200px;
}
</style>
