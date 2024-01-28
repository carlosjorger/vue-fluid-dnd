<template>
  <slot></slot>
</template>
<script setup lang="ts">
import { provide } from "vue";
import { Direction } from "../../index.ts";
// TODO: add onDrop (source, destination) => void
const { direction } = defineProps<{
  droppableId: string;
  direction: Direction;
}>();

provide("direction", direction);
</script>
<!-- TODO: keep working in Droppable -->
