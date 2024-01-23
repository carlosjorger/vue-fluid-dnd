<template><slot :provider="provider"></slot></template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import eventBus from "@/utils/EventBus";

const DRAG_EVENT = "drag";
const DROP_EVENT = "drop";
const { draggableId } = defineProps<{
  draggableId: string;
  enableDrag: boolean;
}>();

const style = ref("");
const position = ref({ top: 0, left: 0 });
const offset = ref({ offsetX: 0, offsetY: 0 });
const dragging = ref(false);
onMounted(() => {
  provider.value.draggableId = draggableId;
  eventBus.on("drag", (param) => {
    const { element, height, draggableIdEvent } = param;
    if (draggableId == draggableIdEvent) {
      moveHeight(element, height);
    }
  });
  eventBus.on("drop", ({ element }: { element: HTMLElement }) => {
    moveHeight(element, 0);
  });
});
const setTransform = (element: HTMLElement, pageX: number, pageY: number) => {
  element.style.transform = `translate( ${
    pageX -
    position.value.left -
    offset.value.offsetX -
    parseFloatEmpty(element.style.marginLeft)
  }px, ${
    pageY -
    position.value.top -
    offset.value.offsetY -
    parseFloatEmpty(element.style.marginTop)
  }px)`;
};

const onmousemove = function (event: MouseEvent, element: HTMLElement) {
  if (!dragging.value) {
    return;
  }
  setTransform(element, event.x, event.y);
};
const onmousedown = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  style.value = element.style.cssText;
  setBorderBoxStyle(element);
  const { width, height } = element.getBoundingClientRect();
  const { offsetX, offsetY, x, y, pageY, pageX } = event;
  const { marginTop, marginLeft } = element.style;
  if (dragging.value) {
    removeDraggingStyles(element);
  }
  dragging.value = true;
  offset.value = { offsetX, offsetY };
  emitDragEventToSiblings(element);
  fixParentHeight(element);
  position.value = {
    top: pageY - height / 2 - parseFloatEmpty(marginTop),
    left: pageX - width / 2 - parseFloatEmpty(marginLeft),
  };
  setDraggingStyles(element);
  setTransform(element, x, y);

  document.addEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
  if (element) {
    assignOnmouseup(element, (event: MouseEvent) => {
      onmouseup(event);
      assignOnmouseup(element, null);
    });
  }
};
const ondragstart = () => {
  return false;
};
const provider = ref({
  draggableId: "",
  mousedown: onmousedown,
  class: "draggable",
  dragstart: ondragstart,
});
const fixParentHeight = (element: HTMLElement) => {
  const parent = element.parentNode;
  const parentElement = parent as HTMLElement;
  if (parentElement) {
    const { height } = parentElement.getBoundingClientRect();
    parentElement.style.height = `${height}px`;
  }
};
const emitDragEventToSiblings = (element: HTMLElement) => {
  emitEventToSiblings(element, DRAG_EVENT);
};
const emitDropEventToSiblings = (element: HTMLElement) => {
  emitEventToSiblings(element, DROP_EVENT);
};
const emitEventToSiblings = (element: HTMLElement, event: "drag" | "drop") => {
  let tranlation = { height: 0, widht: 0 };
  let { height } = element.getBoundingClientRect();

  let sibling = element.nextElementSibling;
  const brother = sibling as HTMLElement;
  if (!(sibling instanceof HTMLElement)) {
    return;
  }
  setBorderBoxStyle(brother);

  const brotherMarginTop = parseFloatEmpty(brother.style.marginTop);
  const marginBottom = parseFloatEmpty(element.style.marginBottom);
  const marginTop = parseFloatEmpty(element.style.marginTop);
  let bottom = marginBottom;
  if (brotherMarginTop <= marginBottom) {
    bottom -= brotherMarginTop;
  }
  let top = marginTop;
  const previousElement = element.previousElementSibling as HTMLElement;
  if (previousElement) {
    setBorderBoxStyle(previousElement);

    const previousMarginBottom = parseFloatEmpty(
      previousElement.style.marginBottom
    );
    if (previousMarginBottom >= marginTop) {
      top = previousMarginBottom - marginTop;
    }
  }
  tranlation.height = height + top + bottom;
  while (sibling) {
    var element = sibling as HTMLElement;
    setBorderBoxStyle(element);
    if (sibling instanceof HTMLElement) {
      const siblingDraggableId = sibling.getAttribute("draggable-id") ?? "";
      eventBus.emit(event, {
        element: sibling,
        height: tranlation.height,
        draggableIdEvent: siblingDraggableId,
      });
    }
    sibling = sibling.nextElementSibling;
  }
};

const assignOnmouseup = (
  element: HTMLElement,
  onmouseupFunc: ((event: MouseEvent) => void) | null
) => {
  element.onmouseup = onmouseupFunc;
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
  element.style.transition = "transform 300 ease";
  setTimeout(() => {
    element.style.transition = "";
  }, 300);
};
const setDraggingStyles = (element: HTMLElement) => {
  const { width, height } = element.getBoundingClientRect();
  element.style.position = "absolute";
  element.style.zIndex = "1000";
  element.style.transition = "";
  element.style.top = `${position.value.top}px`;
  element.style.left = `${position.value.left}px`;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
};
const setBorderBoxStyle = (element: HTMLElement) => {
  element.style.boxSizing = "border-box";
};
const moveHeight = (element: HTMLElement, height: number) => {
  if (element) {
    element.style.transform = `translate( 0, ${height}px)`;
  }
};
const parseFloatEmpty = (value: string) => {
  if (!value || value.trim().length == 0) {
    return 0;
  }
  return parseFloat(value);
};

const computedCursor = computed(() => (dragging.value ? "grabbing" : "grab"));
</script>
<style>
.draggable {
  cursor: v-bind("computedCursor");
}
</style>
<!-- TODO: refactor -->
<!-- TODO: add transform:translate(vertical) the others draggable below one being dragged -->
