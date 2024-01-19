<template>
  <component
    :is="tag"
    :style="style"
    class="draggable"
    @mousedown="onmousedown($event)"
    @dragstart="ondragstart()"
    @mouseup="onmouseup($event)"
    @dragend="
      () => {
        console.log('dragend');
      }
    "
  >
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
//TODO: add dragOver functionality https://medium.com/codex/drag-n-drop-with-vanilla-javascript-75f9c396ecd
import { computed, ref } from "vue";
defineProps<{
  draggableId: string;
  enableDrag: boolean;
  tag: string;
  style: {};
}>();
const position = ref({ top: 0, left: 0 });
const offset = ref({ X: 0, Y: 0 });
const dragging = ref(false);

const setTransform = (element: HTMLElement, pageX: number, pageY: number) => {
  element.style.top = `${position.value.top}px`;
  element.style.left = `${position.value.left}px`;
  const { height } = element.getBoundingClientRect();
  element.style.transform = `translate( ${
    pageX - position.value.left - offset.value.X
  }px, ${pageY - position.value.top - offset.value.Y - height / 2}px)`;
};

const onmousemove = function (event: MouseEvent, element: HTMLElement) {
  if (!dragging.value) {
    return;
  }
  setTransform(element, event.x, event.y);
};
const onmousedown = function (event: DragEvent) {
  const element = event.target as HTMLElement;
  dragging.value = true;
  element.style.position = "absolute";
  element.style.zIndex = "1000";
  const { top, left } = element.getBoundingClientRect();
  position.value.top = top;
  position.value.left = left;
  offset.value.X = event.offsetX;
  offset.value.Y = event.offsetY;
  element.style.transition = "";

  document.addEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
};
const onmouseup = (event: DragEvent) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  element.style.position = "";
  element.style.top = "";
  element.style.left = "";
  element.style.transform = "";
  element.style.transition = "transform 0.3s ease";
  document.removeEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
};
const ondragstart = () => {
  return false;
};
const computedCursor = computed(() => (dragging.value ? "grabbing" : "grab"));
</script>
<style>
.draggable {
  position: initial;
}
.draggable:hover {
  cursor: v-bind("computedCursor") !important;
}
</style>
<!-- TODO: work with not fixed widht and height -->
<!-- TODO: create Droppable -->
