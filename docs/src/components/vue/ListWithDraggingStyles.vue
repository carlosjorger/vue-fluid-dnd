<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";

const list = ref([1, 2, 3]);
const [ parent ] = useDragAndDrop(list, {
  draggingClass: "dragging",
});
</script>
<template>
  <ul ref="parent" class="block px-6 p-8 bg-[var(--sl-color-gray-6)]">
    <li
      class="number border-solid mt-1 pl-1 border-2 border-[var(--sl-color-gray-1)]"
      v-for="(element, index) in list"
      :index="index"
    >
      {{ element }}
    </li>
  </ul>
</template>

<style>
.temp-child {
  margin-top: 0 !important;
}
.dragging {
  transition: background-color color 150ms ease-in, color 150ms ease-in;
  background-color: var(--sl-color-gray-1);
  color: black;
}
</style>
