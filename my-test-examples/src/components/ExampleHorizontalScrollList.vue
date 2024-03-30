<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const numbers = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
]);

defineProps<{
  droppableId: string;
}>();

const { parent } = useDragAndDrop<number>(numbers as any, {
  direction: "horizontal",
});
</script>
<template>
  <div ref="parent" class="horizontal-scroll-list">
    <div
      v-for="(element, index) in numbers"
      :index="index"
      class="number"
      style="padding: 10px"
    >
      {{ element }}
    </div>
  </div>
</template>
<style>
.horizontal-scroll-list {
  display: flex;
  flex-direction: row;
  width: 40%;
  height: 200px;
  overflow: auto;
}
</style>
