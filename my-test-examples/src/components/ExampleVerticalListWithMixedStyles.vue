<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../src/composables/useDragAndDrop";
const listWithMixedStyles = ref([
  {
    number: 1,
    style:
      "color: white; background-color: red; padding: 20px 0; margin: 23px 0;",
  },
  {
    number: 2,
    style:
      "color: white; background-color: blue; padding: 20px 0; margin: 12px; margin-right: 120px;",
  },
  {
    number: 3,
    style:
      "color: white; background-color: green; padding: 26px 0; margin: 26px; margin-left: 100px;",
  },
  {
    number: 4,
    style:
      "color: white; background-color: wheat; padding: 30px 0; margin: 20px 0; margin-right: 100px; width:40%",
  },
  {
    number: 5,
    style:
      "color: white; background-color: crimson; padding: 26px 0; margin: 14px 0; margin-right: 100px;",
  },
]);
defineProps<{
  id: string;
}>();
const { parent } = useDragAndDrop<number>(listWithMixedStyles as any);
</script>
<template>
  <div ref="parent" class="vertical-list-with-mixed-styles">
    <div
      v-for="(element, index) in listWithMixedStyles"
      :index="index"
      :style="element.style"
    >
      {{ element.number }}
    </div>
  </div>
</template>
<style scoped>
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
}
</style>
