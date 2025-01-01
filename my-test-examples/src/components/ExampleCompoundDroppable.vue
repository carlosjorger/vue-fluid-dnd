<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
import Droppable from "./Droppable.vue";

const droppables = ref(['A', 'B']);
const { parent } = useDragAndDrop<number>(droppables as any, {
  direction: "horizontal",
});

const { id } = defineProps<{
  id: string;
}>();

</script>
<template>
  <div ref="parent" :id="id" class="list">
    <div
      v-for="(element, index) in droppables"
      :index="index"
      :id="'horizontal-child-' + element"
      class="droppable-child"
      :key="element"
    >
      {{ element }}
      <Droppable />
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
