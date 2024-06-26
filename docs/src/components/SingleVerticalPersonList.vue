<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";

const list = ref([
  { number: 1, name: "Carlos", edit: false },
  { number: 2, name: "Jorge", edit: false },
  { number: 1, name: "Ivis", edit: false },
]);
const { parent } = useDragAndDrop(list);
</script>
<template>
  <ul ref="parent" class="person-list p-8 bg-[var(--sl-color-gray-6)]">
    <li class="person" v-for="(person, index) in list" :index="index">
      <input type="text" v-model="person.name" :disabled="!person.edit" />
      <input type="checkbox" v-model="person.edit" />
    </li>
  </ul>
</template>

<style>
.person {
  border-style: solid;
  padding-left: 5px;
  margin-top: 0.25rem;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
}
.person input[type="text"] {
  width: 100px;
  margin: 10px;
}
.person-list {
  display: block;
  padding-inline: 25px;
}
.temp-child {
  margin-top: 0 !important;
}
</style>
