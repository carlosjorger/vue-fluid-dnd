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
// TODO: try to remove draggable
// TODO. fix cursor position
const draggable = ref<HTMLElement>();
const style = ref("");
const position = ref({ top: 0, left: 0 });
const offset = ref({ offsetX: 0, offsetY: 0 });
const dragging = ref(false);
const index = ref(0);
onMounted(() => {
  provider.value.draggableId = draggableId;
  eventBus.on(
    `${DRAG_EVENT}_${draggableId}`,
    ({ element, height }: { element: HTMLElement; height: number }) => {
      moveHeight(element, height);
    }
  );
  eventBus.on(
    `${DROP_EVENT}_${draggableId}`,
    ({ element }: { element: HTMLElement }) => {
      moveHeight(element, 0);
    }
  );
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
const onmousedown = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  draggable.value = element;
  style.value = element.style.cssText;
  const { top, left } = element.getBoundingClientRect();
  const { offsetX, offsetY, x, y } = event;
  if (dragging.value) {
    removeDraggingStyles(element);
  }
  dragging.value = true;
  position.value = { top, left };
  offset.value = { offsetX, offsetY };
  emitDragEventToSiblings(element);
  fixParentHeight(element);
  setDraggingStyles(element);
  setTransform(element, x, y);

  document.addEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
  if (element) {
    assignOnmouseup((event: MouseEvent) => {
      onmouseup(event);
      assignOnmouseup(null);
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
const emitEventToSiblings = (element: HTMLElement, event: string) => {
  let tranlation = { height: 0, widht: 0 };
  let { height } = element.getBoundingClientRect();

  let sibling = element.nextElementSibling;
  const brother = sibling as HTMLElement;
  if (!(sibling instanceof HTMLElement)) {
    return;
  }
  // console.log(
  //   element.getBoundingClientRect().top - brother.getBoundingClientRect().top,
  //   height
  // );
  const brotherMarginTop = parseFloatEmpty(brother.style.marginTop);
  const marginBottom = parseFloatEmpty(element.style.marginBottom);
  const marginTop = parseFloatEmpty(element.style.marginTop);
  if (brotherMarginTop <= marginBottom) {
    tranlation.height = height + marginTop + marginBottom - brotherMarginTop;
  } else {
    tranlation.height = height + marginTop;
  }
  while (sibling) {
    var element = sibling as HTMLElement;
    if (sibling instanceof HTMLElement) {
      const siblingDraggableId = sibling.getAttribute("draggable-id");

      eventBus.emit(`${event}_${siblingDraggableId}`, {
        element: sibling,
        height: tranlation.height,
      });
    }
    sibling = sibling.nextElementSibling;
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
  element.style.transition = "transform 300 ease";
  setTimeout(() => {
    element.style.transition = "";
  }, 300);
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
  position: initial;
  cursor: v-bind("computedCursor");
  box-sizing: border-box;
}
</style>
<!-- TODO: refactor -->
<!-- TODO: add transform:translate(vertical) the others draggable below one being dragged -->
