<script setup lang="ts">
import { ref } from "vue";
import Droppable from "../../../src/components/Droppable.vue";
import Draggable from "../../../src/components/Draggable.vue";

const lsitWithMixedStyles = ref([
  {
    "draggable-id": "h1",
    number: 1,
    style: "color: white; background-color: red; width: 50px; margin: 23px 0;",
  },
  {
    "draggable-id": "h2",
    number: 2,
    style:
      "color: white; background-color: blue; padding: 30px; margin: 12px; margin-right: 30px;",
  },
  {
    "draggable-id": "h3",
    number: 3,
    style:
      "color: white; background-color: blueviolet; padding: 10px; margin: 8px; height: 70px;",
  },
  {
    "draggable-id": "h4",
    number: 4,
    style:
      "color: white; background-color: chocolate; padding: 10px; margin: 8px; width: 15px;",
  },
]);
const { droppableId } = defineProps<{
  droppableId: string;
}>();
</script>
<template>
  <Droppable
    :droppable-id="droppableId"
    direction="horizontal"
    :items="lsitWithMixedStyles"
  >
    <div
      id="example-vertical-list-with-child-elements"
      class="horizontal-list-with-mixed-styles"
    >
      <Draggable
        v-for="(element, index) in lsitWithMixedStyles"
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
.horizontal-list-with-mixed-styles {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  overflow: auto;
  background-color: darkgrey;
  border: solid;
  padding: 2rem;
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
