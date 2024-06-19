<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
const numbers = ref([1, 2, 3, 4, 5, 6]);

const { id } = defineProps<{
  id: string;
}>();
const { parent } = useDragAndDrop<number>(numbers as any);
const triggerClick = () => {
  console.log("click");
};
</script>
<template>
  <ul ref="parent" :id="id" class="vertical-list">
    <li
      v-for="(element, index) in numbers"
      :index="index"
      :id="'child-with-children-' + +element.toString()"
      class="number"
    >
      {{ element }}
      <div style="display: flex; flex-direction: column">
        <input type="number" v-model="numbers[index]" @click="triggerClick" />
      </div>
    </li>
  </ul>
</template>
<style scoped>
.vertical-list {
  display: block;
  padding-inline: 10px;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
</style>
