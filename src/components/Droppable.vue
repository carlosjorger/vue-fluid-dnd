<template>
  <slot></slot>
</template>
<script setup lang="ts" generic="T">
import { provide, ref, watch } from "vue";
import { Direction, DraggableElement } from "../../index";
import { dropDraggingElementsBetween } from "@/utils/DropMethods";

const props = defineProps<{
  droppableId: string;
  direction: Direction;
  onDrop?: (source: DraggableElement, destination: DraggableElement) => void;
  items?: T[];
}>();

const getOnDrop = (items: T[]) => {
  return (source: DraggableElement, destination: DraggableElement) => {
    if (items) {
      dropDraggingElementsBetween(ref(items), source, destination);
    }
  };
};
const initOnDrop = () => {
  if (props.items) {
    return getOnDrop(props.items);
  }
  if (props.onDrop) {
    return props.onDrop;
  }
  return () => {};
};
const currentOnDrop = ref(initOnDrop());

watch(
  () => props.items,
  (value) => {
    if (value) {
      currentOnDrop.value = getOnDrop(value);
    }
  }
);
provide("direction", props.direction);
provide("droppableId", props.droppableId);
provide("onDrop", currentOnDrop);
</script>
<style>
.droppable {
  box-sizing: border-box !important;
  position: relative;
}
</style>
