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
<template>
  <Droppable droppable-id="1" direction="vertical" :items="list">
    <div style="display: block; padding: 10px">
      <Draggable
        v-for="(element, index) in list"
        v-slot="{ setRef }"
        :draggable-id="element['draggable-id']"
        :index="index"
      >
        <div
          class="ball"
          :ref="setRef"
          :style="{ 'background-color': element.backgroundColor }"
        ></div>
      </Draggable>
    </div>
  </Droppable>
</template>

<style>
.ball {
  border-color: white;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  margin: 2rem !important;
}
</style>
