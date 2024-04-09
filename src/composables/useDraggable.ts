import { IsDropEvent } from "../utils";
import {
  getGapPixels,
  getPropByDirection,
  getScroll,
  getScrollElement,
  getSiblings,
  getWindowScroll,
  hasIntersection,
} from "../utils/GetStyles";
import getTranslateBeforeDropping from "../utils/GetTranslateBeforeDropping";
import {
  AddCssStyleToElement,
  assignDraggingEvent,
  convetEventToDragMouseTouchEvent,
  moveTranslate,
  setEventWithInterval,
  setTranistion,
} from "../utils/SetStyles";
import { useTransform } from "../utils/SetTransform";
import getTranslationByDragging from "../utils/GetTranslationByDraggingAndEvent";

import {
  DragMouseTouchEvent,
  DraggableElement,
  MoveEvent,
  OnLeaveEvent,
  Translate,
} from "../../index";
import { ref, watch } from "vue";
import { Config, Direction } from ".";

const DRAGGABLE_CLASS = "draggable";
const HANDLER_CLASS = "handler-class";
const DRAGGING_HANDLER_CLASS = "dragging-handler-class";
const DROPPABLE_CLASS = "droppable";
const TEMP_CHILD_CLASS = "temp-child";
const DRAGING_CLASS = "dragging";

const DRAG_EVENT = "drag";
const START_DRAG_EVENT = "startDrag";
const START_DROP_EVENT = "startDrop";
const DROP_EVENT = "drop";

type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
type DropEvent = typeof DROP_EVENT | typeof START_DROP_EVENT;
type DragEvent = DraggingEvent | DropEvent;

