<template>
  <slot></slot>
</template>
<script setup lang="ts">
import { provide } from "vue";
import { Direction, Draggable } from "../../index.ts";
const { droppableId, direction, onDrop } = defineProps<{
  droppableId: string;
  direction: Direction;
  onDrop: (source: Draggable, destination: Draggable) => void;
}>();

provide("direction", direction);
provide("droppableId", droppableId);
provide("onDrop", onDrop);
</script>
<!-- TODO: keep working in Droppable -->
