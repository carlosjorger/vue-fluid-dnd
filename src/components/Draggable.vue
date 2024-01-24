<template><slot :set-ref="setSlotRef"></slot></template>
<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  inject,
  onMounted,
  ref,
  watch,
} from "vue";
import eventBus from "@/utils/EventBus";
import { Direction } from "../../index.ts";

const { draggableId } = defineProps<{
  draggableId: string;
  enableDrag: boolean;
}>();

type RefElement<T> = Element | ComponentPublicInstance<T> | null;

const DRAG_EVENT = "drag";
const DROP_EVENT = "drop";

const style = ref("");
const position = ref({ top: 0, left: 0 });
const offset = ref({ offsetX: 0, offsetY: 0 });
const dragging = ref(false);
let childRef = ref<HTMLElement>();
const direction = inject<Direction>("direction");

onMounted(() => {
  eventBus.on("drag", (param) => {
    const { element, height, width, draggableIdEvent } = param;
    if (draggableId == draggableIdEvent) {
      moveHeight(element, height, width);
    }
  });
  eventBus.on("drop", ({ element }: { element: HTMLElement }) => {
    moveHeight(element, 0, 0);
  });
});
const setSlotRef = <_>(el: RefElement<_>) => {
  childRef.value = el as HTMLElement;
};

const setSlotRefElementParams = (element: HTMLElement | undefined) => {
  if (element) {
    element.classList.add("draggable");
    element.onmousedown = onmousedown;
    element.setAttribute("draggable-id", draggableId);
  }
};
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
  if (dragging.value) {
    removeDraggingStyles(element);
    return;
  }
  style.value = element.style.cssText;
  const { width, height } = element.getBoundingClientRect();
  const { offsetX, offsetY, x, y, pageY, pageX } = event;
  const { marginTop, marginLeft } = element.style;
  dragging.value = true;
  offset.value = { offsetX, offsetY };
  emitDragEventToSiblings(element);
  fixParentHeight(element);
  position.value = {
    top: pageY - height / 2 - parseFloatEmpty(marginTop),
    left: pageX - width / 2 - parseFloatEmpty(marginLeft),
  };
  setDraggingStyles(element);
  setBorderBoxStyle(element);
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

  let sibling = element.nextElementSibling;
  const brother = sibling as HTMLElement;
  if (!(sibling instanceof HTMLElement)) {
    return;
  }
  if (!direction) {
    return;
  }
  if (direction === "vertical") {
    tranlation.height = calculateHeightWhileDragging(element, brother);
  } else if (direction === "horizontal") {
    tranlation.widht = calculateWidthWhileDragging(element, brother);
  }
  while (sibling) {
    var element = sibling as HTMLElement;
    if (sibling instanceof HTMLElement) {
      const siblingDraggableId = sibling.getAttribute("draggable-id") ?? "";
      eventBus.emit(event, {
        element: sibling,
        draggableIdEvent: siblingDraggableId,
        height: tranlation.height,
        width: tranlation.widht,
      });
    }
    sibling = sibling.nextElementSibling;
  }
};
// TODO: refactor both function calculateHeightWhileDragging and calculateWidthWhileDragging
const calculateHeightWhileDragging = (
  current: HTMLElement,
  brother: HTMLElement
) => {
  let { height } = current.getBoundingClientRect();
  const brotherMarginTop = parseFloatEmpty(brother.style.marginTop);
  const currentMarginBottom = parseFloatEmpty(current.style.marginBottom);
  const currentMarginTop = parseFloatEmpty(current.style.marginTop);
  let bottom = currentMarginBottom;
  let top = currentMarginTop;
  let rest = brotherMarginTop;
  const gap = computeGapPixels(current.parentElement as HTMLElement, "rowGap");
  if (gap > 0) {
    return height + top + bottom + gap;
  }
  bottom = Math.max(brotherMarginTop, currentMarginBottom);
  const previousElement = current.previousElementSibling as HTMLElement;
  if (previousElement) {
    const previousMarginBottom = parseFloatEmpty(
      previousElement.style.marginBottom
    );
    top = Math.max(previousMarginBottom, currentMarginTop);
    rest = Math.max(rest, previousMarginBottom);
  }
  return height + top + bottom - rest;
};
const calculateWidthWhileDragging = (
  current: HTMLElement,
  brother: HTMLElement
) => {
  let { width } = current.getBoundingClientRect();
  const brotherMarginLeft = parseFloatEmpty(brother.style.marginLeft);
  const currentMarginRight = parseFloatEmpty(current.style.marginRight);
  const currentMarginLeft = parseFloatEmpty(current.style.marginLeft);
  let right = currentMarginRight;
  let left = currentMarginLeft;
  const gap = computeGapPixels(
    current.parentElement as HTMLElement,
    "columnGap"
  );
  if (gap > 0) {
    return width + left + right + gap;
  }
  if (brotherMarginLeft <= currentMarginRight) {
    right -= brotherMarginLeft;
  }

  const previousElement = current.previousElementSibling as HTMLElement;
  if (previousElement) {
    const previousMarginRight = parseFloatEmpty(
      previousElement.style.marginRight
    );
    if (previousMarginRight >= currentMarginLeft) {
      left = previousMarginRight - currentMarginLeft;
    }
  }
  return width + left + right + gap;
};
const computeGapPixels = (
  element: HTMLElement,
  gapType: "columnGap" | "rowGap"
) => {
  const gap = getComputedStyle(element as HTMLElement)[gapType];
  if (gap.match("%")) {
    const gap_percent = parseFloatEmpty(gap.replace("%", ""));
    const { width } = element.getBoundingClientRect();
    return width * (gap_percent / 100);
  }
  const gap_px = parseFloatEmpty(gap.replace("px", ""));
  return gap_px;
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
  element.style.zIndex = "1000";
  element.style.transition = "transform 300ms ease-out";
  setTimeout(() => {
    element.style.transition = "";
    element.style.zIndex = "";
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
const moveHeight = (element: HTMLElement, height: number, width: number) => {
  if (element) {
    element.style.transform = `translate(${width}px,${height}px)`;
  }
};
const parseFloatEmpty = (value: string) => {
  if (!value || value.trim().length == 0 || value == "normal") {
    return 0;
  }
  return parseFloat(value);
};

const computedCursor = computed(() => (dragging.value ? "grabbing" : "grab"));

watch(childRef, (element) => {
  setSlotRefElementParams(element);
});
</script>
<style>
.draggable {
  cursor: v-bind("computedCursor");
}
</style>
<!-- TODO: test with percent width and height -->
<!-- TODO: refactor -->
<!-- TODO: fix drop outside windows -->
