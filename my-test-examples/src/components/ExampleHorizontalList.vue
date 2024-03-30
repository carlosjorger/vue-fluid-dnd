<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const numbers = ref([1, 2, 3, 4, 5, 6, 7]);
const { parent } = useDragAndDrop<number>(numbers as any, {
  direction: "horizontal",
});

defineProps<{
  droppableId: string;
}>();
</script>
<template>
  <div ref="parent" id="example-vertical-list-with-child-elements" class="list">
    <div
      v-for="(element, index) in numbers"
      :index="index"
      :id="'horizontal-child-' + +element.toString()"
      class="number"
    >
      {{ element }}
      <div style="display: flex; flex-direction: row">
        <span v-for="number in [...Array(4).keys()]">
          {{ number + element }}
        </span>
      </div>
    </div>
  </div>
</template>
<style>
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
  transition: all 150ms ease;
}
.number:hover {
  background-color: red;
}
</style>
