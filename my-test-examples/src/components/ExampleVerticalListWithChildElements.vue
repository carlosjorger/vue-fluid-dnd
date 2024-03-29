<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
const numbers = ref([1, 2, 3, 4, 5]);

defineProps<{
  droppableId: string;
}>();
const { parent } = useDragAndDrop<number>(numbers as any);
</script>
<template>
  <ul
    ref="parent"
    id="example-vertical-list-with-child-elements"
    class="vertical-list"
  >
    <li
      v-for="(element, index) in numbers"
      :draggable-id="'number-' + element.toString()"
      :index="index"
      :id="'child-with-children-' + +element.toString()"
      class="number"
    >
      {{ element }}
      <div style="display: flex; flex-direction: row">
        <span v-for="number in [...Array(4).keys()]">
          {{ number + element }}
        </span>
      </div>
    </li>
  </ul>
</template>
<style>
.vertical-list {
  display: block;
  padding-inline: 10px;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  transition: background-color 150ms ease;
}
.number:hover {
  background-color: red;
}
</style>
