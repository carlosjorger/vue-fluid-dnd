<script setup lang="ts">
import Draggable from "./components/Draggable.vue";
var date = new Date();
</script>

<template>
  <transition-group name="subsection" tag="ul">
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
      tag="div"
      style="width: 100px; height: 100px; color: white; background-color: red"
    >
      1
    </Draggable>
    <Draggable
      draggable-id="1"
      enable-drag
      :onDropChange="(_) => {}"
      tag="div"
      style="width: 100px; height: 100px; color: white; background-color: blue"
    >
      2
    </Draggable>
  </transition-group>
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
.subsection-move {
  transition: all 0.5s ease;
}
.subsection-leave-active {
  transition: all 0.5s ease;
}
.subsection-enter-active {
  transition: all 0.5s ease;
}
.subsection-enter-from,
.subsection-leave-to {
  opacity: 0;
  transform: translateX(-1rem);
}

.subsection-leave-active {
  position: absolute;
}
</style>
