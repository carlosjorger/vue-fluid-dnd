<template>
  <slot></slot>
</template>
<script setup lang="ts" generic="T">
import { provide, ref, computed } from "vue";
import { Direction, DraggableElement } from "../../index";
import { dropDraggingElementsBetween } from "@/utils/DropMethods";
import { LocalEventBus, createEventBus } from "@/utils/EventBus";

const { droppableId, direction, onDrop, items } = defineProps<{
  droppableId: string;
  direction: Direction;
  onDrop?: (source: DraggableElement, destination: DraggableElement) => void;
  items?: T[];
}>();
const currentOnDrop = computed(() => {
  if (items) {
    return (source: DraggableElement, destination: DraggableElement) => {
      dropDraggingElementsBetween(ref(items), source, destination);
    };
  }
  if (onDrop) {
    return onDrop;
  }
  return () => {};
});

const localBus = createEventBus();

provide(LocalEventBus, localBus);
provide("direction", direction);
provide("droppableId", droppableId);
provide("onDrop", currentOnDrop.value);
</script>
