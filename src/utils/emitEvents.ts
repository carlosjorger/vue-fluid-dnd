import { Ref, ref } from "vue";
import {
  draggableIsOutside,
  getPropByDirection,
  getSiblings,
  getTransform,
  getWindowScroll,
} from "./GetStyles";
import { Translate, WindowScroll } from "../../index";
import { moveTranslate, setTranistion } from "./SetStyles";
import { CoreConfig, Direction, OnInsertEvent } from "../composables";
import getTranslationByDragging from "./GetTranslationByDraggingAndEvent";
import getTranslateBeforeDropping from "./GetTranslateBeforeDropping";
import { DraggingState, IsDropEvent } from ".";
import { createObserverWithCallBack } from "./observer";
import { DroppableConfig } from "../composables/configHandler";

const DRAGGING_HANDLER_CLASS = "dragging-handler-class";
const DRAGING_CLASS = "dragging";
const DRAGGABLE_CLASS = "draggable";
const TEMP_CHILD_CLASS = "temp-child";
const START_DROP_EVENT = "startDrop";
const DRAG_EVENT = "drag";
const START_DRAG_EVENT = "startDrag";
const draggableTargetTimingFunction = "cubic-bezier(0.2, 0, 0, 1)";

type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
type DragAndDropEvent = DraggingEvent | DropEvent;
type DropEvent = "drop" | typeof START_DROP_EVENT;

