<template>
  <slot></slot>
</template>
<script setup lang="ts">
import { provide } from "vue";
import { Direction, DraggableElement } from "../../index.ts";
const { droppableId, direction, onDrop } = defineProps<{
  droppableId: string;
  direction: Direction;
  onDrop: (source: DraggableElement, destination: DraggableElement) => void;
}>();

provide("direction", direction);
provide("droppableId", droppableId);
provide("onDrop", onDrop);
</script>
<!-- TODO: create and default onDrop and use dropDraggingElementsBetween if is passed a list -->
