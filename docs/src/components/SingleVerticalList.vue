<script setup lang="ts">
import { ref } from "vue";
import { Draggable, Droppable } from "vue3-juice-dnd";
import "vue3-juice-dnd/style.css";
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
  border-style: solid;
  padding-left: 5px;
  margin-top: 0.25rem;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
}
.number-list {
  display: block;
  padding-inline: 10px;
}
</style>
