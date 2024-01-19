<template>
  <component
    :is="tag"
    :style="style"
    @dragstart="startDrag($event, draggableId)"
    @drop="onDrop($event, enableDrag)"
    @dragenter="onDragEnter($event, draggableId, enableDrag)"
    @dragover="onDragOver($event)"
    @dragleave.prevent
    :draggable="dragging"
    @dragend="dragEnd($event)"
    @drag="drag($event)"
    class="draggable"
    @mousedown="dragging = true"
    @mouseup="dragging = false"
  >
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
//TODO: add dragOver functionality https://medium.com/codex/drag-n-drop-with-vanilla-javascript-75f9c396ecd
import { computed, ref } from "vue";
const { onDropChange } = defineProps<{
  draggableId: string;
  onDropChange: (id: string) => void;
  enableDrag: boolean;
  tag: string;
  style: {};
}>();

const markedSection = ref("");
const IdAttr = `id`;
const dragging = ref(false);
const topElement = ref(0);
const leftElement = ref(0);
const offsetX = ref(0);
const offsetY = ref(0);
const onDragOver = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};
const onDragEnter = (
  event: DragEvent,
  draggableId: string,
  enableDrag: boolean
) => {
  event.preventDefault();
  if (!enableDrag) {
    return;
  }
  const eventDataTransfer = event.dataTransfer;
  if (eventDataTransfer) {
    eventDataTransfer.dropEffect = "move";
    eventDataTransfer.effectAllowed = "move";
  }
  markedSection.value = draggableId;
};
const onDrop = (event: DragEvent, enableDrag: boolean) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  element.classList.remove("dragging");
  element.style.top = "";
  element.style.left = "";
  element.style.transform = "";
  element.style.position = "";
  if (!enableDrag) {
    return;
  }
  const eventDataTransfer = event.dataTransfer;
  if (eventDataTransfer) {
    const draggedSectionName = eventDataTransfer.getData(IdAttr);
    onDropChange(draggedSectionName);
    markedSection.value = "";
  }
};
const startDrag = (event: DragEvent, draggableId: string) => {
  dragging.value = true;
  event.stopPropagation();
  const eventDataTransfer = event.dataTransfer;
  if (eventDataTransfer) {
    eventDataTransfer;
    var img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    event.dataTransfer.setDragImage(img, 0, 0);
    eventDataTransfer.setDragImage(img, 0, 0);
    eventDataTransfer.dropEffect = "move";
    eventDataTransfer.effectAllowed = "none";
    eventDataTransfer.setData(IdAttr, draggableId);
  }
  const element = event.target as HTMLElement;
  element.style.opacity = "1";
  element.classList.add("dragging");
  const { top, left } = element.getBoundingClientRect();
  topElement.value = top;
  leftElement.value = left;
  offsetX.value = event.offsetX;
  offsetY.value = event.offsetY;
};
const dragEnd = (event: DragEvent) => {
  console.log("a");
  dragging.value = false;
  const element = event.target as HTMLElement;
  element.classList.remove("dragging");
  element.style.top = "";
  element.style.left = "";
  element.style.transform = "";
  element.style.position = "";
};
const drag = (event: DragEvent) => {
  event.stopPropagation();
  dragging.value = false;
  const element = event.target as HTMLElement;
  element.style.top = `${topElement.value}px`;
  element.style.left = `${leftElement.value}px`;
  const { height } = element.getBoundingClientRect();
  element.style.transform = `translate( ${
    event.x - leftElement.value - offsetX.value
  }px, ${event.y - topElement.value - offsetY.value - height / 2}px)`;
  return false;
};
const computedCursor = computed(() => (dragging.value ? "grabbing" : "grab"));
</script>
<style>
.draggable {
  position: initial;
  /* transition: all 0.5s ease; */
}
.draggable:hover {
  cursor: v-bind("computedCursor");
}
.draggable:active {
  background-color: aqua;
}
.dragging {
  cursor: grabbing !important;
  position: fixed !important;
}
</style>
<!-- TODO: remove not-allowed cursor -->
<!-- TODO:dragEnd is called whe the element is dragged in the top part -->
