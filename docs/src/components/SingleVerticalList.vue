<template>
  <h1>A</h1>
  <div>
    <div
      class="ball"
      v-for="(element, index) in list"
      :style="{ 'background-color': element.backgroundColor }"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Draggable, Droppable } from "vue3-juice-dnd";
const list = ref([
  {
    "draggable-id": "d1",
    backgroundColor: "red",
  },
  {
    "draggable-id": "d2",
    backgroundColor: "yellow",
  },
  {
    "draggable-id": "d3",
    backgroundColor: "blue",
  },
]);
</script>
<style>
.ball {
  border-color: white;
  margin-top: 10px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
</style>
