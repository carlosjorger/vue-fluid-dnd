<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";

const {removingClass, delayBeforeRemove} = defineProps<{
  removingClass?: string;
  delayBeforeRemove?: number;
  
}>();
const list = ref([1, 2, 3, 4, 5]);
const { parent, removeAt } = useDragAndDrop(list,{
  removingClass,
  delayBeforeRemove
});
</script>
<template>
  <ul ref="parent" class="number-list p-8 bg-[var(--sl-color-gray-6)]">
    <li class="number" v-for="(element, index) in list" :index="index" :key="element">
      {{ element }}
      <button class="remove-button" @click="removeAt(index)">x</button>
    </li>
  </ul>
</template>

<style scoped>
.number {
  border-style: solid;
  padding-left: 5px;
  margin-top: 0.25rem;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
  opacity: 1;
  transition: opacity 200ms ease;
  display: flex;
  justify-content: space-between
  /*
    ...
  */
}
.number.removed{
  opacity: 0;
}
.number-list {
  display: block;
  padding-inline: 25px;
}
.remove-button{
  cursor: pointer;
  margin-bottom: 0 !important;
  background-color: red
}
</style>
<style>
.temp-child {
  margin-top: 0 !important;
}
</style>