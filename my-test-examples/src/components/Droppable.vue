<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const list = ref([111, 222, 333])
const { droppableGroup } = defineProps<{
  droppableGroup: string;
}>();
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
        <div v-if="element%2==0">
       {{ element+1 }}
        </div>
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
}
</style>