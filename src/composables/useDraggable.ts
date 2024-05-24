import {
  draggableIsOutside,
  getGapPixels,
  getPropByDirection,
  getScroll,
  getScrollElement,
} from "../utils/GetStyles";
import {
  AddCssStylesToElement,
  assignDraggingEvent,
  convetEventToDragMouseTouchEvent,
  moveTranslate,
  setEventWithInterval,
  setTranistion,
} from "../utils/SetStyles";
import { useTransform } from "../utils/SetTransform";
import getTranslationByDragging from "../utils/GetTranslationByDraggingAndEvent";

import { DragMouseTouchEvent, MoveEvent, OnLeaveEvent } from "../../index";
import { Ref, ref, watch } from "vue";
import { CoreConfig, Direction } from ".";
import useEmitEvents from "../utils/emitEvents";
import { DraggingState } from "../utils";
import ConfigHandler, { DroppableConfig } from "./configHandler";

const DRAGGABLE_CLASS = "draggable";
const HANDLER_CLASS = "handler-class";
const DRAGGING_HANDLER_CLASS = "dragging-handler-class";
const DROPPABLE_CLASS = "droppable";
const TEMP_CHILD_CLASS = "temp-child";

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
  const { handlerSelector, direction, isDraggable, droppableGroup } = config;
  const droppableGroupClass = droppableGroup
    ? `droppable-group-${droppableGroup}`
    : null;
  const draggingState = ref<DraggingState>(DraggingState.NOT_DRAGGING);
  const childRef = ref(child);
  const translate = ref({ x: 0, y: 0 });
  const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
  const windowScroll = ref({
    scrollX: 0,
    scrollY: 0,
  });
  const duration = 200;

  const pagePosition = ref({ pageX: 0, pageY: 0 });

  const fixedWidth = ref("");
  const fixedHeight = ref("");
  const droppableScroll = ref({ scrollLeft: 0, scrollTop: 0 });
  const currentDroppableConfig = ref<DroppableConfig<T>>();
  const delayTimeout = ref<NodeJS.Timeout>();
  const { setTransform, updateTransformState } = useTransform(childRef);
  const { emitEventToSiblings, toggleDraggingClass } = useEmitEvents<T>(
    config,
    childRef,
    draggingState,
    fixedHeight,
    fixedWidth,
    index,
    duration,
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
      `.droppable { position: relative; box-sizing: border-box !important; }`,
      `.dragging { position: fixed; z-index: 5000; width: var(--fixedWidth) !important; height: var(--fixedHeight) !important; }`,
      `.${DRAGGING_HANDLER_CLASS} { cursor: grabbing !important; }`,
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
      (element?.querySelector(`.${HANDLER_CLASS}`) as HTMLElement) ?? element;
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
      addTempChild(parent, direction);
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
    const { direction } = config;
    removeTempChildrens();
    addTempChild(droppable, direction);
  };
  const removeTempChildrens = () => {
    if (!droppableGroupClass) {
      return;
    }
    var children = document.querySelectorAll(
      `.${droppableGroupClass} .${TEMP_CHILD_CLASS}`
    );
    children.forEach((tempChild) => {
      if (tempChild.parentElement?.isSameNode(parent)) {
        return;
      }
      tempChild.parentElement?.removeChild(tempChild);
    });
  };
  const getCurrentConfig = (event: {
    readonly clientX: number;
    readonly clientY: number;
  }) => {
    const currentElement = childRef.value;
    if (!currentElement) {
      return;
    }
    if (currentDroppableConfig.value) {
      const isOutside = draggableIsOutside(
        currentElement,
        currentDroppableConfig.value?.droppable
      );
      if (!isOutside) {
        return currentDroppableConfig.value;
      }
    }

    currentElement.hidden = true;
    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    currentElement.hidden = false;

    if (!droppableGroupClass || !elementBelow) {
      return ConfigHandler.getConfig(parent);
    }
    const currentDroppable = elementBelow.closest(
      `.${droppableGroupClass}`
    ) as HTMLElement;
    if (!currentDroppable) {
      return ConfigHandler.getConfig(parent);
    }
    if (!currentDroppable.onscroll) {
      makeScrollEventOnDroppable(currentDroppable);
    }
    return ConfigHandler.getConfig(currentDroppable);
  };
  const handlerMousemove = (event: MouseEvent | TouchEvent) => {
    if (event instanceof TouchEvent) {
      event.preventDefault();
    }
    const eventToDragMouse = convetEventToDragMouseTouchEvent(event);
    onmousemove(eventToDragMouse);
  };
  const addTouchDeviceDelay = (event: MoveEvent, callback: () => void) => {
    if (event == "touchmove") {
      delayTimeout.value = setTimeout(() => {
        callback();
      }, 300);
    } else {
      callback();
    }
  };
  const onmousedown = (moveEvent: MoveEvent, onLeaveEvent: OnLeaveEvent) => {
    return () => {
      const element = childRef.value;
      droppableScroll.value = getScrollElement(parent);
      ConfigHandler.updateScrolls(parent, droppableGroupClass);
      const { scrollX, scrollY } = window;
      windowScroll.value = { scrollX, scrollY };
      if (draggingState.value === DraggingState.NOT_DRAGGING) {
        draggingState.value = DraggingState.START_DRAGGING;
        // TODO: dont launch this events if its scrolling
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
    return () => {
      clearTimeout(delayTimeout.value);
      onDropDraggingEvent();
      document.removeEventListener(moveEvent, handlerMousemove);
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
  const addTempChild = (droppable: HTMLElement, direction: Direction) => {
    const draggedElement = childRef.value;
    if (droppable.querySelector(`.${TEMP_CHILD_CLASS}`) || !draggedElement) {
      return;
    }
    let distances = getTranslationByDragging(
      draggedElement,
      START_DRAG_EVENT,
      direction,
      droppable
    );
    var child = document.createElement("div");
    child.classList.add(TEMP_CHILD_CLASS);
    const gap = getGapPixels(droppable, direction);
    const { distance } = getPropByDirection(direction);
    distances[distance] -= gap;
    child.style.height = `${distances.height}px`;
    child.style.minWidth = `${distances.width}px`;
    setTranistion(
      child,
      duration,
      draggableTargetTimingFunction,
      "height, width"
    );

    droppable.appendChild(child);
  };
  const setTransformEvent = (event: DragMouseTouchEvent) => {
    const { pageX, pageY } = event;
    pagePosition.value = { pageX, pageY };
    setTransformDragEvent();
  };
  const makeScrollEventOnDroppable = (droppable: HTMLElement) => {
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
    setTransform(element, droppable, pagePosition, translate, config.direction);
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
      draggingState.value == DraggingState.DRAGING
    ) {
      if (
        !newdDroppableConfig?.droppable.isSameNode(oldDroppableConfig.droppable)
      ) {
        emitEventToSiblings(
          childRef.value,
          DRAG_EVENT,
          windowScroll.value,
          oldDroppableConfig
        );
      }
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
// TODO: fix drop position on group with mixed styles
