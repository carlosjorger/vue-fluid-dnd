<template><slot :set-ref="setSlotRef"></slot></template>
<script setup lang="ts">
import { ComponentPublicInstance, Ref, inject, ref, watch } from "vue";
import { Direction, DraggableElement } from "../../index";
import useDraggable from "../composables/useDraggable";
const props = defineProps<{
  draggableId: string;
  index: number;
}>();
const DRAGGABLE_ID_ATTR = "draggable-id";
const INDEX_ATTR = "index";

const direction = inject<Direction>("direction");
const onDrop =
  inject<
    Ref<(source: DraggableElement, destination: DraggableElement) => void>
  >("onDrop");

let childRef = ref<HTMLElement>();

const setSlotRef = (
  ref: Element | ComponentPublicInstance | null,
  refs: Record<string, any>
) => {
  if (!ref && refs) {
    return;
  }
  childRef.value = ref as HTMLElement;
  useDraggable(
    childRef.value,
    props.index,
    direction,
    onDrop?.value,
    updateDraggableId
  );
};

const updateDraggableId = (element: HTMLElement | undefined, index: number) => {
  if (element) {
    element.setAttribute(DRAGGABLE_ID_ATTR, props.draggableId);
    element.setAttribute(INDEX_ATTR, index.toString());
  }
};

watch(
  () => props.draggableId,
  (_) => {
    if (childRef.value) {
      updateDraggableId(childRef.value, props.index);
    }
  }
);
</script>
<!-- TODO: fix Jose flashing bug -->
