<template><slot :set-ref="setSlotRef"></slot></template>
<script setup lang="ts">
import {
  ComponentPublicInstance,
  Ref,
  computed,
  inject,
  ref,
  watch,
} from "vue";
import {
  Direction,
  DragMouseTouchEvent,
  DraggableElement,
  MoveEvent,
  OnLeaveEvent,
  Translate,
} from "../../index";
import {
  moveTranslate,
  assignDraggingEvent,
  setTranistion,
  convetEventToDragMouseTouchEvent,
  setEventWithInterval,
} from "../utils/SetStyles";
import {
  getScroll,
  getMarginStyleByProperty,
  hasIntersection,
  getBorderWidthProperty,
  getPropByDirection,
  getWindowScroll,
  getScrollElement,
  getGapPixels,
  getSiblings,
} from "../utils/GetStyles";
import getTranslationByDragging from "../utils/GetTranslationByDraggingAndEvent";
import getTranslateBeforeDropping from "../utils/GetTranslateBeforeDropping";
import { IsDropEvent } from "../utils";
const props = defineProps<{
  draggableId: string;
  index: number;
}>();
const DRAGGABLE_ID_ATTR = "draggable-id";
const INDEX_ATTR = "index";
const DRAG_EVENT = "drag";
const START_DRAG_EVENT = "startDrag";
const START_DROP_EVENT = "startDrop";
const DROP_EVENT = "drop";
type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
type DropEvent = typeof DROP_EVENT | typeof START_DROP_EVENT;
type DragEvent = DraggingEvent | DropEvent;
type VerticalDirection = "top" | "down" | "quiet";
type HorizontalDirection = "left" | "right" | "quiet";

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
  inject<
    Ref<(source: DraggableElement, destination: DraggableElement) => void>
  >("onDrop");

const translate = ref({ x: 0, y: 0 });
const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
const windowScroll = ref({ scrollY: 0, scrollX: 0 });

