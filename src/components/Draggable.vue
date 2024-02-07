<template><slot :set-ref="setSlotRef"></slot></template>
<script setup lang="ts">
import { ComponentPublicInstance, inject, onMounted, ref, watch } from "vue";
import { LocalEventBus, useMittEvents } from "@/utils/EventBus";
import { Direction, DraggableElement } from "../../index";
import {
  setBorderBoxStyle,
  fixSizeStyle,
  moveTranslate,
  assignOnmouseup,
  setTranistion,
} from "@/utils/SetStyles";
import {
  getScroll,
  getMarginStyleByProperty,
  hasIntersection,
  calculateWhileDraggingByDirection,
  calculateRangeWhileDraggingByDirection,
  getBorderWidthProperty,
} from "@/utils/GetStyles";
const { draggableId, index } = defineProps<{
  draggableId: string;
  index: number;
}>();
const DRAGGABLE_ID_ATTR = "draggable-id";
const MOUSEMOVE_EVENT = "mousemove";
const DRAG_EVENT = "drag";
const START_DRAG_EVENT = "startDrag";
const START_DROP_EVENT = "startDrop";
const DROP_EVENT = "drop";
const GRAB_CURSOR = "grab";
const GRABBING_CURSOR = "grabbing";
type RefElement<T> = Element | ComponentPublicInstance<T> | null;
type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
type DragEvent = DraggingEvent | typeof DROP_EVENT | typeof START_DROP_EVENT;
type VerticalDirection = "top" | "down" | "quiet";
type HorizontalDirection = "left" | "right" | "quiet";
type MouseDirection = {
  vertical: VerticalDirection;
  horizontal: HorizontalDirection;
};

const style = ref("");
const position = ref({ top: 0, left: 0 });
const offset = ref({ offsetX: 0, offsetY: 0 });
const dragging = ref(false);
const direction = inject<Direction>("direction");
const onDrop =
  inject<(source: DraggableElement, destination: DraggableElement) => void>(
    "onDrop"
  );
const droppableId = inject<string>("droppableId");
const translate = ref({ x: 0, y: 0 });
const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
const duration = 200;

let childRef = ref<HTMLElement>();
const actualIndex = ref(index);
const eventBus = inject(LocalEventBus);
onMounted(() => {
  useMittEvents(eventBus, {
    drag: ({
      height,
      width,
      draggableIdEvent,
      droppableId: droppableIdEvent,
    }) => {
      if (draggableId == draggableIdEvent && droppableId === droppableIdEvent) {
        moveTranslate(childRef.value, height, width);
        setTranistion(childRef.value, duration, "ease-in-out");
      }
    },
    startDrop: ({
      height,
      width,
      draggableIdEvent,
      droppableId: droppableIdEvent,
      sourceIndex,
      targetIndex,
      element,
      sourceElementTranlation,
    }) => {
      if (draggableId == draggableIdEvent && droppableId === droppableIdEvent) {
        moveTranslate(childRef.value, height, width);
        if (!onDrop) {
          return;
        }
        if (sourceIndex === targetIndex) {
          setTimeout(() => {
            eventBus?.emit(DROP_EVENT, {
              droppableId,
            });
          }, duration);
        } else if (targetIndex === index) {
          moveTranslate(
            element,
            sourceElementTranlation.height,
            sourceElementTranlation.width
          );
          setTimeout(() => {
            eventBus?.emit(DROP_EVENT, {
              droppableId,
            });
            onDrop(
              {
                index: sourceIndex,
              },
              {
                index: targetIndex,
              }
            );
          }, duration);
        }
      }
    },
    drop: ({ droppableId: droppableIdEvent }) => {
      if (droppableIdEvent === droppableId) {
        removeTranslateWhitoutTransition();
      }
    },
    startDrag: ({
      height,
      width,
      draggableIdEvent,
      droppableId: droppableIdEvent,
    }) => {
      if (draggableId == draggableIdEvent && droppableId === droppableIdEvent) {
        moveTranslate(childRef.value, height, width);
      }
    },
  });
});
const removeTranslateWhitoutTransition = () => {
  if (childRef.value) {
    childRef.value.style.transition = ``;
  }
  moveTranslate(childRef.value, 0, 0);
};
const setSlotRef = <_>(el: RefElement<_>) => {
  childRef.value = el as HTMLElement;
  if (childRef.value) {
    childRef.value.style.cursor = GRAB_CURSOR;
  }
};

