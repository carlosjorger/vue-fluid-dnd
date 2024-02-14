<template><slot :set-ref="setSlotRef"></slot></template>
<script setup lang="ts">
import { ComponentPublicInstance, inject, onMounted, ref, watch } from "vue";
import { LocalEventBus, useMittEvents } from "@/utils/EventBus";
import { Direction, DragMouseTouchEvent, DraggableElement } from "../../index";
import {
  setBorderBoxStyle,
  fixSizeStyle,
  moveTranslate,
  assignDraggingEvent,
  setTranistion,
} from "@/utils/SetStyles";
import {
  getScroll,
  getMarginStyleByProperty,
  hasIntersection,
  getBorderWidthProperty,
  calculateRangeWhileDragging,
  calculateWhileDragging,
  getPropByDirection,
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
type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
type DragEvent = DraggingEvent | typeof DROP_EVENT | typeof START_DROP_EVENT;
type VerticalDirection = "top" | "down" | "quiet";
type HorizontalDirection = "left" | "right" | "quiet";
type MouseDirection = {
  vertical: VerticalDirection;
  horizontal: HorizontalDirection;
};
// TODO. replace mouseevent

enum DraggingState {
  NOT_DRAGGING = "notDragging",
  START_DRAGGING = "startDragging",
  DRAGING = "dragging",
  END_DRAGGING = "endDragging",
}
const draggingState = ref<DraggingState>(DraggingState.NOT_DRAGGING);
const position = ref({ top: 0, left: 0 });
const currentOffset = ref({ offsetX: 0, offsetY: 0 });
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
              draggableIdEvent,
              element,
            });
          }, duration);
        } else if (targetIndex === index) {
          moveTranslate(
            element,
            sourceElementTranlation.height,
            sourceElementTranlation.width
          );
          setTimeout(() => {
            onDrop(
              {
                index: sourceIndex,
              },
              {
                index: targetIndex,
              }
            );
            eventBus?.emit(DROP_EVENT, {
              droppableId,
              element,
            });
          }, duration);
        }
      }
    },
    drop: ({ droppableId: droppableIdEvent, draggableIdEvent, element }) => {
      if (
        (draggableIdEvent === undefined || draggableId === draggableIdEvent) &&
        droppableIdEvent === droppableId
      ) {
        const observer = createObserverWithCallBack(() => {
          removeTranslateWhitoutTransition();
          observer.disconnect();
        });
        observer.observe(element, {
          attributes: true,
          attributeFilter: ["style"],
        });
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
const createObserverWithCallBack = (callback: () => void) => {
  return new MutationObserver((mutations) => {
    mutations.forEach(() => {
      callback();
    });
  });
};
const removeTranslateWhitoutTransition = () => {
  if (childRef.value) {
    childRef.value.style.transition = "";
    childRef.value.style.transform = "";
  }
};
const setSlotRef = (
  ref: Element | ComponentPublicInstance | null,
  refs: Record<string, any>
) => {
  childRef.value = ref as HTMLElement;
  if (childRef.value && refs) {
    childRef.value.style.cursor = GRAB_CURSOR;
  }
};
const setSlotRefElementParams = (element: HTMLElement | undefined) => {
  if (element) {
    element.classList.add("draggable");

    assignDraggingEvent(element, "onmousedown", onmousedown);

    assignDraggingEvent(element, "ontouchstart", (event) => {
      console.log(event.pageY, "TouchEvent");
    });

    element.setAttribute(DRAGGABLE_ID_ATTR, draggableId);
  }
  if (element?.parentElement) {
    element?.parentElement.classList.add("droppable");
  }
};
const setTransform = (
  element: HTMLElement,
  event: DragMouseTouchEvent
): MouseDirection => {
  const elementBoundingClientRect = element.getBoundingClientRect();

  let vertical: VerticalDirection = "quiet";
  let horizontal: HorizontalDirection = "quiet";

  const directionInfo = {
    horizontal: {
      before: "left" as HorizontalDirection,
      after: "right" as HorizontalDirection,
      quiet: "quiet" as HorizontalDirection,
    },
    vertical: {
      before: "top" as VerticalDirection,
      after: "down" as VerticalDirection,
      quiet: "quiet" as VerticalDirection,
    },
  };
  const getTranslateWihtDirection = <
    T = VerticalDirection | HorizontalDirection
  >(
    direction: Direction
  ): { direction: T; newTranslate: number } => {
    const directionValues = directionInfo[direction];

    const {
      beforeMargin,
      borderBeforeWidth,
      before,
      offset,
      scroll,
      page,
      inner,
      distance,
      axis,
    } = getPropByDirection(direction);

    const pageValue = event[page];
    const elementPosittion = pageValue - currentOffset.value[offset];
    const scrollValue = window[scroll];
    const innerDistance = window[inner];
    const distanceValue = elementBoundingClientRect[distance];

    if (
      elementPosittion >= scrollValue - distanceValue / 2 &&
      elementPosittion <= scrollValue + innerDistance
    ) {
      const border = getBorderWidthProperty(element, borderBeforeWidth);
      const newTranslate =
        elementPosittion -
        position.value[before] -
        border -
        getMarginStyleByProperty(element, beforeMargin) -
        scrollValue;

      if (translate.value.x > newTranslate) {
        return {
          direction: directionValues.before as T,
          newTranslate,
        };
      } else if (translate.value.x < newTranslate) {
        return {
          direction: directionValues.after as T,
          newTranslate,
        };
      } else {
        return {
          direction: directionValues.quiet as T,
          newTranslate,
        };
      }
    }
    const defaultTransalation = translate.value[axis];
    return {
      direction: directionValues.quiet as T,
      newTranslate: defaultTransalation,
    };
  };

  const { direction: horizontalDirection, newTranslate: newTranslateX } =
    getTranslateWihtDirection<HorizontalDirection>("horizontal");
  horizontal = horizontalDirection;
  translate.value.x = newTranslateX;

  const { direction: verticalDirection, newTranslate: newTranslateY } =
    getTranslateWihtDirection<VerticalDirection>("vertical");
  vertical = verticalDirection;
  translate.value.y = newTranslateY;
  return { vertical, horizontal };
};

const onmousemove = function (
  event: DragMouseTouchEvent,
  element: HTMLElement
) {
  if (draggingState.value === DraggingState.START_DRAGGING) {
    startDragging(event);
  } else if (draggingState.value === DraggingState.DRAGING) {
    const mouseDirection = setTransform(element, event);
    emitEventToSiblings(element, DRAG_EVENT, mouseDirection);
  }
};
const handlerMousemove = (event: DragMouseTouchEvent) => {
  if (childRef.value) {
    onmousemove(event, childRef.value);
  }
};
const onmousedown = (event: DragMouseTouchEvent) => {
  const element = event.target as HTMLElement;
  if (draggingState.value === DraggingState.NOT_DRAGGING) {
    draggingState.value = DraggingState.START_DRAGGING;
    document.addEventListener(MOUSEMOVE_EVENT, handlerMousemove);
    if (element) {
      assignDraggingEvent(
        element,
        "onmouseup",
        (event: DragMouseTouchEvent) => {
          onDropDraggingEvent(event);
          document.removeEventListener(MOUSEMOVE_EVENT, handlerMousemove);
          assignDraggingEvent(element, "onmouseup", null);
        }
      );
    }
  }
};
const startDragging = (event: DragMouseTouchEvent) => {
  const element = event.target as HTMLElement;
  scroll.value = getScroll(element.parentElement);
  element.style.cursor = GRABBING_CURSOR;
  const { offsetX, offsetY } = event;
  currentOffset.value = { offsetX, offsetY };
  draggingState.value = DraggingState.DRAGING;
  emitEventToSiblings(element, START_DRAG_EVENT, {
    vertical: "down",
    horizontal: "right",
  });
  fixSizeStyle(element.parentElement);
  const getPositionByDistance = (direction: Direction) => {
    const { offset, beforeMargin, page, borderBeforeWidth, scroll } =
      getPropByDirection(direction);
    return (
      event[page] -
      currentOffset.value[offset] -
      getMarginStyleByProperty(element, beforeMargin) -
      getBorderWidthProperty(element, borderBeforeWidth) -
      window[scroll]
    );
  };
  position.value = {
    top: getPositionByDistance("vertical"),
    left: getPositionByDistance("horizontal"),
  };

  setDraggingStyles(element);
  setBorderBoxStyle(element);
  setTransform(element, event);
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

  for (const [index, sibling] of siblings.entries()) {
    const siblingDraggableId = sibling.getAttribute(DRAGGABLE_ID_ATTR) ?? "";
    if (!isOutside) {
      translation = canChangeDraggable(
        direction,
        draggedElement,
        sibling,
        mouseDirection,
        translation
      );
    }
    if (direction && mouseDirection[direction] == "quiet") {
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
  if (!direction) {
    return;
  }
  const { distance } = getPropByDirection(direction);
  if (translation[distance] == 0) {
    actualIndex.value = Math.max(actualIndex.value, siblingIndex);
  } else {
    actualIndex.value = Math.min(actualIndex.value, siblingIndex - 1);
  }
};
const canChangeDraggable = (
  direction: Direction | undefined,
  sourceElement: HTMLElement,
  targetElement: HTMLElement,
  mouseDirection: MouseDirection,
  translation: {
    height: number;
    width: number;
  }
) => {
  if (!direction) {
    return { height: 0, width: 0 };
  }
  const { before, distance, after } = getPropByDirection(direction);
  const currentBoundingClientRect = sourceElement.getBoundingClientRect();
  const targetBoundingClientRect = targetElement.getBoundingClientRect();

  const currentPosition = currentBoundingClientRect[before];
  const currentSize = currentBoundingClientRect[distance];

  const targetosition = targetBoundingClientRect[before];
  const siblingSize = targetBoundingClientRect[distance];

  const siblingMiddle = targetosition + siblingSize / 2;
  if (
    (mouseDirection[direction] === after &&
      currentPosition + currentSize > siblingMiddle) ||
    (mouseDirection[direction] === before && currentPosition > siblingMiddle)
  ) {
    return { height: 0, width: 0 };
  }
  return translation;
};
const getPreviousAndNextElement = (
  draggedElement: HTMLElement,
  elementPosition: number,
  allSiblings: HTMLElement[]
) => {
  const isOutside = draggableIsOutside(draggedElement);

  const targetIndex = isOutside ? elementPosition : actualIndex.value;

  const getPreviousAndNextElementIndex = () => {
    if (elementPosition < targetIndex) {
      return [targetIndex, targetIndex + 1];
    } else {
      return [targetIndex - 1, targetIndex];
    }
  };
  const [previousIndex, nextIndex] = getPreviousAndNextElementIndex();
  const previousElement = allSiblings[previousIndex] ?? null;
  const nextElement = allSiblings[nextIndex] ?? null;
  return {
    previousElement,
    nextElement,
    targetIndex,
  };
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

  const { previousElement, nextElement, targetIndex } =
    getPreviousAndNextElement(draggedElement, elementPosition, allSiblings);

  translation = calculateInitialTranslation(
    draggedElement,
    event,
    previousElement,
    nextElement
  );
  for (const [index, sibling] of siblings.toReversed().entries()) {
    const siblingDraggableId = sibling.getAttribute(DRAGGABLE_ID_ATTR) ?? "";
    let newTranslation = translation;
    if (targetIndex - 1 >= index) {
      newTranslation = { height: 0, width: 0 };
    }
    const draggableTranslation = calculateRangeWhileDragging(
      direction,
      allSiblings,
      elementPosition,
      targetIndex
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
  let { height, width } = calculateWhileDragging(
    direction,
    current,
    previousElement,
    nextElement
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

const onDropDraggingEvent = (event: DragMouseTouchEvent) => {
  if (draggingState.value !== DraggingState.DRAGING) {
    draggingState.value = DraggingState.NOT_DRAGGING;
    return;
  }
  draggingState.value = DraggingState.END_DRAGGING;
  const element = event.target as HTMLElement;
  removeDraggingStyles(element);
  emitEventToSiblings(element, START_DROP_EVENT);
  setTimeout(() => {
    draggingState.value = DraggingState.NOT_DRAGGING;
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
<!-- TODO: refactor -->
<!-- TODO: enable to drag in mobile -->
<!-- TODO: avoid to fix height is already fixed -->
<!-- TODO: implement auto scroll functionality-->
