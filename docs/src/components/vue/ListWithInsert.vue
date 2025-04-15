<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";

const {insertingFromClass, delayBeforeInsert} = defineProps<{
  insertingFromClass?: string;
  delayBeforeInsert?: number;
}>();
const list = ref([] as number []);
const [ parent, insertAt ] = useDragAndDrop(list,{
  insertingFromClass,
  delayBeforeInsert,
});
</script>
<template>
  <ul ref="parent" class="number-list px-8 py-4 bg-[var(--sl-color-gray-6)]">
    <li class="number" v-for="(element, index) in list" :index="index" :key="element">
      {{ element }}
    </li>
  </ul>
  <button class="insert-button mx-5 bg-slate-100 rounded-2xl w-12" @click="insertAt(list.length, list.length)">+</button>
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
.number.inserting{
  opacity: 0;
}
.number-list {
  display: block;
  padding-inline: 25px;
  min-height: 101px;
}
.insert-button{
  cursor: pointer;
  margin-bottom: 0 !important;
}
</style>
<style>
.temp-child {
  margin-top: 0 !important;
}
</style>