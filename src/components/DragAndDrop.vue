<template>
  <div
    @dragstart="startDrag($event, draggableId)"
    @drop="onDrop($event, enableDrag)"
    @dragenter="onDragEnter(draggableId, enableDrag)"
    @dragover.prevent
    :draggable="draggable"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { useDrag } from "../composables/useDrag";
const { onDropChange } = defineProps({
  draggableId: {
    type: Object as PropType<string>,
    required: true,
  },
  onDropChange: {
    type: Object as PropType<(id: string) => void>,
    required: true,
  },
  enableDrag: {
    type: Object as PropType<boolean>,
    required: true,
  },
  draggable: {
    type: Object as PropType<boolean>,
    required: true,
  },
});
const { onDragEnter, onDrop, startDrag } = useDrag(
  "Element",
  () => ({}),
  onDropChange
);
</script>
