<script setup lang="ts">
import { Draggable } from "vue3-juice-dnd";
defineProps<{ msg: string }>();
</script>

<template>
  <ul style="width: 80%">
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="() => {}"
      tag="div"
      style="
        color: white;
        background-color: red;
        width: 90px;
        margin-bottom: 10px;
      "
    >
      1
    </Draggable>
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="() => {}"
      tag="div"
      style="color: white; background-color: blue; width: 120px"
    >
      2
    </Draggable>
  </ul>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
