<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";
const list = ref([1, 2, 3, 4, 5]);
const { parent } = useDragAndDrop(list, { direction: "horizontal" });
</script>
<template>
  <div ref="parent" class="number-list">
    <div class="number" v-for="(element, index) in list" :index="index">
      {{ element }}
    </div>
  </div>
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
