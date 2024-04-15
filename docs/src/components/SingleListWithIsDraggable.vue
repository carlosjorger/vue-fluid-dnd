<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";
const list = ref([1, 2, 3, 4]);
const { parent } = useDragAndDrop(list, {
  isDraggable: (el) => !el.classList.contains("is-not-draggable"),
});
</script>
<template>
  <ul ref="parent" class="number-list p-8 bg-[var(--sl-color-gray-6)]">
    <li
      class="number"
      v-for="(element, index) in list"
      :index="index"
      :class="{
        'is-not-draggable': element % 2 == 0,
      }"
      :key="element"
    >
      {{ element }}
    </li>
  </ul>
</template>

<style>
.number {
  border-style: solid;
  padding-left: 10px;
  padding-block: 5px;
  margin-top: 0.25rem;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  align-items: center;
  color: var(--sl-color-gray-2);
}

.number-list {
  display: block;
  padding-inline: 25px;
}
.is-not-draggable {
  background-color: var(--sl-color-gray-3);
}
.temp-child {
  margin-top: 0 !important;
}
</style>