enum DraggingState {
  NOT_DRAGGING,
  START_DRAGGING,
  DRAGING,
  END_DRAGGING,
}
export default function useDraggable(
  child: HTMLElement | undefined,
  index: number,
  config: Config,
  onDrop: (source: DraggableElement, destination: DraggableElement) => void,
  parent: HTMLElement
) {
  const { handlerClass = DRAGGABLE_CLASS, direction = "vertical" } = config;
  const draggingState = ref<DraggingState>(DraggingState.NOT_DRAGGING);
  const childRef = ref(child);
  const actualIndex = ref(index);
  const translate = ref({ x: 0, y: 0 });
  const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
  const windowScroll = ref({ scrollY: 0, scrollX: 0 });

  const duration = 200;

  const pagePosition = ref({ pageX: 0, pageY: 0 });
  const droppableScroll = ref({ scrollLeft: 0, scrollTop: 0 });

  const fixedWidth = ref("");
  const fixedHeight = ref("");

  const draggableTargetTimingFunction = "cubic-bezier(0.2, 0, 0, 1)";
  const { setTransform, updateTransformState } = useTransform(childRef);
  const setDraggable = () => {
    if (childRef.value) {
      childRef.value.classList.add(DRAGGABLE_CLASS);
    }
  };
  const setHandlerStyles = () => {
    if (childRef.value) {
      const handlerElement = childRef.value.querySelector(`.${handlerClass}`);
      if (handlerElement) {
        handlerElement.classList.add(HANDLER_CLASS);
      } else {
        childRef.value.classList.add(HANDLER_CLASS);
      }
    }
  };
  const setCssStyles = () => {
    AddCssStyleToElement(
      parent,
      `.${DRAGGABLE_CLASS} { touch-action: none; user-select: none; box-sizing: border-box !important; -webkit-user-select: none; }`
    );
    AddCssStyleToElement(parent, `.${HANDLER_CLASS} { cursor: grab; }`);
    setHandlerStyles();
    AddCssStyleToElement(
      parent,
      `.${DRAGGABLE_CLASS} * > :not(.${HANDLER_CLASS}) { pointer-events: none; }`
    );
    AddCssStyleToElement(
      parent,
      ".temp-child { touch-action: none; pointer-events: none; box-sizing: border-box !important; }"
    );
    AddCssStyleToElement(
      parent,
      `.droppable { position: relative; box-sizing: border-box !important; }`
    );

    AddCssStyleToElement(
      parent,
      `.dragging { position: fixed; z-index: 5000; width: var(--fixedWidth) !important; height: var(--fixedHeight) !important; }`
    );
    AddCssStyleToElement(
      parent,
      `.${DRAGGING_HANDLER_CLASS} { cursor: grabbing !important; }`
    );
    setDraggable();
  };

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
    }
    if (element?.parentElement) {
      element?.parentElement.classList.add(DROPPABLE_CLASS);
    }
  };

  const onmousemove = function (event: DragMouseTouchEvent) {
    if (draggingState.value === DraggingState.START_DRAGGING) {
      startDragging(event);
    } else if (draggingState.value === DraggingState.DRAGING) {
      setTransformEvent(event);
    }
  };
  const handlerMousemove = (event: MouseEvent | TouchEvent) => {
    const eventToDragMouse = convetEventToDragMouseTouchEvent(event);
    onmousemove(eventToDragMouse);
  };
  const onmousedown = (moveEvent: MoveEvent, onLeaveEvent: OnLeaveEvent) => {
    return () => {
      const element = childRef.value;
      droppableScroll.value = getScrollElement(parent);
      if (draggingState.value === DraggingState.NOT_DRAGGING) {
        draggingState.value = DraggingState.START_DRAGGING;
        document.addEventListener(moveEvent, handlerMousemove);
        setEventWithInterval(parent, "onscroll", setTransformDragEvent);
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
    return () => {
      onDropDraggingEvent();
      document.removeEventListener(moveEvent, handlerMousemove);
      parent.onscroll = null;
      assignDraggingEvent(element, onLeaveEvent, null);
    };
  };
  const startDragging = (event: DragMouseTouchEvent) => {
    const element = childRef.value;
    if (!element) {
      return;
    }
    updateDraggingStateBeforeDragging(element);
    addTempChild(element);
    emitEventToSiblings(element, START_DRAG_EVENT);
    updateTransformState(event, element);
    setDraggingStyles(element);
  };
  const updateDraggingStateBeforeDragging = (element: HTMLElement) => {
    scroll.value = getScroll(element.parentElement);
    windowScroll.value = getWindowScroll();
    draggingState.value = DraggingState.DRAGING;
  };
  const addTempChild = (draggedElement: HTMLElement) => {
    let distances = getTranslationByDragging(
      draggedElement,
      START_DRAG_EVENT,
      direction
    );
    var child = document.createElement("div");
    child.classList.add(TEMP_CHILD_CLASS);
    const gap = getGapPixels(parent, direction);
    const { distance } = getPropByDirection(direction);
    distances[distance] -= gap;
    child.style.height = `${distances.height}px`;
    child.style.minWidth = `${distances.width}px`;
    parent.appendChild(child);
  };
  const setTransformEvent = (event: DragMouseTouchEvent) => {
    const { pageX, pageY } = event;
    pagePosition.value = { pageX, pageY };
    setTransformDragEvent();
  };
  const setTransformDragEvent = () => {
    const element = childRef.value as HTMLElement;
    setTransform(element, parent, pagePosition, translate, direction);
    emitEventToSiblings(element, DRAG_EVENT);
  };

  const emitEventToSiblings = (
    draggedElement: HTMLElement,
    event: DragEvent
  ) => {
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
      if (!sibling.classList.contains(DRAGGABLE_CLASS)) {
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
  const dragEventOverElement = (
    element: HTMLElement,
    translation: Translate
  ) => {
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
    setTimeout(() => {
      removeTempChild();
      onDrop(
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
    var lastChildren = parent.querySelectorAll(`.${TEMP_CHILD_CLASS}`);
    lastChildren.forEach((lastChild) => {
      parent.removeChild(lastChild);
    });
  };
  const updateActualIndexBaseOnTranslation = (
    translation: Translate,
    siblingIndex: number
  ) => {
    const { distance } = getPropByDirection(direction);
    if (translation[distance] == 0) {
      actualIndex.value = Math.max(actualIndex.value, siblingIndex);
    } else {
      actualIndex.value = Math.min(actualIndex.value, siblingIndex - 1);
    }
  };
  const canChangeDraggable = (
    direction: Direction,
    sourceElement: HTMLElement,
    targetElement: HTMLElement,
    translation: Translate
  ) => {
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
      (currentEndPositionIsInsideTarget &&
        currentEndPosition > siblingMiddle) ||
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
        !sibling.classList.contains(TEMP_CHILD_CLASS)
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
  const onDropDraggingEvent = () => {
    if (draggingState.value !== DraggingState.DRAGING) {
      draggingState.value = DraggingState.NOT_DRAGGING;
      return;
    }
    draggingState.value = DraggingState.END_DRAGGING;
    const element = childRef.value as HTMLElement;
    if (!element) {
      return;
    }
    removeDraggingStyles(element);
    emitEventToSiblings(element, START_DROP_EVENT);
  };
  const toogleHandlerDraggingClass = (force: boolean) => {
    if (!childRef.value) {
      return;
    }
    const handlerElement = childRef.value.querySelector(`.${handlerClass}`);
    if (handlerElement) {
      handlerElement.classList.toggle(DRAGGING_HANDLER_CLASS, force);
    } else {
      childRef.value.classList.toggle(DRAGGING_HANDLER_CLASS, force);
    }
  };
  const toggleDraggingClass = (element: Element, force: boolean) => {
    element.classList.toggle(DRAGING_CLASS, force);
    toogleHandlerDraggingClass(force);
  };
  const removeElementDraggingStyles = (element: HTMLElement) => {
    draggingState.value = DraggingState.NOT_DRAGGING;
    toggleDraggingClass(element, false);
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
    toggleDraggingClass(element, true);
    element.style.transition = "";
  };
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
  watch(fixedWidth, (newFixedWidth) => {
    const childElement = childRef.value;
    if (childElement) {
      childElement.style.setProperty("--fixedWidth", newFixedWidth);
    }
  });
  watch(fixedHeight, (newFixedHeight) => {
    const childElement = childRef.value;
    if (childElement) {
      childElement.style.setProperty("--fixedHeight", newFixedHeight);
    }
  });
  setCssStyles();
  setSlotRefElementParams(childRef.value);
}
// TODO: add handler class
// TODO: drag between groups https://javascript.info/mouse-drag-and-drop
