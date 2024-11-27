<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const numbers = ref([1, 2, 3, 4, 5, 6]);
const { parent, removeAt } = useDragAndDrop<number>(numbers as any, {
  direction: "horizontal",
  removingClass: "removed",
  delayBeforeRemove: 500,
});

const { id } = defineProps<{
  id: string;
}>();
</script>
<template>
  <div ref="parent" :id="id" class="list">
    <div
      v-for="(element, index) in numbers"
      :key="element"
      :index="index"
      :id="'horizontal-child-' + +element.toString()"
      class="number"
    >
      {{ element }}
      <button class="remove-button" @click="removeAt(index)">X</button>
    </div>
  </div>
</template>
<style scoped>
.list {
  display: flex;
  padding: 10px;
  flex-direction: row;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  opacity: 1;
  transition: opacity 200ms ease;
}
.number.removed {
  opacity: 0;
}
</style>
