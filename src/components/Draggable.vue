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
import {
  setBorderBoxStyle,
  fixSizeStyle,
  moveTranslate,
  assignOnmouseup,
} from "@/utils/SetStyles";
import {
  getScroll,
  parseFloatEmpty,
  computeGapPixels,
} from "@/utils/GetStyles";
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
const direction = inject<Direction>("direction");
const translate = ref({ x: 0, y: 0 });
const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
let childRef = ref<HTMLElement>();
onMounted(() => {
  eventBus.on("drag", (param) => {
    const { element, height, width, draggableIdEvent } = param;
    if (draggableId == draggableIdEvent) {
      moveTranslate(element, height, width);
    }
  });
  eventBus.on("drop", ({ element }: { element: HTMLElement }) => {
    moveTranslate(element, 0, 0);
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
  const { width, height } = element.getBoundingClientRect();
  const { innerWidth, innerHeight } = window;
  const elementXPosittion = pageX - offset.value.offsetX;
  const elementYPosition = pageY - offset.value.offsetY;

  if (
    elementXPosittion >= -width / 2 &&
    elementXPosittion <= innerWidth + width / 2
  ) {
    translate.value.x =
      elementXPosittion -
      position.value.left -
      parseFloatEmpty(element.style.marginLeft);
  }
  if (
    elementYPosition >= -height / 2 &&
    elementYPosition <= innerHeight + height / 2
  ) {
    translate.value.y =
      elementYPosition -
      position.value.top -
      parseFloatEmpty(element.style.marginTop);
  }
};

const onmousemove = function (event: MouseEvent, element: HTMLElement) {
  if (!dragging.value) {
    return;
  }
  setTransform(element, event.pageX, event.pageY);
};
const onmousedown = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  scroll.value = getScroll(element.parentElement);
  if (dragging.value) {
    removeDraggingStyles(event, element);
    return;
  }
  style.value = element.style.cssText;
  const { width, height } = element.getBoundingClientRect();
  const { offsetX, offsetY, x, y, pageY, pageX } = event;
  const { marginTop, marginLeft } = element.style;
  dragging.value = true;
  offset.value = { offsetX, offsetY };
  emitDragEventToSiblings(element);
  fixSizeStyle(element.parentElement);
  position.value = {
    top: y - height / 2 - parseFloatEmpty(marginTop),
    left: x - width / 2 - parseFloatEmpty(marginLeft),
  };
  setDraggingStyles(element);
  setBorderBoxStyle(element);
  setTransform(element, pageX, pageY);

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
const calculateHeightWhileDragging = (
  current: HTMLElement,
  brother: HTMLElement
) => {
  let { height } = current.getBoundingClientRect();
  return calculateWhileDragging(
    current,
    brother,
    "marginTop",
    "marginBottom",
    height,
    "rowGap"
  );
};

const calculateWidthWhileDragging = (
  current: HTMLElement,
  brother: HTMLElement
) => {
  let { width } = current.getBoundingClientRect();
  return calculateWhileDragging(
    current,
    brother,
    "marginLeft",
    "marginRight",
    width,
    "columnGap"
  );
};
const calculateWhileDragging = (
  current: HTMLElement,
  brother: HTMLElement,
  beforeMargin: "marginTop" | "marginLeft",
  afterMargin: "marginBottom" | "marginRight",
  space: number,
  gapStyle: "columnGap" | "rowGap"
) => {
  const brotherBeforeMargin = parseFloatEmpty(brother.style[beforeMargin]);
  const currentAfterMargin = parseFloatEmpty(current.style[afterMargin]);
  const currentBeforeMargin = parseFloatEmpty(current.style[beforeMargin]);
  let afterSpace = currentAfterMargin;
  let beforeScace = currentBeforeMargin;
  let rest = brotherBeforeMargin;
  let gap = 0;
  const parentElement = current.parentElement as HTMLElement;
  gap = computeGapPixels(parentElement, gapStyle);
  if (gap > 0 || parentElement.style.display === "flex") {
    return space + beforeScace + afterSpace + gap;
  }
  afterSpace = Math.max(brotherBeforeMargin, currentAfterMargin);
  const previousElement = current.previousElementSibling as HTMLElement;
  if (previousElement) {
    const previousAfterMargin = parseFloatEmpty(
      previousElement.style[afterMargin]
    );
    beforeScace = Math.max(previousAfterMargin, currentBeforeMargin);
    rest = Math.max(rest, previousAfterMargin);
  }
  return space + beforeScace + afterSpace - rest;
};
const onmouseup = (event: MouseEvent) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  removeDraggingStyles(event, element);
  document.removeEventListener("mousemove", (event: MouseEvent) => {
    onmousemove(event, element);
  });
};
const removeDraggingStyles = (event: MouseEvent, element: HTMLElement) => {
  const duration = 300;
  const { pageY, y, pageX, x } = event;
  const { width, height } = element.getBoundingClientRect();
  element.style.transition = `transform ${duration}ms ease-out`;

  const { scrollTop, scrollLeft } = getScroll(element.parentElement);
  moveTranslate(
    element,
    pageY -
      y -
      offset.value.offsetY +
      height / 2 +
      (scroll.value.scrollTop - scrollTop),
    pageX -
      x -
      offset.value.offsetX +
      width / 2 +
      (scroll.value.scrollLeft - scrollLeft)
  );
  setTimeout(() => {
    element.style.cssText = style.value;
    emitDropEventToSiblings(element);
  }, duration);
};

const setDraggingStyles = (element: HTMLElement) => {
  fixSizeStyle(element);
  element.style.position = "absolute";
  element.style.zIndex = "5000";
  element.style.transition = "";
};

const computedCursor = computed(() => (dragging.value ? "grabbing" : "grab"));

watch(childRef, (element) => {
  setSlotRefElementParams(element);
});
watch(
  position,
  (newPosition) => {
    if (childRef.value) {
      childRef.value.style.top = `${newPosition.top}px`;
      childRef.value.style.left = `${newPosition.left}px`;
    }
  },
  { deep: true }
);
watch(
  translate,
  (newTranslate) => {
    if (childRef.value) {
      childRef.value.style.transform = `translate( ${newTranslate.x}px, ${newTranslate.y}px)`;
    }
  },
  { deep: true }
);
</script>
<style>
.draggable {
  cursor: v-bind("computedCursor");
}
</style>
<!-- TODO: fix bug when element is dropped outside the windows -->
<!-- TODO: create swap animation while dragging -->
<!-- TODO: refactor -->
