<script setup lang="ts">
import Draggable from "./components/Draggable.vue";
</script>

<template>
  <ul style="width: 80%">
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
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
      :onDropChange="(_) => {}"
      tag="div"
      style="color: white; background-color: blue; width: 120px"
    >
      2
    </Draggable>
  </ul>
  <ul style="width: 80%">
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
      tag="div"
      style="color: white; background-color: red; padding: 20px 0; margin: 5px"
    >
      1
    </Draggable>
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
      tag="div"
      style="color: white; background-color: blue; padding: 20px 0; margin: 5px"
    >
      2
    </Draggable>
  </ul>
</template>
