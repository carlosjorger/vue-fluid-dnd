<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
const numbers = ref([1, 2, 3, 4, 5, 6]);

const { id } = defineProps<{
  id: string;
}>();
const { parent } = useDragAndDrop<number>(numbers as any, {
  handlerClass: "drag-handle",
});
</script>
<template>
  <ul ref="parent" :id="id" class="vertical-list">
    <li
      v-for="(element, index) in numbers"
      :index="index"
      :id="'child-with-children-' + +element.toString()"
      class="number"
      :key="element"
    >
      <div class="draggable-wrapper">
        <span class="drag-handle">☰</span>
        {{ element }}
      </div>
    </li>
  </ul>
</template>
<style>
.draggable-wrapper {
  border-width: 10px;
  border-style: solid;
  margin: 2px;
  padding-inline: 4px;
  padding-block: 5px;
}
.vertical-list {
  display: block;
  padding-inline: 10px;
  padding-block: 5px;
}
.number {
  padding-left: 10px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
.drag-handle {
  float: left;
  padding: 0px 5px;
}
</style>
