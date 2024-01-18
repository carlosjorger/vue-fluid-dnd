<template>
  <component
    :is="tag"
    :style="style"
    @dragstart="startDrag($event, draggableId)"
    @drop="onDrop($event, enableDrag)"
    @dragenter="onDragEnter($event, draggableId, enableDrag)"
    @dragover="onDragOver($event)"
    @dragleave.prevent
    :draggable="draggable"
    @dragend="dragEnd($event)"
    class="draggable"
  >
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
//TODO: add dragOver functionality https://medium.com/codex/drag-n-drop-with-vanilla-javascript-75f9c396ecd
import { computed, watch } from "vue";
import { useDrag } from "../composables/useDrag";
const { onDropChange } = defineProps<{
  draggableId: string;
  onDropChange: (id: string) => void;
  enableDrag: boolean;
  draggable: boolean;
  tag: string;
  style: string;
}>();
const { onDragEnter, onDrop, startDrag, dragEnd, onDragOver, dragging } =
  useDrag("Element", () => ({}), onDropChange);
const computedCursor = computed(() => (dragging.value ? "grabbing" : "grab"));
watch(computedCursor, (value) => {
  console.log(`dragging is: ${value}`);
});
</script>
<style>
.draggable:hover {
  cursor: v-bind("computedCursor");
}
.draggable:active {
  background-color: aqua;
}
.dragging {
  cursor: grabbing !important;
}
</style>
<!-- TODO: Calculate current position of the element, convert to fixed and translate while is draggable -->
