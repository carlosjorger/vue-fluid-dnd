import { draggableIsOutside, getScroll } from "../utils/GetStyles";
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
import { IsHTMLElement, isTouchEvent } from "../utils/touchDevice";
import { addTempChild, removeTempChildrens } from "../utils/tempChildren";

const DRAGGABLE_CLASS = "draggable";
const HANDLER_CLASS = "handler-class";
const DRAGGING_HANDLER_CLASS = "dragging-handler-class";
const DROPPABLE_CLASS = "droppable";

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
  const { handlerSelector, isDraggable, droppableGroup, animationDuration } =
    config;
  const droppableGroupClass = droppableGroup
    ? `droppable-group-${droppableGroup}`
    : null;
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
  const currentDroppableConfig = ref<DroppableConfig<T>>();
  const delayTimeout = ref<NodeJS.Timeout>();
  const { setTransform, updateTransformState } = useTransform(childRef);
  const { emitEventToSiblings, toggleDraggingClass } = useEmitEvents<T>(
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
    AddCssStylesToElement(parent, [
      `.${DRAGGABLE_CLASS} { touch-action: manipulation; user-select: none; box-sizing: border-box !important; -webkit-user-select: none; }`,
      `.${HANDLER_CLASS} { cursor: grab; pointer-events: auto !important; }`,
      `.${DRAGGABLE_CLASS} * { pointer-events: none; }`,
      ".temp-child { touch-action: none; pointer-events: none; box-sizing: border-box !important; }",
      `.droppable { box-sizing: border-box !important; }`,
      `.dragging { position: fixed; z-index: 5000; width: var(--fixedWidth) !important; height: var(--fixedHeight) !important; }`,
      `.${DRAGGING_HANDLER_CLASS} { cursor: grabbing; cursor: grabbing; }`,
    ]);
    setHandlerStyles();
    setDraggable();
    setDroppableGroupClass();
  };
  const setDroppableGroupClass = () => {
    if (droppableGroupClass) {
      parent.classList.add(droppableGroupClass);
    }
  };

  const setSlotRefElementParams = (element: HTMLElement | undefined) => {
    const handlerElement =
      element?.querySelector(`.${HANDLER_CLASS}`) ?? element;
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
    }
    parent.classList.add(DROPPABLE_CLASS);
  };

  const onmousemove = function (event: DragMouseTouchEvent) {
    currentDroppableConfig.value = getCurrentConfig(event);
    if (draggingState.value === DraggingState.START_DRAGGING) {
      addTempChild(parent, childRef.value, parent, config);
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
    const { droppable, config } = currentDroppableConfig.value;
    removeTempChildrens(
      droppable,
      parent,
      droppableGroupClass,
      animationDuration
    );
    addTempChild(droppable, childRef.value, parent, config);
  };

  const getDraggableAncestor = (
    clientX: number,
    clientY: number,
    draggable: Element | null
  ) => {
    return document
      .elementsFromPoint(clientX, clientY)
      .filter((element) => !element.isSameNode(draggable));
  };
  const getCurrentDroppable = (
    currentElement: HTMLElement,
    event: DragMouseTouchEvent
  ) => {
    currentElement.hidden = true;
    const [elementBelow] = getDraggableAncestor(
      event.clientX,
      event.clientY,
      currentElement
    );
    currentElement.hidden = false;
    if (!droppableGroupClass || !elementBelow) {
      return;
    }
    const currentDroppable = elementBelow.closest(`.${droppableGroupClass}`);
    return currentDroppable;
  };
  const isOutsideOfAllDroppables = (currentElement: HTMLElement) => {
    const droppables = Array.from(
      document.querySelectorAll(`.${droppableGroupClass}`)
    );
    return droppables.every((droppable) =>
      draggableIsOutside(currentElement, droppable)
    );
  };
  const isNotInsideAnotherDroppable = (
    currentElement: HTMLElement,
    droppable: HTMLElement
  ) => {
    const isOutside = draggableIsOutside(currentElement, droppable);
    return !isOutside || isOutsideOfAllDroppables(currentElement);
  };
  const getCurrentConfig = (event: DragMouseTouchEvent) => {
    const currentElement = childRef.value;
    if (!currentElement) {
      return;
    }
    if (currentDroppableConfig.value) {
      if (
        isNotInsideAnotherDroppable(
          currentElement,
          currentDroppableConfig.value?.droppable
        )
      ) {
        return currentDroppableConfig.value;
      }
    }

    const currentDroppable = getCurrentDroppable(currentElement, event);
    if (!currentDroppable) {
      return ConfigHandler.getConfig(parent);
    }
    if (IsHTMLElement(currentDroppable) && !currentDroppable.onscroll) {
      makeScrollEventOnDroppable(currentDroppable);
    }
    return ConfigHandler.getConfig(currentDroppable);
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
  const onLeave = (moveEvent: MoveEvent) => {
    return (event: MouseEvent | TouchEvent) => {
      const convertedEvent = convetEventToDragMouseTouchEvent(event);
      clearTimeout(delayTimeout.value);
      onDropDraggingEvent();
      document.removeEventListener(moveEvent, handlerMousemove);
      const currentConfig = getCurrentConfig(convertedEvent);
      if (currentConfig) {
        const { droppable } = currentConfig;
        droppable.onscroll = null;
      }
      parent.onscroll = null;
    };
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

  const createWatchOfFixedSize = (
    fixedSize: Ref<string>,
    fixedProp: string
  ) => {
    watch(fixedSize, (newFixedSize) => {
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
  watch(currentDroppableConfig, changeDroppable, { deep: true });
  createWatchOfFixedSize(fixedWidth, "--fixedWidth");
  createWatchOfFixedSize(fixedHeight, "--fixedHeight");

  setCssStyles();
  setSlotRefElementParams(childRef.value);
}

// TODO: use semantic-realese https://medium.comr/@davidkelley87/using-semantic-release-for-npm-libraries-with-github-actions-234461235fa7
// TODO: refactor code and gzip
// TODO: organize utils
// TODO: set touch-event: none while dragging

// Bugs
// TODO: fix handler with hadler class on svg
