<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const numbers = ref([1, 2, 3, 4, 5, 6]);
const { parent, removeAt } = useDragAndDrop<number>(numbers as any, {
  direction: "horizontal",
  removingClass: "removed",
  delayBeforeRemove: 500,
});
const verticalNumbers = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
]);
const numbersWithHandler = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
defineProps<{
  id: string;
}>();

const { parent: parent2, removeAt: removeAt2 } = useDragAndDrop<number>(
  verticalNumbers as any,
  {
    removingClass: "removed",
    delayBeforeRemove: 500,
  }
);
const { parent: parent3, removeAt: removeAt3 } = useDragAndDrop<number>(
  numbersWithHandler as any,
  {
    handlerSelector: ".drag-handle",
    removingClass: "removed",
    delayBeforeRemove: 300,
  }
);
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
  <ul ref="parent2" class="vertical-scroll-list">
    <li
      v-for="(element, index) in verticalNumbers"
      :key="element"
      :index="index"
      :id="'verticak-child-' + +element.toString()"
      class="number"
    >
      {{ element }}
      <button class="remove-button" @click="removeAt2(index)">X</button>
    </li>
  </ul>
  <ul ref="parent3" class="vertical-list">
    <li
      v-for="(element, index) in numbers"
      :index="index"
      :id="'child-with-children-' + +element.toString()"
      class="number-handler"
      :key="element"
    >
      <div class="draggable-wrapper">
        <span class="drag-handle"><i>☰</i></span>
        <span>{{ element }}</span>
        <button class="remove-button" @click="removeAt2(index)">X</button>
      </div>
    </li>
  </ul>
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
.number-handler {
  padding-left: 10px;
  padding-right: 20px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 60%;
}
.number.removed {
  opacity: 0;
}
.number-handler.removed {
  opacity: 0;
}
.drag-handle {
  float: left;
  padding: 0px 50px;
}
</style>
