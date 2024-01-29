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
import { Direction, Draggable } from "../../index.ts";
import {
  setBorderBoxStyle,
  fixSizeStyle,
  moveTranslate,
  assignOnmouseup,
  setTranistion,
} from "@/utils/SetStyles";
import {
  getScroll,
  parseFloatEmpty,
  computeGapPixels,
  hasIntersection,
} from "@/utils/GetStyles";
const { draggableId, index } = defineProps<{
  draggableId: string;
  index: number;
}>();

type RefElement<T> = Element | ComponentPublicInstance<T> | null;
type DraggingEvent = "drag" | "startDrag";
type DragEvent = DraggingEvent | "drop" | "startDrop";
type VerticalDirection = "up" | "down" | "quiet";
type HorizontalDirection = "left" | "right" | "quiet";
type MouseDirection = {
  vertical: VerticalDirection;
  horizontal: HorizontalDirection;
};
const START_DRAG_EVENT = "startDrag";
const DRAG_EVENT = "drag";
const START_DROP_EVENT = "startDrop";
const DROP_EVENT = "drop";

const style = ref("");
const position = ref({ top: 0, left: 0 });
const offset = ref({ offsetX: 0, offsetY: 0 });
const dragging = ref(false);
const direction = inject<Direction>("direction");
const onDrop =
  inject<(source: Draggable, destination: Draggable) => void>("onDrop");
const droppableId = inject<string>("droppableId");
const translate = ref({ x: 0, y: 0 });
const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
const duration = 200;

