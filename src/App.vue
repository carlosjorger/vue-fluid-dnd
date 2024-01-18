<script setup lang="ts">
import DatePicker from "./components/DatePicker.vue";
import DragAndDrop from "./components/DragAndDrop.vue";
var date = new Date();
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <ul>
    <DragAndDrop
      draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
    >
      <div
        style="width: 40px; height: 40px; color: white; background-color: red"
      >
        1
      </div>
    </DragAndDrop>
    <DragAndDrop
      draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
    >
      <div
        style="width: 40px; height: 40px; color: white; background-color: blue"
      >
        2
      </div>
    </DragAndDrop>
  </ul>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
