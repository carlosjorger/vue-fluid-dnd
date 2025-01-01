<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
const { list } = defineProps<{
  list: string[];
}>();
const listRef = ref(list)
const { parent } = useDragAndDrop<number>(listRef as any);
</script>
<template>
    <ul ref="parent" class="vertical-list">
        <li
        v-for="(element, index) in listRef"
        :index="index"
        :id="'child-with-children-' + +element"
        class="number"
        >
        {{ element }}
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