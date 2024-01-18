<template>
  <component
    :is="tag"
    @dragstart="startDrag($event, draggableId)"
    @drop="onDrop($event, enableDrag)"
    @dragenter="onDragEnter(draggableId, enableDrag)"
    @dragover.prevent
    :draggable="draggable"
  >
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
import { useDrag } from "../composables/useDrag";
const { onDropChange } = defineProps<{
  draggableId: string;
  onDropChange: (id: string) => void;
  enableDrag: boolean;
  draggable: boolean;
  tag: string;
}>();
const { onDragEnter, onDrop, startDrag } = useDrag(
  "Element",
  () => ({}),
  onDropChange
);
</script>
