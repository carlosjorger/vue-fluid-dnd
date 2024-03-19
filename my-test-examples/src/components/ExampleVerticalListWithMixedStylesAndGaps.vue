<script setup lang="ts">
import { ref } from "vue";
import Droppable from "../../../src/components/Droppable.vue";
import Draggable from "../../../src/components/Draggable.vue";
const listWithMixedStyles = ref([
  {
    "draggable-id": "1",
    number: 1,
    style:
      "color: white; background-color: red; padding: 20px 0; margin: 23px 0;",
  },
  {
    "draggable-id": "2",
    number: 2,
    style:
      "color: white; background-color: blue; padding: 20px 0; margin: 12px; margin-right: 120px;",
  },
  {
    "draggable-id": "3",
    number: 3,
    style:
      "color: white; background-color: green; padding: 26px 0; margin: 26px; margin-left: 100px;",
  },
  {
    "draggable-id": "4",
    number: 4,
    style:
      "color: white; background-color: brown; padding: 26px 0; margin: 27px;",
  },
]);
const { droppableId } = defineProps<{
  droppableId: string;
}>();
</script>
<template>
  <Droppable
    :droppable-id="droppableId"
    direction="vertical"
    :items="listWithMixedStyles"
  >
    <div class="vertical-list-with-mixed-styles">
      <Draggable
        v-for="(element, index) in listWithMixedStyles"
        v-slot="{ setRef }"
        :draggable-id="element['draggable-id']"
        :index="index"
        ><div :ref="setRef as any" :style="element.style">
          {{ element.number }}
        </div>
      </Draggable>
    </div>
  </Droppable>
</template>
<style>
.vertical-list-with-mixed-styles {
  width: 40%;
  background-color: darkgray;
  display: block;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  transition: background-color 150ms ease;
}
.number:hover {
  background-color: red;
}
</style>
