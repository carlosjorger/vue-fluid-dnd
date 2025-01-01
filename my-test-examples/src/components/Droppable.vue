<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";

const list = ref([1, 2, 3])
const { parent } = useDragAndDrop<number>(list as any);
</script>
<template>
    <ul ref="parent" class="vertical-list">
        <li
        v-for="(element, index) in list"
        :index="index"
        class="number"
        :value="element"
        >
        {{ element }}
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
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
</style>