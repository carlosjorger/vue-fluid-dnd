import { getScroll } from "../utils/GetStyles";
import {
  AddCssStylesToElement,
  assignDraggingEvent,
  convetEventToDragMouseTouchEvent,
  moveTranslate,
  setEventWithInterval,
  setTranistion,
} from "../utils/SetStyles";
import { useTransform } from "../utils/SetTransform";
import { DragMouseTouchEvent, MoveEvent, OnLeaveEvent } from "../../index";
import { Ref, ref, watch } from "vue";
import { CoreConfig } from ".";
import useEmitEvents from "../utils/events/emitEvents";
import { DraggingState } from "../utils";
import ConfigHandler, { DroppableConfig } from "./configHandler";
import { isTouchEvent } from "../utils/touchDevice";
import { addTempChild, removeTempChildrens } from "../utils/tempChildren";
import { useConfig } from "../utils/useConfig";
import {
  addMultipleClasses,
  getClassesList,
  getClassesSelector,
} from "../utils/dom/classList";
const DRAGGABLE_CLASS = "draggable";
const HANDLER_CLASS = "handler-class";
const DRAGGING_HANDLER_CLASS = "dragging-handler-class";
const DROPPABLE_CLASS = "droppable";
const DROPPING_CLASS = "dropping";
const DRAG_EVENT = "drag";
const START_DRAG_EVENT = "startDrag";
const START_DROP_EVENT = "startDrop";
const draggableTargetTimingFunction = "cubic-bezier(0.2, 0, 0, 1)";

