<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const list = ref([] as string[])
const { droppableGroup, elements } = defineProps<{
  droppableGroup: string;
  elements: string[]
}>();
list.value = elements
const { parent } = useDragAndDrop<number>(list as any,
  {
    droppableGroup
  }
);
</script>
<template>
    <ul ref="parent" class="vertical-list">
        <li
        v-for="(element, index) in list"
        :index="index"
        class="number"
        :value="element"
        >
        <div>{{ element }}</div>
        </li>
    </ul>
</template>
<style scoped>
.vertical-list {
  display: block;
  padding-inline: 10px;
  min-height: 200px;
  background-color: rgba(255, 255, 255, 0.2);
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  margin: 5px;
}
</style>