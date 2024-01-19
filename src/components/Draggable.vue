<template>
  <component
    :is="tag"
    :style="style"
    class="draggable"
    @mousedown="onmousedown($event)"
    @dragstart="ondragstart()"
    @mouseup="onmouseup($event)"
  >
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
//TODO: add dragOver functionality https://medium.com/codex/drag-n-drop-with-vanilla-javascript-75f9c396ecd
import { computed, ref } from "vue";
type StyleCSS = {
  position?: string;
  top?: string;
  left?: string;
  transform?: string;
  width?: string;
};
const { style } = defineProps<{
  draggableId: string;
  enableDrag: boolean;
  tag: string;
  style: StyleCSS;
}>();
const position = ref({ top: 0, left: 0 });
const offset = ref({ X: 0, Y: 0 });
const dragging = ref(false);

const setTransform = (element: HTMLElement, pageX: number, pageY: number) => {
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
  const { top, left, width } = element.getBoundingClientRect();
  dragging.value = true;
  element.style.position = "absolute";
  element.style.zIndex = "1000";
  position.value.top = top;
  position.value.left = left;

  offset.value.X = event.offsetX;
  offset.value.Y = event.offsetY;

  element.style.transition = "";
  element.style.top = `${position.value.top}px`;
  element.style.left = `${position.value.left}px`;
  element.style.width = `${updateWidht(width, element.style)}px`;
  console.log(element.style.width);
  setTransform(element, event.x, event.y);

  document.addEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
};
const onmouseup = (event: DragEvent) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  element.style.position = style.position ?? "";
  element.style.top = style.top ?? "";
  element.style.left = style.left ?? "";
  element.style.transform = style.transform ?? "";
  element.style.width = style.width ?? "";

  element.style.transition = "transform 0.3s ease";
  document.removeEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
};
const parseFloatEmpty = (value: string) => {
  if (value.trim().length == 0) {
    return 0;
  }
  return parseFloat(value);
};
const updateWidht = (widht: number, style: CSSStyleDeclaration) => {
  var paddingX =
    parseFloatEmpty(style.paddingLeft ?? 0) +
    parseFloatEmpty(style.paddingRight ?? 0);
  var borderX =
    parseFloatEmpty(style.borderLeftWidth ?? 0) +
    parseFloatEmpty(style.borderRightWidth ?? 0);
  return widht - paddingX - borderX;
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
<!-- TODO: refactor -->
<!-- TODO: work with not fixed height -->
<!-- TODO: create Droppable -->