export default function useDraggable<T>(
  child: HTMLElement | undefined,
  index: number,
  config: CoreConfig<T>,
  parent: HTMLElement
) {
  const {
    handlerSelector,
    isDraggable,
    droppableGroup,
    animationDuration,
    delayBeforeRemove,
    draggingClass,
    removingClass,
    onRemoveAtEvent,
  } = config;
  const droppableGroupClass = getClassesList(droppableGroup)
    .map((classGroup) => `droppable-group-${classGroup}`)
    .join(" ");
  const draggingState = ref<DraggingState>(DraggingState.NOT_DRAGGING);
  const childRef = ref(child);
  const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
  const windowScroll = ref({
    scrollX: 0,
    scrollY: 0,
  });
  const pagePosition = ref({ pageX: 0, pageY: 0 });

  const fixedWidth = ref("");
  const fixedHeight = ref("");

  const delayTimeout = ref<NodeJS.Timeout>();
  const { setTransform, updateTransformState } = useTransform(
    childRef,
    draggingClass
  );
  const {
    emitEventToSiblings,
    emitRemoveEventToSiblings,
    emitFinishRemoveEventToSiblings,
    toggleDraggingClass,
  } = useEmitEvents<T>(
    config,
    draggingState,
    fixedHeight,
    fixedWidth,
    index,
    parent
  );
  const setDraggable = () => {
    if (childRef.value) {
      childRef.value.classList.add(DRAGGABLE_CLASS);
    }
  };
  const setHandlerStyles = () => {
    if (childRef.value && isDraggable(childRef.value)) {
      const handlerElement = childRef.value.querySelector(handlerSelector);
      if (handlerElement) {
        handlerElement.classList.add(HANDLER_CLASS);
      } else {
        childRef.value.classList.add(HANDLER_CLASS);
      }
    }
  };
  const setCssStyles = () => {
    AddCssStylesToElement(document, [
      `.${DRAGGABLE_CLASS} { touch-action: manipulation; user-select: none; box-sizing: border-box !important; -webkit-user-select: none; }`,
      `.${HANDLER_CLASS} { cursor: grab; pointer-events: auto !important; }`,
      ".temp-child { touch-action: none; pointer-events: none; box-sizing: border-box !important; }",
      `.droppable { box-sizing: border-box !important; }`,
      `.${draggingClass} { position: fixed; z-index: 5000; width: var(--fixedWidth) !important; height: var(--fixedHeight) !important; }`,
      `.${DRAGGING_HANDLER_CLASS} { cursor: grabbing; cursor: grabbing; }`,
      `.${DROPPING_CLASS} { pointer-events: none !important; }`,
    ]);
    setHandlerStyles();
    setDraggable();
    setDroppableGroupClass();
  };
  const setDroppableGroupClass = () => {
    if (droppableGroupClass) {
      addMultipleClasses(parent, droppableGroupClass);
    }
  };

  const setSlotRefElementParams = (element: HTMLElement | undefined) => {
    const handlerElement = (element?.querySelector(`.${HANDLER_CLASS}`) ??
      element) as HTMLElement;
    if (handlerElement && element && isDraggable(element)) {
      assignDraggingEvent(
        handlerElement,
        "onmousedown",
        onmousedown("mousemove", "mouseup")
      );
      assignDraggingEvent(
        handlerElement,
        "ontouchstart",
        onmousedown("touchmove", "touchend")
      );
      disableMousedownEventFromImages(handlerElement);
    }
    if (element && !element?.isSameNode(handlerElement)) {
      assignDraggingEvent(element, "onmousedown", mousedownOnDraggablefunction);
    }
    parent.classList.add(DROPPABLE_CLASS);
  };
  function disableMousedownEventFromImages(handlerElement: Element) {
    // Avoid dragging inner images
    const images = handlerElement.querySelectorAll("img");
    Array.from(images).forEach((image) => {
      image.onmousedown = () => false;
    });
  }
  const setTransformDragEvent = () => {
    const element = childRef.value as HTMLElement;
    if (pagePosition.value.pageX == 0 && pagePosition.value.pageY == 0) {
      return;
    }
    if (!currentDroppableConfig.value) {
      return;
    }
    const { droppable, config } = currentDroppableConfig.value;
    setTransform(element, droppable, pagePosition, config.direction);
    emitEventToSiblings(
      element,
      DRAG_EVENT,
      windowScroll.value,
      currentDroppableConfig.value
    );
  };
  const { updateConfig, currentDroppableConfig, getCurrentConfig } =
    useConfig<T>(childRef, droppableGroupClass, parent, setTransformDragEvent);
  const onmousemove = function (event: DragMouseTouchEvent) {
    updateConfig(event);
    if (draggingState.value === DraggingState.START_DRAGGING) {
      addTempChild(
        childRef.value,
        parent,
        draggingState.value,
        currentDroppableConfig.value
      );
      startDragging(event);
    } else if (draggingState.value === DraggingState.DRAGING) {
      updateTempChildren();
      setTransformEvent(event);
    }
  };

  const updateTempChildren = () => {
    if (!currentDroppableConfig.value) {
      return;
    }
    const { droppable } = currentDroppableConfig.value;
    removeTempChildrens(
      droppable,
      parent,
      droppableGroupClass,
      animationDuration
    );
    addTempChild(
      childRef.value,
      parent,
      draggingState.value,
      currentDroppableConfig.value
    );
  };
  const handlerMousemove = (event: MouseEvent | TouchEvent) => {
    if (isTouchEvent(event) && event.cancelable) {
      event.preventDefault();
    } else if (isTouchEvent(event)) {
      return;
    }
    const eventToDragMouse = convetEventToDragMouseTouchEvent(event);
    onmousemove(eventToDragMouse);
  };
  const addTouchDeviceDelay = (event: MoveEvent, callback: () => void) => {
    if (event == "touchmove") {
      delayTimeout.value = setTimeout(() => {
        callback();
      }, 200);
    } else {
      callback();
    }
  };
  const onmousedown = (moveEvent: MoveEvent, onLeaveEvent: OnLeaveEvent) => {
    return () => {
      const element = childRef.value;
      ConfigHandler.updateScrolls(parent, droppableGroupClass);
      const { scrollX, scrollY } = window;
      windowScroll.value = { scrollX, scrollY };
      if (draggingState.value === DraggingState.NOT_DRAGGING) {
        draggingState.value = DraggingState.START_DRAGGING;
        addTouchDeviceDelay(moveEvent, () => {
          document.addEventListener(moveEvent, handlerMousemove, {
            passive: false,
          });
        });
        makeScrollEventOnDroppable(parent);
        if (element) {
          document.addEventListener(onLeaveEvent, onLeave(moveEvent), {
            once: true,
          });
        }
      }
    };
  };
  function mousedownOnDraggablefunction(event: DragMouseTouchEvent) {
    updateConfig(event);
  }
  const onLeave = (moveEvent: MoveEvent) => {
    return (event: MouseEvent | TouchEvent) => {
      const convertedEvent = convetEventToDragMouseTouchEvent(event);
      clearTimeout(delayTimeout.value);
      onDropDraggingEvent();
      document.removeEventListener(moveEvent, handlerMousemove);
      updateConfig(convertedEvent);
      const currentConfig = getCurrentConfig(convertedEvent);
      if (currentConfig) {
        const { droppable } = currentConfig;
        removeOnScrollEvents(droppable);
      }
      parent.onscroll = null;
    };
  };
  const removeOnScrollEvents = (droppable: HTMLElement) => {
    droppable.onscroll = null;
    if (!droppableGroupClass) {
      return;
    }
    const droppables = Array.from(
      document.querySelectorAll(getClassesSelector(droppableGroupClass))
    );
    for (const droppable of droppables) {
      if (droppable instanceof HTMLElement) {
        droppable.onscroll = null;
      }
    }
  };
  const startDragging = (event: DragMouseTouchEvent) => {
    const element = childRef.value;
    if (!element) {
      return;
    }
    updateDraggingStateBeforeDragging();
    emitEventToSiblings(
      element,
      START_DRAG_EVENT,
      windowScroll.value,
      currentDroppableConfig.value
    );
    updateTransformState(event, element);
    setDraggingStyles(element);
  };
  const updateDraggingStateBeforeDragging = () => {
    scroll.value = getScroll(parent);
    draggingState.value = DraggingState.DRAGING;
  };
  const setTransformEvent = (event: DragMouseTouchEvent) => {
    const { pageX, pageY } = event;
    pagePosition.value = { pageX, pageY };
    setTransformDragEvent();
  };
  const makeScrollEventOnDroppable = (droppable: Element) => {
    setEventWithInterval(droppable, "onscroll", onScrollEvent);
  };
  const onScrollEvent = () => {
    setTransformDragEvent();
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
    emitEventToSiblings(
      element,
      START_DROP_EVENT,
      windowScroll.value,
      currentDroppableConfig.value,
      index
    );
  };
  const removeDraggingStyles = (element: Element) => {
    setTranistion(element, animationDuration, draggableTargetTimingFunction);
    moveTranslate(element, 0, 0);
  };
  const setDraggingStyles = (element: HTMLElement) => {
    const { height, width } = element.getBoundingClientRect();
    fixedHeight.value = `${height}px`;
    fixedWidth.value = `${width}px`;
    toggleDraggingClass(element, true);
    element.style.transition = "";
  };

  const createWatchOfStyle = (fixedSize: Ref<string>, fixedProp: string) => {
    watch(fixedSize, (newFixedSize: string) => {
      const childElement = childRef.value;
      if (childElement) {
        childElement.style.setProperty(fixedProp, newFixedSize);
      }
    });
  };
  const changeDroppable = (
    newdDroppableConfig: DroppableConfig<T> | undefined,
    oldDroppableConfig: DroppableConfig<T> | undefined
  ) => {
    if (
      childRef.value &&
      oldDroppableConfig &&
      draggingState.value == DraggingState.DRAGING &&
      !newdDroppableConfig?.droppable.isSameNode(oldDroppableConfig.droppable)
    ) {
      emitEventToSiblings(
        childRef.value,
        DRAG_EVENT,
        windowScroll.value,
        oldDroppableConfig
      );
    }
  };

  function removeAtFromElement(targetIndex: number) {
    const element = childRef.value as HTMLElement;
    if (!currentDroppableConfig.value) {
      return;
    }
    const config = currentDroppableConfig.value as DroppableConfig<T>;

    if (targetIndex == index && child) {
      element.classList.add(removingClass);
      setTimeout(() => {
        onRemoveAtEvent(index);
        element.classList.remove(removingClass);
        addTempChild(
          element,
          parent,
          draggingState.value,
          currentDroppableConfig.value
        );
        emitRemoveEventToSiblings(
          targetIndex,
          element,
          config,
          (sibling: HTMLElement) => {
            removeDraggingStyles(sibling);
            emitFinishRemoveEventToSiblings(element);
          }
        );
      }, delayBeforeRemove);
    }
  }
  watch(currentDroppableConfig, changeDroppable, { deep: true });
  createWatchOfStyle(fixedWidth, "--fixedWidth");
  createWatchOfStyle(fixedHeight, "--fixedHeight");
  setCssStyles();
  setSlotRefElementParams(childRef.value);
  return { removeAtFromElement };
}

// TODO: use semantic-realese https://medium.comr/@davidkelley87/using-semantic-release-for-npm-libraries-with-github-actions-234461235fa7
//https://github.com/iamstevendao/vue-tel-input/blob/main/.github/workflows/deploy.yml
