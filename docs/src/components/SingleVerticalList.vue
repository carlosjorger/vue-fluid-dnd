<script setup lang="ts">
import { ref } from "vue";
import { Draggable, Droppable } from "vue3-juice-dnd";
const list = ref([1, 2, 3]);
</script>
<template>
  <Droppable droppable-id="1" direction="vertical" :items="list">
    <ul class="number-list">
      <Draggable
        v-for="(element, index) in list"
        v-slot="{ setRef }"
        :draggable-id="element.toString()"
        :index="index"
      >
        <li class="number" :ref="setRef">{{ element }}</li>
      </Draggable>
    </ul>
  </Droppable>
</template>

<style>
.number {
  margin: 10px !important;
  border-style: solid;
  padding-left: 5px;
}
.number-list {
  display: block;
  padding: 10px;
}
</style>