let childRef = ref<HTMLElement>();
const actualIndex = ref(index);
// TODO: improve mitter
onMounted(() => {
  eventBus.on(
    DRAG_EVENT,
    ({ height, width, draggableIdEvent, droppableId: droppableIdEvent }) => {
      if (draggableId == draggableIdEvent && droppableId === droppableIdEvent) {
        moveTranslate(childRef.value, height, width);
        setTranistion(childRef.value, duration, "ease-in-out");
      }
    }
  );
  eventBus.on(
    START_DRAG_EVENT,
    ({ height, width, draggableIdEvent, droppableId: droppableIdEvent }) => {
      if (draggableId == draggableIdEvent && droppableId === droppableIdEvent) {
        moveTranslate(childRef.value, height, width);
      }
    }
  );
  eventBus.on(
    START_DROP_EVENT,
    ({
      height,
      width,
      draggableIdEvent,
      droppableId: droppableIdEvent,
      sourceIndex,
      targetIndex,
    }) => {
      if (draggableId == draggableIdEvent && droppableId === droppableIdEvent) {
        moveTranslate(childRef.value, height, width);
        if (onDrop && targetIndex === index) {
          onDrop(
            {
              index: sourceIndex,
            },
            {
              index: targetIndex,
            }
          );
        }
      }
    }
  );
  eventBus.on(DROP_EVENT, () => {
    if (childRef.value) {
      childRef.value.style.transition = ``;
    }
    moveTranslate(childRef.value, 0, 0);
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
const setTransform = (
  element: HTMLElement,
  pageX: number,
  pageY: number
): MouseDirection => {
  const { width, height } = element.getBoundingClientRect();
  const { innerWidth, innerHeight } = window;
  const elementXPosittion = pageX - offset.value.offsetX;
  const elementYPosition = pageY - offset.value.offsetY;
  let vertical: VerticalDirection = "up";
  let horizontal: HorizontalDirection = "left";
  if (
    elementXPosittion >= -width / 2 &&
    elementXPosittion <= innerWidth + width / 2
  ) {
    const newTranslateX =
      elementXPosittion -
      position.value.left -
      parseFloatEmpty(element.style.marginLeft);
    if (translate.value.x > newTranslateX) {
      horizontal = "left";
    } else if (translate.value.x < newTranslateX) {
      horizontal = "right";
    } else {
      horizontal = "quiet";
    }
    translate.value.x = newTranslateX;
  }
  if (
    elementYPosition >= -height / 2 &&
    elementYPosition <= innerHeight + height / 2
  ) {
    const newTranslateY =
      elementYPosition -
      position.value.top -
      parseFloatEmpty(element.style.marginTop);
    if (translate.value.y > newTranslateY) {
      vertical = "up";
    } else if (translate.value.y < newTranslateY) {
      vertical = "down";
    } else {
      vertical = "quiet";
    }
    translate.value.y = newTranslateY;
  }
  return { vertical, horizontal };
};

const onmousemove = function (event: MouseEvent, element: HTMLElement) {
  if (!dragging.value) {
    return;
  }
  const mouseDirection = setTransform(element, event.pageX, event.pageY);
  emitEventToSiblings(element, DRAG_EVENT, mouseDirection);
};
const handlerMousemove = (event: MouseEvent) => {
  if (childRef.value) {
    onmousemove(event, childRef.value);
  }
};
const onmousedown = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  scroll.value = getScroll(element.parentElement);

  if (dragging.value) {
    onDropDraggingEvent(event);
    document.removeEventListener("mousemove", handlerMousemove, false);
    return;
  }
  style.value = element.style.cssText;
  const { width, height } = element.getBoundingClientRect();
  const { offsetX, offsetY, x, y, pageY, pageX } = event;
  const { marginTop, marginLeft } = element.style;
  dragging.value = true;
  offset.value = { offsetX, offsetY };
  emitEventToSiblings(element, START_DRAG_EVENT, {
    vertical: "down",
    horizontal: "right",
  });
  fixSizeStyle(element.parentElement);
  position.value = {
    top: y - height / 2 - parseFloatEmpty(marginTop),
    left: x - width / 2 - parseFloatEmpty(marginLeft),
  };
  setDraggingStyles(element);
  setBorderBoxStyle(element);
  setTransform(element, pageX, pageY);

  document.addEventListener("mousemove", handlerMousemove);
  if (element) {
    assignOnmouseup(element, (event: MouseEvent) => {
      onmouseup(event);
      document.removeEventListener("mousemove", handlerMousemove);
      assignOnmouseup(element, null);
    });
  }
};
const emitEventToSiblings = (
  draggedElement: HTMLElement,
  event: DragEvent,
  mouseDirection: MouseDirection = {
    vertical: "quiet",
    horizontal: "quiet",
  }
) => {
  let tranlation = { height: 0, width: 0 };
  tranlation = calculateInitialTranslation(draggedElement, event);
  const { siblings, elementPosition } = getSiblings(draggedElement);
  const dropping = event === DROP_EVENT || event === START_DROP_EVENT;
  if (!dropping) {
    emitDraggingEventToSiblings(
      draggedElement,
      event,
      mouseDirection,
      siblings,
      tranlation
    );
  } else {
    emitDroppingEventToSiblings(event, siblings, elementPosition, tranlation);
  }
};

const emitDraggingEventToSiblings = (
  draggedElement: HTMLElement,
  event: DragEvent,
  mouseDirection: MouseDirection,
  siblings: HTMLElement[],
  translation: {
    height: number;
    width: number;
  }
) => {
  const isOutside = draggableIsOutside(draggedElement);
  const {
    top: currentTop,
    height: currentHeight,
    left: currentLeft,
    width: currentWidth,
  } = draggedElement.getBoundingClientRect();
  for (const [index, sibling] of siblings.entries()) {
    const siblingDraggableId = sibling.getAttribute("draggable-id") ?? "";
    if (!isOutside) {
      const {
        top: siblingTop,
        height: siblingHeight,
        left: siblingLeft,
        width: siblingWidth,
      } = sibling.getBoundingClientRect();
      if (direction === "vertical") {
        translation = canChangeDraggable(
          () => mouseDirection.vertical === "down",
          () => mouseDirection.vertical === "up",
          currentTop,
          currentHeight,
          siblingTop,
          siblingHeight,
          translation
        );
      }
      if (direction === "horizontal") {
        translation = canChangeDraggable(
          () => mouseDirection.horizontal === "right",
          () => mouseDirection.horizontal === "left",
          currentLeft,
          currentWidth,
          siblingLeft,
          siblingWidth,
          translation
        );
      }
    }
    if (
      (direction === "vertical" && mouseDirection.vertical == "quiet") ||
      (direction === "horizontal" && mouseDirection.horizontal == "quiet")
    ) {
      continue;
    }
    const siblingRealIndex = siblings.length - index;
    updateActualIndexBaseOnTranslation(translation, siblingRealIndex);
    emitEventBus(event, translation, siblingDraggableId);
  }
};
const updateActualIndexBaseOnTranslation = (
  translation: {
    height: number;
    width: number;
  },
  siblingIndex: number
) => {
  if (translation.height == 0) {
    actualIndex.value = Math.max(actualIndex.value, siblingIndex);
  } else {
    actualIndex.value = Math.min(actualIndex.value, siblingIndex - 1);
  }
};
const canChangeDraggable = (
  isGoingFoward: () => boolean,
  isGoingBackwards: () => boolean,
  currentPosition: number,
  currentSize: number,
  siblingPosition: number,
  siblingSize: number,
  translation: {
    height: number;
    width: number;
  }
) => {
  const siblingMiddle = siblingPosition + siblingSize / 2;
  if (
    (isGoingFoward() && currentPosition + currentSize > siblingMiddle) ||
    (isGoingBackwards() && currentPosition > siblingMiddle)
  ) {
    return { height: 0, width: 0 };
  }
  return translation;
};
const emitDroppingEventToSiblings = (
  event: DragEvent,
  siblings: HTMLElement[],
  elementPosition: number,
  translation: {
    height: number;
    width: number;
  }
) => {
  const elementInvertPosition = siblings.length - elementPosition;
  for (const [index, sibling] of siblings.entries()) {
    const siblingDraggableId = sibling.getAttribute("draggable-id") ?? "";
    if (elementInvertPosition <= index) {
      translation = { height: 0, width: 0 };
    }
    emitEventBus(
      event,
      translation,
      siblingDraggableId,
      elementPosition,
      actualIndex.value
    );
  }
};
const emitEventBus = (
  event: DragEvent,
  tranlation: {
    height: number;
    width: number;
  },
  draggableIdEvent: string,
  sourceIndex?: number,
  targetIndex?: number
) => {
  if (
    event === START_DROP_EVENT &&
    sourceIndex !== undefined &&
    targetIndex !== undefined
  ) {
    eventBus.emit(event, {
      droppableId,
      draggableIdEvent,
      ...tranlation,
      sourceIndex,
      targetIndex,
    });
  } else {
    eventBus.emit(event, {
      droppableId,
      draggableIdEvent,
      ...tranlation,
    });
  }
};
const getSiblings = (current: HTMLElement) => {
  const nextSiblings = nextSiblingsFromElement(current);
  const { previousSiblings, elementPosition } =
    previousSiblingsFromElement(current);
  return {
    siblings: [...nextSiblings, ...previousSiblings],
    elementPosition,
  };
};
const nextSiblingsFromElement = (current: HTMLElement) => {
  const siblings = [] as HTMLElement[];
  let sibling = current as Element | null;
  while (sibling) {
    sibling = sibling.nextElementSibling;
    if (sibling instanceof HTMLElement) {
      siblings.push(sibling as HTMLElement);
    }
  }
  return siblings.toReversed();
};
const previousSiblingsFromElement = (current: HTMLElement) => {
  const siblings = [] as HTMLElement[];
  let previousSibling = current as Element | null;
  while (previousSibling) {
    previousSibling = previousSibling.previousElementSibling;
    if (previousSibling instanceof HTMLElement) {
      siblings.push(previousSibling as HTMLElement);
    }
  }
  return {
    previousSiblings: siblings,
    elementPosition: siblings.length,
  };
};
const calculateInitialTranslation = (
  current: HTMLElement,
  event: DragEvent
) => {
  let height = 0;
  let width = 0;
  if (!direction) {
    return { height, width };
  }
  if (direction === "vertical") {
    height = calculateHeightWhileDragging(current);
  } else if (direction === "horizontal") {
    width = calculateWidthWhileDragging(current);
  }
  const intersection = draggableIsOutside(current);
  if (intersection && event == "drag") {
    height = 0;
    width = 0;
  }
  return { height, width };
};
const draggableIsOutside = (draggable: HTMLElement) => {
  const parentElement = draggable.parentElement as HTMLElement;
  return !hasIntersection(draggable, parentElement);
};

const calculateHeightWhileDragging = (current: HTMLElement) => {
  let { height } = current.getBoundingClientRect();
  return calculateWhileDragging(
    current,
    "marginTop",
    "marginBottom",
    height,
    "rowGap"
  );
};

const calculateWidthWhileDragging = (current: HTMLElement) => {
  let { width } = current.getBoundingClientRect();
  return calculateWhileDragging(
    current,
    "marginLeft",
    "marginRight",
    width,
    "columnGap"
  );
};
const calculateWhileDragging = (
  current: HTMLElement,
  beforeMargin: "marginTop" | "marginLeft",
  afterMargin: "marginBottom" | "marginRight",
  space: number,
  gapStyle: "columnGap" | "rowGap"
) => {
  const currentAfterMargin = parseFloatEmpty(current.style[afterMargin]);
  const currentBeforeMargin = parseFloatEmpty(current.style[beforeMargin]);
  let brotherBeforeMargin = 0;
  const nextElement = current.nextElementSibling as HTMLElement;
  if (nextElement) {
    brotherBeforeMargin = parseFloatEmpty(nextElement.style[beforeMargin]);
  }
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
  onDropDraggingEvent(event);
};
const onDropDraggingEvent = (event: MouseEvent) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  removeDraggingStyles(event, element);
  emitEventToSiblings(element, START_DROP_EVENT);
  setTimeout(() => {
    emitEventToSiblings(element, DROP_EVENT);
    element.style.position = "";
    element.style.zIndex = "";
    element.style.transform = "";
    element.style.transition = "";
  }, duration);
};
const removeDraggingStyles = (event: MouseEvent, element: HTMLElement) => {
  const { pageY, y, pageX, x } = event;
  const { width, height } = element.getBoundingClientRect();
  setTranistion(element, duration);

  const { scrollTop, scrollLeft } = getScroll(element.parentElement);
  translate.value.x =
    pageX -
    x -
    offset.value.offsetX +
    width / 2 +
    (scroll.value.scrollLeft - scrollLeft);
  translate.value.y =
    pageY -
    y -
    offset.value.offsetY +
    height / 2 +
    (scroll.value.scrollTop - scrollTop);
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
<!-- TODO: fix animation after dropping elements -->
<!-- TODO: refactor -->
