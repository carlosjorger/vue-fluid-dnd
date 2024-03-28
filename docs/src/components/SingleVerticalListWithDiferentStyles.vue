<script setup lang="ts">
import { ref } from "vue";
import { Draggable, Droppable } from "vue-fluid-dnd";

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
</script>
<template>
  <Droppable droppable-id="1" direction="vertical" :items="list">
    <ul class="number-list" style="height: 280px">
      <Draggable
        v-for="(element, index) in list"
        v-slot="{ setRef }"
        :draggable-id="element.id"
        :index="index"
      >
        <li class="number" :style="element.style" :ref="setRef">
          {{ element.content }}
        </li>
      </Draggable>
    </ul>
  </Droppable>
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
