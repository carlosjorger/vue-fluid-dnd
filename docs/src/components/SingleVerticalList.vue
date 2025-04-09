<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";

// import { useDragAndDrop } from "fluid-dnd/vue";

const list = ref([1, 2, 3]);
const { parent } = useDragAndDrop(list);
</script>
<template>
  <ul ref="parent" class="number-list p-8 bg-[var(--sl-color-gray-6)]">
    <li class="number" v-for="(element, index) in list" :index="index" :key="element">
      {{ element }}
    </li>
  </ul>
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
  padding-inline: 25px;
}
.temp-child {
  margin-top: 0 !important;
}
</style>
