<script setup lang="ts">
import Draggable from "./components/Draggable.vue";
import Droppable from "./components/Droppable.vue";
</script>

<template>
  <div style="width: 80%; display: flex; flex-direction: row; gap: 10px">
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
        height: 100px;
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
  </div>
  <Droppable tag="ul" droppable-id="2" style="width: 80%">
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="() => {}"
      tag="div"
      style="color: white; background-color: red; padding: 20px 0; margin: 5px"
    >
      1
    </Draggable>
    <Draggable
      draggable-id="2"
      enable-drag
      :onDropChange="() => {}"
      tag="div"
      style="color: white; background-color: blue; padding: 20px 0; margin: 5px"
    >
      2
    </Draggable>
    <Draggable
      draggable-id="3"
      enable-drag
      :onDropChange="() => {}"
      tag="div"
      style="
        color: white;
        background-color: green;
        padding: 20px 0;
        margin: 5px;
      "
    >
      3
    </Draggable>
  </Droppable>
</template>
