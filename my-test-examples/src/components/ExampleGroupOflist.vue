<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const numbers1 = ref([1, 2, 3, 4, 5, 6]);
const { parent: parent1 } = useDragAndDrop<number>(numbers1 as any, {
  direction: "vertical",
  droppableGroup: "group1",
});

const numbers2 = ref([1, 2, 3, 4, 5, 6]);
const { parent: parent2 } = useDragAndDrop<number>(numbers1 as any, {
  direction: "vertical",
  droppableGroup: "group1",
});

const numbers3 = ref([1, 2, 3, 4, 5, 6]);
const { parent: parent3 } = useDragAndDrop<number>(numbers1 as any, {
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
    <div ref="parent2" class="vertical-list">
      <div
        v-for="(element, index) in numbers2"
        :index="index"
        :id="'group-child-' + +element.toString()"
        class="number"
      >
        {{ element }}
      </div>
    </div>
    <div ref="parent3" class="list">
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
  grid-template-columns: 1fr 1fr;
  gap: 20%;
}
.vertical-list {
  background-color: aliceblue;
}
.list {
  display: flex;
  padding: 10px;
  flex-direction: row;
  background-color: pink;
  padding: 40px;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
</style>
