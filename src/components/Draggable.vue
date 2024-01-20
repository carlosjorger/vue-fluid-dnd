<template>
  <component
    :is="tag"
    class="draggable"
    @mousedown="onmousedown($event)"
    @dragstart="ondragstart()"
    ref="draggable"
  >
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

defineProps<{
  draggableId: string;
  enableDrag: boolean;
  tag: string;
}>();
const draggable = ref<HTMLElement>();
const style = ref("");
const position = ref({ top: 0, left: 0 });
const offset = ref({ offsetX: 0, offsetY: 0 });
const dragging = ref(false);
onMounted(() => {
  style.value = draggable.value?.style.cssText ?? "";
});
const setTransform = (element: HTMLElement, pageX: number, pageY: number) => {
  const { height } = element.getBoundingClientRect();
  element.style.transform = `translate( ${
    pageX - position.value.left - offset.value.offsetX
  }px, ${pageY - position.value.top - offset.value.offsetY - height / 2}px)`;
};

const onmousemove = function (event: MouseEvent, element: HTMLElement) {
  if (!dragging.value) {
    return;
  }
  setTransform(element, event.x, event.y);
};
const onmousedown = function (event: DragEvent) {
  const element = event.target as HTMLElement;
  const { top, left } = element.getBoundingClientRect();
  const { offsetX, offsetY, x, y } = event;
  if (dragging.value) {
    removeDraggingStyles(element);
  }
  dragging.value = true;
  position.value = { top, left };
  offset.value = { offsetX, offsetY };
  setDraggingStyles(element);
  setTransform(element, x, y);

  document.addEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
  if (draggable.value) {
    assignOnmouseup((event: MouseEvent) => {
      onmouseup(event);
      assignOnmouseup(null);
    });
  }
};
const assignOnmouseup = (
  onmouseupFunc: ((event: MouseEvent) => void) | null
) => {
  if (draggable.value) {
    draggable.value.onmouseup = onmouseupFunc;
  }
};
const onmouseup = (event: MouseEvent) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  removeDraggingStyles(element);
  document.removeEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
};
const removeDraggingStyles = (element: HTMLElement) => {
  element.style.cssText = style.value;
  element.style.transition = "transform 0.3s ease";
};
const setDraggingStyles = (element: HTMLElement) => {
  const { width, height } = element.getBoundingClientRect();
  element.style.position = "absolute";
  element.style.zIndex = "1000";
  element.style.transition = "";
  element.style.top = `${position.value.top}px`;
  element.style.left = `${position.value.left}px`;
  element.style.width = `${updateWidht(width, element.style)}px`;
  element.style.height = `${updateHeight(height, element.style)}px`;
};
const parseFloatEmpty = (value: string) => {
  if (!value || value.trim().length == 0) {
    return 0;
  }
  return parseFloat(value);
};
const updateWidht = (widht: number, style: CSSStyleDeclaration) => {
  var paddingX =
    parseFloatEmpty(style.paddingLeft) + parseFloatEmpty(style.paddingRight);
  var borderX =
    parseFloatEmpty(style.borderLeftWidth) +
    parseFloatEmpty(style.borderRightWidth);
  return widht - paddingX - borderX;
};
const updateHeight = (widht: number, style: CSSStyleDeclaration) => {
  var paddingY =
    parseFloatEmpty(style.paddingTop) + parseFloatEmpty(style.paddingBottom);
  var borderY =
    parseFloatEmpty(style.borderTopWidth) +
    parseFloatEmpty(style.borderBottomWidth);
  return widht - paddingY - borderY;
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
<!-- TODO: create Droppable -->
