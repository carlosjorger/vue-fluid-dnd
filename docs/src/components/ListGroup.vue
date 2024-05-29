<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "vue-fluid-dnd";

const list = ref([1, 2, 3, 4]);
const { parent: parent1 } = useDragAndDrop<number>(list, {
  droppableGroup: "group1",
});

const list2 = ref([1, 2, 3, 4]);
const { parent: parent2 } = useDragAndDrop<number>(list2, {
  droppableGroup: "group1",
  direction: "horizontal",
});
</script>
<template>
  <div class="group-list bg-[var(--sl-color-gray-6)]">
    <ul ref="parent1" class="number-list p-8">
      <li
        class="number"
        v-for="(element, index) in list"
        :index="index"
        :key="element"
      >
        {{ element }}
      </li>
    </ul>
    <div ref="parent2" class="number-list-h p-8">
      <div
        class="number"
        v-for="(element, index) in list2"
        :index="index"
        :key="element"
      >
        {{ element }}
      </div>
    </div>
  </div>
</template>

<style>
.number {
  border-style: solid;
  padding-left: 10px;
  padding-block: 5px;
  margin-top: 0.25rem !important;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
  color: var(--sl-color-gray-2);
  width: 120px;
}

.number-list {
  display: block;
  padding-inline: 25px;
  height: 300px;
  overflow-y: auto;
}
.number-list-h {
  display: flex;
  padding-inline: 25px;
}
.temp-child {
  margin-top: 0 !important;
}
</style>
