<template>
  <component
    :is="tag"
    class="draggable"
    @mousedown="onmousedown($event)"
    @dragstart="ondragstart()"
    ref="draggable"
    :draggable-id="draggableId"
  >
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import eventBus from "@/utils/EventBus";
const { draggableId, tag } = defineProps<{
  draggableId: string;
  enableDrag: boolean;
  tag: string;
}>();
const draggable = ref<HTMLElement>();
const style = ref("");
const position = ref({ top: 0, left: 0 });
const offset = ref({ offsetX: 0, offsetY: 0 });
const dragging = ref(false);
const index = ref(0);
onMounted(() => {
  style.value = draggable.value?.style.cssText ?? "";
  eventBus.on(`drag_${draggableId}`, (height: number) => {
    moveHeight(height);
  });
  eventBus.on(`drop_${draggableId}`, () => {
    moveHeight(0);
  });
  const element = draggable.value;
  if (element) {
    index.value = ([] as HTMLElement[]).indexOf.call(
      element.parentNode?.children,
      element
    );
  }
});
const setTransform = (element: HTMLElement, pageX: number, pageY: number) => {
  element.style.transform = `translate( ${
    pageX - position.value.left - offset.value.offsetX
  }px, ${pageY - position.value.top - offset.value.offsetY}px)`;
};

const onmousemove = function (event: MouseEvent, element: HTMLElement) {
  if (!dragging.value) {
    return;
  }
  setTransform(element, event.x, event.y);
};
const onmousedown = (event: DragEvent) => {
  const element = event.target as HTMLElement;
  const { top, left } = element.getBoundingClientRect();
  const { offsetX, offsetY, x, y } = event;
  if (dragging.value) {
    removeDraggingStyles(element);
  }
  dragging.value = true;
  position.value = { top, left };
  offset.value = { offsetX, offsetY };
  emitDragEventToSiblings(element);
  fixParentHeight();
  setDraggingStyles(element);
  setTransform(element, x, y);

  document.addEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
  if (draggable.value) {
    assignOnmouseup((event: MouseEvent) => {
      onmouseup(event);
      assignOnmouseup(null);
    });
  }
};
const fixParentHeight = () => {
  const element = draggable.value as HTMLElement;
  const parent = element.parentNode;
  const parentElement = parent as HTMLElement;
  if (parentElement) {
    const { height } = parentElement.getBoundingClientRect();
    parentElement.style.height = `${height}px`;
  }
};
const emitDragEventToSiblings = (element: HTMLElement) => {
  emitEventToSiblings(element, "drag");
};
const emitDropEventToSiblings = (element: HTMLElement) => {
  emitEventToSiblings(element, "drop");
};
const emitEventToSiblings = (element: HTMLElement, event: string) => {
  let { height } = element.getBoundingClientRect();

  let sibling = element.nextSibling;
  const brother = sibling as HTMLElement;
  if (!(sibling instanceof HTMLElement)) {
    return;
  }
  const brotherMarginTop = parseFloatEmpty(brother.style.marginTop);
  const marginBottom = parseFloatEmpty(element.style.marginBottom);
  if (brotherMarginTop <= marginBottom) {
    height += brotherMarginTop;
  }
  while (sibling) {
    var element = sibling as HTMLElement;
    if (sibling instanceof HTMLElement) {
      const siblingDraggableId = sibling.getAttribute("draggable-id");

      eventBus.emit(`${event}_${siblingDraggableId}`, height);
    }
    sibling = sibling.nextSibling;
  }
};
const assignOnmouseup = (
  onmouseupFunc: ((event: MouseEvent) => void) | null
) => {
  if (draggable.value) {
    draggable.value.onmouseup = onmouseupFunc;
  }
};
const onmouseup = (event: MouseEvent) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  emitDropEventToSiblings(element);
  removeDraggingStyles(element);
  document.removeEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
};
const removeDraggingStyles = (element: HTMLElement) => {
  element.style.cssText = style.value;
  element.style.transition = "transform 0.3s ease";
};
const setDraggingStyles = (element: HTMLElement) => {
  const { width, height } = element.getBoundingClientRect();
  element.style.position = "fixed";
  element.style.zIndex = "1000";
  element.style.transition = "";
  element.style.top = `${position.value.top}px`;
  element.style.left = `${position.value.left}px`;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
};
const moveHeight = (height: number) => {
  if (draggable.value) {
    draggable.value.style.transform = `translate( 0, ${height}px)`;
  }
};
const parseFloatEmpty = (value: string) => {
  if (!value || value.trim().length == 0) {
    return 0;
  }
  return parseFloat(value);
};
const ondragstart = () => {
  return false;
};
const computedCursor = computed(() => (dragging.value ? "grabbing" : "grab"));
</script>
<style>
.draggable {
  position: initial;
  cursor: v-bind("computedCursor");
  box-sizing: border-box;
}
</style>
<!-- TODO: refactor -->
<!-- TODO: add transform:translate(vertical) the others draggable below one being dragged -->
