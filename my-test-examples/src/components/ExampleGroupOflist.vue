<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const numbers1 = ref([1, 2, 3, 4, 5, 6]);
const { parent: parent1 } = useDragAndDrop<number>(numbers1 as any, {
  direction: "vertical",
  droppableGroup: "group1",
});

const numbers2 = ref([7, 8, 9, 10, 11, 12, 13, 14, 15]);
const { parent: parent2 } = useDragAndDrop<number>(numbers2 as any, {
  direction: "vertical",
  droppableGroup: "group1",
});

const numbers3 = ref([16, 17, 18, 19, 20, 21]);
const { parent: parent3 } = useDragAndDrop<number>(numbers3 as any, {
  direction: "horizontal",
  droppableGroup: "group1",
});

const { id } = defineProps<{
  id: string;
}>();
</script>
<template>
  <div :id="id" class="group">
    <div ref="parent1" class="vertical-list">
      <div
        v-for="(element, index) in numbers1"
        :index="index"
        :id="'group-child-' + +element.toString()"
        class="number"
      >
        {{ element }}
      </div>
    </div>
    <ul ref="parent2" class="scrolled-list">
      <li
        v-for="(element, index) in numbers2"
        :index="index"
        :id="'group-child-' + +element.toString()"
        class="number"
      >
        {{ element }}
      </li>
    </ul>
    <div ref="parent3" class="horizontal-list">
      <div
        v-for="(element, index) in numbers3"
        :index="index"
        :id="'group-child-' + +element.toString()"
        class="number"
      >
        {{ element }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.group {
  display: grid;
  grid-template-areas:
    "vertical scrolled"
    "horizontal  horizontal";
  gap: 10%;
  margin-bottom: 15%;
}
.vertical-list {
  background-color: aliceblue;
  height: 400px;
  grid-area: vertical;
}
.scrolled-list {
  padding-block: 20px;
  background-color: aliceblue;
  height: 420px;
  overflow: auto;
  display: block;
  padding-inline: 25px;
  grid-area: scrolled;
}
.horizontal-list {
  display: flex;
  padding: 10px;
  flex-direction: row;
  background-color: pink;
  padding: 40px;
  width: 100%;
  grid-area: horizontal;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  min-width: 100px;
  max-width: 100px;
}
</style>