export default function useEmitEvents<T>(
  currentConfig: CoreConfig<T>,
  draggingState: Ref<DraggingState>,
  fixedHeight: Ref<string>,
  fixedWidth: Ref<string>,
  index: number,
  parent: HTMLElement
) {
  const actualIndex = ref(index);
  const { direction, handlerSelector, onRemoveAtEvent, animationDuration } =
    currentConfig;
  const emitEventToSiblings = (
    draggedElement: HTMLElement,
    event: DragAndDropEvent,
    initialWindowScroll: WindowScroll,
    droppableConfig: DroppableConfig<T> | undefined,
    positionOnSourceDroppable?: number
  ) => {
    if (!droppableConfig) {
      return;
    }
    const { droppable, config } = droppableConfig;
    const tranlation = getTranslationByDragging(
      draggedElement,
      event,
      config.direction,
      droppable
    );
    const dropping = IsDropEvent(event);
    if (!dropping) {
      emitDraggingEventToSiblings(
        draggedElement,
        event,
        tranlation,
        droppableConfig
      );
    } else {
      emitDroppingEventToSiblings(
        draggedElement,
        event,
        tranlation,
        initialWindowScroll,
        droppableConfig,
        positionOnSourceDroppable
      );
    }
  };
  // #region Drag events
  const emitDraggingEventToSiblings = (
    draggedElement: HTMLElement,
    event: DraggingEvent,
    translation: Translate,
    droppableConfig: DroppableConfig<T>
  ) => {
    const { config, droppable } = droppableConfig;
    const { siblings } = getSiblings(draggedElement, droppable);
    const isOutside = draggableIsOutside(draggedElement, droppable);

    const itemsCount = siblings.filter((sibling) =>
      sibling.classList.contains("draggable")
    ).length;

    for (const [index, sibling] of siblings.entries()) {
      if (!sibling.classList.contains(DRAGGABLE_CLASS)) {
        continue;
      }
      if (!isOutside) {
        const siblingTransition = canChangeDraggable(
          config.direction,
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
      updateActualIndexBaseOnTranslation(
        translation,
        siblingRealIndex,
        itemsCount,
        config.direction
      );
      if (event === START_DRAG_EVENT) {
        startDragEventOverElement(sibling, translation);
      } else if (event === DRAG_EVENT) {
        dragEventOverElement(sibling, translation);
      }
    }
  };
  const canChangeDraggable = (
    direction: Direction,
    sourceElement: HTMLElement,
    targetElement: HTMLElement,
    translation: Translate
  ) => {
    const { before, distance, axis } = getPropByDirection(direction);
    const currentBoundingClientRect = sourceElement.getBoundingClientRect();
    const targetBoundingClientRect = targetElement.getBoundingClientRect();

    const currentPosition = currentBoundingClientRect[before];

    const targetPosition = targetBoundingClientRect[before];
    const targetSize = targetBoundingClientRect[distance];

    const targetMiddle = targetPosition + targetSize / 2;

    const isTransitioned = targetElement.getAnimations().length !== 0;

    if (isTransitioned) {
      return;
    }
    const targetTransform = getTransform(targetElement)[axis];
    const targetMiddleWithoutTransform = targetMiddle - targetTransform;

    if (currentPosition > targetMiddleWithoutTransform) {
      return { height: 0, width: 0 };
    }
    return translation;
  };
  const updateActualIndexBaseOnTranslation = (
    translation: Translate,
    siblingIndex: number,
    itemsCount: number,
    direction: Direction
  ) => {
    const { distance } = getPropByDirection(direction);
    if (translation[distance] == 0) {
      actualIndex.value = Math.max(actualIndex.value, siblingIndex);
    } else {
      actualIndex.value = Math.min(actualIndex.value, siblingIndex - 1);
    }
    actualIndex.value = Math.min(actualIndex.value, itemsCount);
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
    setTranistion(element, animationDuration, draggableTargetTimingFunction);
  };
  // #region Drop events
  const emitDroppingEventToSiblings = (
    draggedElement: HTMLElement,
    event: DropEvent,
    translation: Translate,
    initialWindowScroll: WindowScroll,
    droppableConfig: DroppableConfig<T>,
    positionOnSourceDroppable?: number
  ) => {
    const { droppable, droppableScroll, config } = droppableConfig;
    const { siblings, positionOnDroppable } = getSiblings(
      draggedElement,
      droppable
    );
    const allSiblings = siblings.toReversed();
    allSiblings.splice(positionOnDroppable, 0, draggedElement);

    const { previousElement, nextElement, targetIndex } =
      getPreviousAndNextElement(
        draggedElement,
        positionOnDroppable,
        allSiblings,
        droppable
      );
    translation = getTranslationByDragging(
      draggedElement,
      event,
      config.direction,
      parent,
      previousElement,
      nextElement
    );
    const windowScroll = getWindowScroll();
    const draggableTranslation = getTranslateBeforeDropping(
      config.direction,
      allSiblings,
      positionOnDroppable,
      targetIndex,
      windowScroll,
      droppableScroll,
      initialWindowScroll,
      droppable,
      draggedElement
    );
    for (const [index, sibling] of siblings.toReversed().entries()) {
      let newTranslation = translation;
      if (targetIndex - 1 >= index) {
        newTranslation = { height: 0, width: 0 };
      }
      if (
        event === START_DROP_EVENT &&
        !sibling.classList.contains(TEMP_CHILD_CLASS)
      ) {
        startDropEventOverElement(
          sibling,
          newTranslation,
          draggedElement,
          draggableTranslation
        );
      }
    }
    dropEventOverElement(
      targetIndex,
      draggedElement,
      config.onInsertEvent,
      droppable,
      positionOnSourceDroppable
    );
  };
  const getPreviousAndNextElement = (
    draggedElement: HTMLElement,
    elementPosition: number,
    allSiblings: HTMLElement[],
    droppable: HTMLElement
  ) => {
    const isOutside = draggableIsOutside(draggedElement, droppable);

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
  const startDropEventOverElement = (
    targetElement: HTMLElement,
    translation: Translate,
    element: HTMLElement,
    sourceElementTranlation: Translate
  ) => {
    moveTranslate(targetElement, translation.height, translation.width);
    moveTranslate(
      element,
      sourceElementTranlation.height,
      sourceElementTranlation.width
    );
  };
  const dropEventOverElement = (
    targetIndex: number,
    element: HTMLElement,
    onInsertEvent: OnInsertEvent<T>,
    droppable: HTMLElement,
    positionOnSourceDroppable?: number
  ) => {
    reduceTempchildSize(droppable);
    setTimeout(() => {
      removeTempChild(parent);
      removeTempChild(droppable);
      if (positionOnSourceDroppable != undefined) {
        const value = onRemoveAtEvent(positionOnSourceDroppable);
        if (value) {
          onInsertEvent(targetIndex, value);
        }
      }
      removeElementDraggingStyles(element);
      observeDroppedElements(element, parent);
      observeDroppedElements(element, droppable);
    }, animationDuration);
  };
  const reduceTempchildSize = (droppable: HTMLElement) => {
    if (parent.isSameNode(droppable)) {
      return;
    }
    var [lastChildren] = parent.querySelectorAll(`.${TEMP_CHILD_CLASS}`);
    if (!lastChildren) {
      return;
    }
    const { distance } = getPropByDirection(direction);
    const lastChildrenHTMLElement = lastChildren as HTMLElement;
    lastChildrenHTMLElement.style[distance] = "0px";
  };
  const removeTempChild = (parent: HTMLElement) => {
    var lastChildren = parent.querySelectorAll(`.${TEMP_CHILD_CLASS}`);
    lastChildren.forEach((lastChild) => {
      parent.removeChild(lastChild);
    });
  };
  const observeDroppedElements = (
    element: HTMLElement,
    parent: HTMLElement
  ) => {
    const { siblings } = getSiblings(element, parent);
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

  const removeTranslateWhitoutTransition = (element?: HTMLElement) => {
    if (element) {
      element.style.transition = "";
      element.style.transform = "";
    }
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
  const toogleHandlerDraggingClass = (force: boolean, element: Element) => {
    const handlerElement = element.querySelector(handlerSelector);
    if (handlerElement) {
      handlerElement.classList.toggle(DRAGGING_HANDLER_CLASS, force);
    } else {
      element.classList.toggle(DRAGGING_HANDLER_CLASS, force);
    }
  };
  const toggleDraggingClass = (element: Element, force: boolean) => {
    element.classList.toggle(DRAGING_CLASS, force);
    toogleHandlerDraggingClass(force, element);
  };
  return { emitEventToSiblings, toggleDraggingClass };
}
