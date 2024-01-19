<script setup lang="ts">
import Draggable from "./components/Draggable.vue";
var date = new Date();
</script>

<template>
  <ul style="width: 80%">
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
      tag="div"
      style="height: 100px; width: 50px; color: white; background-color: red"
    >
      1
    </Draggable>
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
      tag="div"
      style="color: white; width: 80px; background-color: blue; height: 100px"
    >
      2
    </Draggable>
  </ul>
</template>
