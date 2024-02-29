<script setup lang="ts">
import { ref } from "vue";
import { Draggable, Droppable } from "vue-fluid-dnd";
import "vue-fluid-dnd/style.css";
const list = ref([1, 2, 3, 4, 5]);
</script>
<template>
  <Droppable droppable-id="1" direction="horizontal" :items="list">
    <div class="number-list">
      <Draggable
        v-for="(element, index) in list"
        v-slot="{ setRef }"
        :draggable-id="element.toString()"
        :index="index"
      >
        <div class="number" :ref="setRef">{{ element }}</div>
      </Draggable>
    </div>
  </Droppable>
</template>

<style>
.number {
  border-style: solid;
  padding-inline: 35px;
  margin-left: 10px;
  margin-top: 0.25rem !important;
  padding-bottom: 40px;
  padding-top: 40px;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
}
.number-list {
  display: flex;
  flex-direction: row;
  border-style: solid;
  border-width: 2px;
  padding: 20px;
  overflow-x: auto;
}
</style>