const duration = 200;
const pagePosition = ref({ pageX: 0, pageY: 0 });
let childRef = ref<HTMLElement>();
const actualIndex = ref(props.index);
const droppableScroll = ref({ scrollLeft: 0, scrollTop: 0 });
const fixedWidth = ref("");
const fixedHeight = ref("");
const draggableTargetTimingFunction = "cubic-bezier(0.2, 0, 0, 1)";
const createObserverWithCallBack = (callback: () => void) => {
  return new MutationObserver((mutations) => {
    mutations.forEach(() => {
      callback();
    });
  });
};
const removeTranslateWhitoutTransition = (element?: HTMLElement) => {
  if (element) {
    element.style.transition = "";
    element.style.transform = "";
  }
};
const setSlotRef = (
  ref: Element | ComponentPublicInstance | null,
  refs: Record<string, any>
) => {
  if (!ref && refs) {
    return;
  }
  childRef.value = ref as HTMLElement;
  setDraggable();
};
const setDraggable = () => {
  if (childRef.value) {
    childRef.value.classList.add("draggable");
  }
};
const setSlotRefElementParams = (element: HTMLElement | undefined) => {
  if (element) {
    assignDraggingEvent(
      element,
      "onmousedown",
      onmousedown("mousemove", "onmouseup")
    );
    assignDraggingEvent(
      element,
      "ontouchstart",
      onmousedown("touchmove", "ontouchend")
    );
    updateDraggableId(element);
  }
  if (element?.parentElement) {
    element?.parentElement.classList.add("droppable");
  }
};
const updateDraggableId = (element: HTMLElement | undefined) => {
  if (element) {
    element.setAttribute(DRAGGABLE_ID_ATTR, props.draggableId);
    element.setAttribute(INDEX_ATTR, props.index.toString());
  }
};
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
const setTransform = () => {
  const element = childRef.value as HTMLElement;
  const elementBoundingClientRect = element.getBoundingClientRect();

  const getTranslateWihtDirection = (
    translateDirection: Direction
  ): { newTranslate: number; scrollWeight: number } => {
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
    } = getPropByDirection(translateDirection);
    const pageValue = pagePosition.value[page];
    const scrollValue = window[scroll];
    const innerDistance = window[inner];
    const distanceValue = elementBoundingClientRect[distance];
    const border = getBorderWidthProperty(element, borderBeforeWidth);
    const margin = getMarginStyleByProperty(element, beforeMargin);
    const elementPosittion = pageValue - currentOffset.value[offset];
    if (
      elementPosittion >= scrollValue - distanceValue / 2 &&
      elementPosittion <= scrollValue + innerDistance
    ) {
      const newTranslate =
        elementPosittion -
        position.value[before] -
        border -
        margin -
        scrollValue;

      const { scrollWeight } = updateScroll(translateDirection);

      return {
        newTranslate,
        scrollWeight,
      };
    }
    const defaultTransalation = translate.value[axis];
    return {
      newTranslate: defaultTransalation,
      scrollWeight: 1,
    };
  };

  const { newTranslate: newTranslateX } =
    getTranslateWihtDirection("horizontal");
  translate.value.x = newTranslateX;

  const { newTranslate: newTranslateY } = getTranslateWihtDirection("vertical");
  translate.value.y = newTranslateY;
};
// TODO: refactor this function
const updateScroll = (
  translateDirection?: Direction
): {
  scrollDirection: VerticalDirection | HorizontalDirection;
  scrollWeight: number;
} => {
  const element = childRef.value as HTMLElement;

  if (
    element &&
    element.classList.contains("dragging") &&
    parent.value &&
    (translateDirection === direction || translateDirection === undefined) &&
    direction
  ) {
    const directionValues = directionInfo[direction];

    const { before, distance, axis } = getPropByDirection(direction);
    const elementBoundingClientRect = element.getBoundingClientRect();
    const distanceValue = elementBoundingClientRect[distance];

    const parentBoundingClientRect = parent.value.getBoundingClientRect();
    const positionInsideParent =
      position.value[before] -
      parentBoundingClientRect[before] +
      translate.value[axis];

    const parentDistance = parentBoundingClientRect[distance];
    const totalDistance = parentDistance - distanceValue;
    const relativePosition = positionInsideParent / totalDistance;
    const relativeDistanceValue = distanceValue / totalDistance;

    const velocity = 0.1;
    const infLimit = 0.25;
    const upperLimit = 0.75;
    let percent = 0;
    const isOutside = draggableIsOutside(element);
    if (
      !isOutside &&
      relativePosition < infLimit &&
      relativePosition > -relativeDistanceValue
    ) {
      percent = relativePosition / infLimit - 1;
    } else if (
      !isOutside &&
      relativePosition > upperLimit &&
      relativePosition < 1 + relativeDistanceValue
    ) {
      percent = (1 / (1 - upperLimit)) * (relativePosition - upperLimit);
    }
    const scrollAmount = velocity * distanceValue * percent;
    scrollByDirection(parent.value, direction, scrollAmount);
    return {
      scrollDirection: directionValues.after,
      scrollWeight: 1 - Math.abs(percent),
    };
  }
  return { scrollDirection: "quiet", scrollWeight: 1 };
};
const scrollByDirection = (
  element: HTMLElement,
  direction: Direction,
  scrollAmount: number
) => {
  if (scrollAmount == 0) {
    return;
  }
  if (direction === "vertical") {
    element.scrollBy(0, scrollAmount);
  } else {
    element.scrollBy(scrollAmount, 0);
  }
};
const onmousemove = function (event: DragMouseTouchEvent) {
  if (draggingState.value === DraggingState.START_DRAGGING) {
    startDragging(event);
  } else if (draggingState.value === DraggingState.DRAGING) {
    setTransformEvent(event, true);
  }
};
const handlerMousemove = (event: MouseEvent | TouchEvent) => {
  const eventToDragMouse = convetEventToDragMouseTouchEvent(event);
  onmousemove(eventToDragMouse);
};
const onmousedown = (moveEvent: MoveEvent, onLeaveEvent: OnLeaveEvent) => {
  return (event: DragMouseTouchEvent) => {
    const element = event.target as HTMLElement;
    if (parent.value) {
      droppableScroll.value = getScrollElement(parent.value);
    }
    if (draggingState.value === DraggingState.NOT_DRAGGING) {
      draggingState.value = DraggingState.START_DRAGGING;
      document.addEventListener(moveEvent, handlerMousemove);
      setEventWithInterval(parent.value, "onscroll", setTransformDragEvent);
      if (element) {
        assignDraggingEvent(
          element,
          onLeaveEvent,
          onLeave(moveEvent, element, onLeaveEvent)
        );
      }
    }
  };
};
const onLeave = (
  moveEvent: MoveEvent,
  element: HTMLElement,
  onLeaveEvent: OnLeaveEvent
) => {
  return (event: DragMouseTouchEvent) => {
    onDropDraggingEvent(event);
    document.removeEventListener(moveEvent, handlerMousemove);
    if (parent.value?.onscroll) {
      parent.value.onscroll = null;
    }
    assignDraggingEvent(element, onLeaveEvent, null);
  };
};
const startDragging = (event: DragMouseTouchEvent) => {
  const element = event.target as HTMLElement;
  scroll.value = getScroll(element.parentElement);
  windowScroll.value = getWindowScroll();
  const { offsetX, offsetY } = event;
  currentOffset.value = { offsetX, offsetY };
  draggingState.value = DraggingState.DRAGING;
  addTempChild(element);
  emitEventToSiblings(element, START_DRAG_EVENT);
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
};
const addTempChild = (draggedElement: HTMLElement) => {
  if (parent.value) {
    let distances = getTranslationByDragging(
      draggedElement,
      "startDrag",
      direction
    );
    var child = document.createElement("div");
    child.classList.add("temp-child");
    if (direction) {
      const gap = getGapPixels(parent.value, direction);
      const { distance } = getPropByDirection(direction);
      distances[distance] -= gap;
    }
    child.style.height = `${distances.height}px`;
    child.style.minWidth = `${distances.width}px`;
    parent.value.appendChild(child);
  }
};
const setTransformEvent = (
  event: DragMouseTouchEvent,
  emitDragEvent: boolean = false
) => {
  const { pageX, pageY } = event;
  pagePosition.value = { pageX, pageY };
  if (emitDragEvent) {
    setTransformDragEvent();
  }
};
const setTransformDragEvent = () => {
  const element = childRef.value as HTMLElement;

  setTransform();
  emitEventToSiblings(element, DRAG_EVENT);
};
const emitEventToSiblings = (draggedElement: HTMLElement, event: DragEvent) => {
  let tranlation = { height: 0, width: 0 };
  tranlation = getTranslationByDragging(draggedElement, event, direction);
  const { siblings, elementPosition } = getSiblings(draggedElement);
  const dropping = IsDropEvent(event);
  if (!dropping) {
    emitDraggingEventToSiblings(draggedElement, event, siblings, tranlation);
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
  event: DraggingEvent,
  siblings: HTMLElement[],
  translation: Translate
) => {
  const isOutside = draggableIsOutside(draggedElement);

  for (const [index, sibling] of siblings.entries()) {
    const siblingDraggableId = sibling.getAttribute(DRAGGABLE_ID_ATTR) ?? "";
    if (!siblingDraggableId) {
      continue;
    }
    if (!isOutside) {
      const siblingTransition = canChangeDraggable(
        direction,
        draggedElement,
        sibling,
        translation
      );
      if (siblingTransition) {
        translation = siblingTransition;
      } else {
        continue;
      }
    }

    const siblingRealIndex = siblings.length - index;
    updateActualIndexBaseOnTranslation(translation, siblingRealIndex);
    if (event === START_DRAG_EVENT) {
      startDragEventOverElement(sibling, translation);
    } else if (event === DRAG_EVENT) {
      dragEventOverElement(sibling, translation);
    }
  }
};
const startDragEventOverElement = (
  element: HTMLElement,
  translation: Translate
) => {
  const { width, height } = translation;
  moveTranslate(element, height, width);
};
const dragEventOverElement = (element: HTMLElement, translation: Translate) => {
  const { width, height } = translation;
  moveTranslate(element, height, width);
  setTranistion(element, duration, draggableTargetTimingFunction);
};
const observeDroppedElements = (element: HTMLElement) => {
  const { siblings } = getSiblings(element);
  for (const sibling of [...siblings, element]) {
    const observer = createObserverWithCallBack(() => {
      removeTranslateWhitoutTransition(sibling);
      observer.disconnect();
    });
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }
};
const dropEventOverElement = (
  sourceIndex: number,
  targetIndex: number,
  element: HTMLElement
) => {
  if (!onDrop) {
    return;
  }

  setTimeout(() => {
    removeTempChild();
    onDrop.value(
      {
        index: sourceIndex,
      },
      {
        index: targetIndex,
      }
    );
    removeElementDraggingStyles(element);
    observeDroppedElements(element);
  }, duration);
};

const startDropEventOverElement = (
  element: HTMLElement,
  targetElement: HTMLElement,
  translation: Translate,
  sourceElementTranlation: Translate
) => {
  moveTranslate(targetElement, translation.height, translation.width);
  moveTranslate(
    element,
    sourceElementTranlation.height,
    sourceElementTranlation.width
  );
};
const removeTempChild = () => {
  if (parent.value) {
    var lastChildren = parent.value.querySelectorAll(".temp-child");
    lastChildren.forEach((lastChild) => {
      if (parent.value) {
        parent.value.removeChild(lastChild);
      }
    });
  }
};
const updateActualIndexBaseOnTranslation = (
  translation: Translate,
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
  translation: Translate
) => {
  if (!direction) {
    return { height: 0, width: 0 };
  }

  const { before, distance } = getPropByDirection(direction);
  const currentBoundingClientRect = sourceElement.getBoundingClientRect();
  const targetBoundingClientRect = targetElement.getBoundingClientRect();

  const currentPosition = currentBoundingClientRect[before];
  const currentSize = currentBoundingClientRect[distance];

  const targetPosition = targetBoundingClientRect[before];
  const targetSize = targetBoundingClientRect[distance];

  const siblingMiddle = targetPosition + targetSize / 2;

  const isTransitioned = targetElement.getAnimations().length !== 0;

  if (isTransitioned) {
    return;
  }
  const targetEndPosition = targetPosition + targetSize;
  const currentEndPosition = currentPosition + currentSize;

  const currentPositionIsInsideTarget =
    currentPosition >= targetPosition && currentPosition <= targetEndPosition;
  const currentEndPositionIsInsideTarget =
    currentEndPosition >= targetPosition &&
    currentEndPosition <= targetEndPosition;

  const newCondition =
    (currentPositionIsInsideTarget && currentPosition > siblingMiddle) ||
    (currentEndPositionIsInsideTarget && currentEndPosition > siblingMiddle) ||
    currentPosition > targetEndPosition;

  if (newCondition) {
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
    } else if (elementPosition > targetIndex) {
      return [targetIndex - 1, targetIndex];
    } else {
      return [targetIndex - 1, targetIndex + 1];
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
  event: DropEvent,
  siblings: HTMLElement[],
  elementPosition: number,
  translation: Translate
) => {
  const allSiblings = siblings.toReversed();

  allSiblings.splice(elementPosition, 0, draggedElement);

  const { previousElement, nextElement, targetIndex } =
    getPreviousAndNextElement(draggedElement, elementPosition, allSiblings);

  translation = getTranslationByDragging(
    draggedElement,
    event,
    direction,
    previousElement,
    nextElement
  );
  const childElement = childRef.value;
  if (!childElement) {
    return;
  }
  for (const [index, sibling] of siblings.toReversed().entries()) {
    let newTranslation = translation;
    if (targetIndex - 1 >= index) {
      newTranslation = { height: 0, width: 0 };
    }
    if (
      event === START_DROP_EVENT &&
      !sibling.classList.contains("temp-child")
    ) {
      const draggableTranslation = getTranslateBeforeDropping(
        direction,
        allSiblings,
        elementPosition,
        targetIndex,
        windowScroll.value,
        droppableScroll.value
      );
      startDropEventOverElement(
        childElement,
        sibling,
        newTranslation,
        draggableTranslation
      );
    }
  }
  dropEventOverElement(elementPosition, targetIndex, childElement);
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
};
const removeElementDraggingStyles = (element: HTMLElement) => {
  draggingState.value = DraggingState.NOT_DRAGGING;
  element.classList.remove("dragging");
  element.style.transform = "";
  element.style.transition = "";
  element.style.top = "";
  element.style.left = "";
  fixedHeight.value = "";
  fixedWidth.value = "";
};
const removeDraggingStyles = (element: HTMLElement) => {
  setTranistion(element, duration);
  moveTranslate(element, 0, 0);
};
const setDraggingStyles = (element: HTMLElement) => {
  const { height, width } = element.getBoundingClientRect();
  fixedHeight.value = `${height}px`;
  fixedWidth.value = `${width}px`;
  element.classList.add("dragging");
  element.style.transition = "";
};
const parent = computed(() => {
  const elementParent = childRef.value?.parentElement;
  if (elementParent) {
    return elementParent as HTMLElement;
  }
});
watch(
  childRef,
  (element) => {
    setSlotRefElementParams(element);
  },
  { deep: true }
);
watch(
  () => props.draggableId,
  (_) => {
    if (childRef.value) {
      updateDraggableId(childRef.value);
    }
  }
);

watch(
  position,
  (newPosition) => {
    const childElement = childRef.value;
    if (childElement) {
      childElement.style.top = `${newPosition.top}px`;
      childElement.style.left = `${newPosition.left}px`;
    }
  },
  { deep: true }
);
watch(
  translate,
  (newTranslate) => {
    const childElement = childRef.value;
    if (childElement) {
      childElement.style.transform = `translate( ${newTranslate.x}px, ${newTranslate.y}px)`;
    }
  },
  { deep: true }
);
</script>
<style>
.draggable {
  box-sizing: border-box !important;
  touch-action: none;
  cursor: grab;
  user-select: none;
}
.dragging {
  position: fixed;
  z-index: 5000;
  cursor: grabbing !important;
  width: v-bind(fixedWidth) !important;
  height: v-bind(fixedHeight) !important;
}
.draggable * {
  pointer-events: none;
}
.temp-child {
  box-sizing: border-box !important;
  touch-action: none;
  pointer-events: none;
}
</style>
<!-- TODO: fix Jose flashing bug -->
