<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";
import Handler from "./icons/handler.vue";
const handlerClass = "handler";
const list = ref([1, 2, 3, 4, 5]);
const { parent } = useDragAndDrop(list, {
  handlerClass,
});
</script>
<template>
  <ul ref="parent" class="number-list p-8 bg-[var(--sl-color-gray-6)]">
    <li class="number" v-for="(element, index) in list" :index="index">
      <Handler class="handler" />
      {{ element }}
    </li>
  </ul>
</template>

<style>
.handler {
  width: 0.5rem;
  margin-bottom: 0 !important;
}
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
.temp-child {
  margin-top: 0 !important;
}
</style>