const setSlotRefElementParams = (element: HTMLElement | undefined) => {
  if (element) {
    element.classList.add("draggable");
    element.onmousedown = onmousedown;
    element.setAttribute(DRAGGABLE_ID_ATTR, draggableId);
  }
  if (element?.parentElement) {
    element?.parentElement.classList.add("droppable");
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
  const { scrollX, scrollY } = window;

  let vertical: VerticalDirection = "top";
  let horizontal: HorizontalDirection = "left";
  if (
    elementXPosittion >= scrollX - width / 2 &&
    elementXPosittion <= scrollX + innerWidth
  ) {
    const borderLeft = getBorderWidthProperty(element, "borderLeftWidth");
    const newTranslateX =
      elementXPosittion -
      position.value.left -
      borderLeft -
      getMarginStyleByProperty(element, "marginLeft") -
      scrollX;
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
    elementYPosition >= scrollY - height / 2 &&
    elementYPosition <= scrollY + innerHeight
  ) {
    const borderTop = getBorderWidthProperty(element, "borderTopWidth");
    const newTranslateY =
      elementYPosition -
      position.value.top -
      borderTop -
      getMarginStyleByProperty(element, "marginTop") -
      scrollY;
    if (translate.value.y > newTranslateY) {
      vertical = "top";
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
    document.removeEventListener(MOUSEMOVE_EVENT, handlerMousemove, false);
    return;
  }
  element.style.cursor = GRABBING_CURSOR;
  style.value = element.style.cssText;
  const { offsetX, offsetY, pageY, pageX } = event;
  const { scrollY, scrollX } = window;
  dragging.value = true;
  offset.value = { offsetX, offsetY };
  emitEventToSiblings(element, START_DRAG_EVENT, {
    vertical: "down",
    horizontal: "right",
  });
  fixSizeStyle(element.parentElement);

  const borderLeft = getBorderWidthProperty(element, "borderLeftWidth");
  const borderTop = getBorderWidthProperty(element, "borderTopWidth");

  position.value = {
    top:
      pageY -
      offset.value.offsetY -
      getMarginStyleByProperty(element, "marginTop") -
      borderTop -
      scrollY,
    left:
      pageX -
      offset.value.offsetX -
      getMarginStyleByProperty(element, "marginLeft") -
      borderLeft -
      scrollX,
  };
  setDraggingStyles(element);
  setBorderBoxStyle(element);
  setTransform(element, pageX, pageY);

  document.addEventListener(MOUSEMOVE_EVENT, handlerMousemove);
  if (element) {
    assignOnmouseup(element, (event: MouseEvent) => {
      onmouseup(event);
      document.removeEventListener(MOUSEMOVE_EVENT, handlerMousemove);
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
    emitDroppingEventToSiblings(
      draggedElement,
      event,
      siblings,
      elementPosition,
      tranlation
    );
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
    const siblingDraggableId = sibling.getAttribute(DRAGGABLE_ID_ATTR) ?? "";
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
          () => mouseDirection.vertical === "top",
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
  if (
    (direction === "vertical" && translation.height == 0) ||
    (direction === "horizontal" && translation.width == 0)
  ) {
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
  draggedElement: HTMLElement,
  event: DragEvent,
  siblings: HTMLElement[],
  elementPosition: number,
  translation: {
    height: number;
    width: number;
  }
) => {
  const allSiblings = siblings.toReversed();

  allSiblings.splice(elementPosition, 0, draggedElement);

  const isOutside = draggableIsOutside(draggedElement);

  const targetIndex = isOutside ? elementPosition : actualIndex.value;

  let previousElement = allSiblings[targetIndex - 1];
  let nextElement = allSiblings[targetIndex + 1];
  if (elementPosition < targetIndex) {
    previousElement = allSiblings[targetIndex];
    nextElement = allSiblings[targetIndex + 1];
  } else if (elementPosition > targetIndex) {
    previousElement = allSiblings[targetIndex - 1];
    nextElement = allSiblings[targetIndex];
  }
  translation = calculateInitialTranslation(
    draggedElement,
    event,
    previousElement ?? null,
    nextElement ?? null
  );
  for (const [index, sibling] of siblings.toReversed().entries()) {
    const siblingDraggableId = sibling.getAttribute(DRAGGABLE_ID_ATTR) ?? "";
    let newTranslation = translation;
    if (targetIndex - 1 >= index) {
      newTranslation = { height: 0, width: 0 };
    }
    const draggableTranslation = calculateRangeWhileDraggingByDirection(
      allSiblings,
      elementPosition,
      targetIndex,
      direction
    );
    emitEventBus(
      event,
      newTranslation,
      siblingDraggableId,
      elementPosition,
      targetIndex,
      draggableTranslation
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
  targetIndex?: number,
  sourceElementTranlation?: {
    height: number;
    width: number;
  }
) => {
  if (
    event === START_DROP_EVENT &&
    sourceIndex !== undefined &&
    targetIndex !== undefined &&
    sourceElementTranlation !== undefined &&
    childRef.value
  ) {
    eventBus?.emit(event, {
      droppableId,
      draggableIdEvent,
      ...tranlation,
      sourceIndex,
      targetIndex,
      element: childRef.value,
      sourceElementTranlation,
    });
  } else {
    eventBus?.emit(event, {
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
  event: DragEvent,
  previousElement = current.previousElementSibling,
  nextElement = current.nextElementSibling
) => {
  let { height, width } = calculateWhileDraggingByDirection(
    current,
    previousElement,
    nextElement,
    direction
  );
  const intersection = draggableIsOutside(current);
  if (intersection && event == DRAG_EVENT) {
    height = 0;
    width = 0;
  }
  return { height, width };
};
const draggableIsOutside = (draggable: HTMLElement) => {
  const parentElement = draggable.parentElement as HTMLElement;
  return !hasIntersection(draggable, parentElement);
};

const onmouseup = (event: MouseEvent) => {
  onDropDraggingEvent(event);
};
const onDropDraggingEvent = (event: MouseEvent) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  removeDraggingStyles(element);
  emitEventToSiblings(element, START_DROP_EVENT);
  setTimeout(() => {
    element.style.position = "";
    element.style.zIndex = "";
    element.style.transform = "";
    element.style.transition = "";
    element.style.top = "";
    element.style.left = "";
    element.style.cursor = GRAB_CURSOR;
  }, duration);
};
const removeDraggingStyles = (element: HTMLElement) => {
  setTranistion(element, duration);
  moveTranslate(element, 0, 0);
};

const setDraggingStyles = (element: HTMLElement) => {
  fixSizeStyle(element);
  element.style.position = "fixed";
  element.style.zIndex = "5000";
  element.style.transition = "";
};

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
  box-sizing: border-box !important;
}
</style>
<!-- TODO: fix when the margin is inherit from a class -->
<!-- example: 
  .sl-markdown-content li + li:not(:where(.not-content *)){
    margin-top: 1rem;
  } -->
<!-- TODO: refactor -->
<!-- TODO: remove flashing of elements -->
<!-- TODO: implement auto scroll functionality-->
