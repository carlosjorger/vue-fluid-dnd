<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";

const list = ref([
  {
    id: "1",
    style:
      "margin: 30px 0px !important; border-style: solid; border-width: 0.8rem; padding: 5px;",
    content: "1",
  },
  {
    id: "2",
    style:
      "margin: 20px 0px !important; border-style: solid; border-width: 0.6rem; padding: 10px;",
    content: "2",
  },
  {
    id: "3",
    style:
      "margin: 10px 0px !important; border-style: solid; border-width: 0.4rem; padding: 15px;",
    content: "3",
  },
]);
const { parent } = useDragAndDrop(list);
</script>
<template>
  <ul ref="parent" class="number-list" style="height: 280px">
    <li
      class="number"
      v-for="(element, index) in list"
      :index="index"
      :style="element.style"
    >
      {{ element.content }}
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
  padding-inline: 10px;
}
</style>
