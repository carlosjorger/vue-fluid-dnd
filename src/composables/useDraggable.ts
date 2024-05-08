import {
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

export default function useDraggable(
  child: HTMLElement | undefined,
  index: number,
  config: CoreConfig,
  parent: HTMLElement
) {
  const { handlerSelector, direction, isDraggable, droppableGroup, onDrop } =
    config;
  const droppableGroupClass = droppableGroup
    ? `droppable-group-${droppableGroup}`
    : null;
  const draggingState = ref<DraggingState>(DraggingState.NOT_DRAGGING);
  const childRef = ref(child);
  const translate = ref({ x: 0, y: 0 });
  const scroll = ref({ scrollLeft: 0, scrollTop: 0 });

  const duration = 200;

  const pagePosition = ref({ pageX: 0, pageY: 0 });

  const fixedWidth = ref("");
  const fixedHeight = ref("");
  const droppableScroll = ref({ scrollLeft: 0, scrollTop: 0 });

  const { setTransform, updateTransformState } = useTransform(childRef);
  const { emitEventToSiblings, toggleDraggingClass } = useEmitEvents(
    childRef,
    draggingState,
    fixedHeight,
    fixedWidth,
    index,
    handlerSelector,
    onDrop,
    duration,
    parent,
    direction
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
      `.${DRAGGABLE_CLASS} { touch-action: none; user-select: none; box-sizing: border-box !important; -webkit-user-select: none; }`,
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
    const droppableConfig = getCurrentConfig(event);
    if (draggingState.value === DraggingState.START_DRAGGING) {
      startDragging(event, droppableConfig);
      addTempChild(parent, direction);
    } else if (draggingState.value === DraggingState.DRAGING) {
      updateTempChildren(event);
      setTransformEvent(event, droppableConfig);
    }
  };
  const updateTempChildren = (event: DragMouseTouchEvent) => {
    const droppableConfig = getCurrentConfig(event);
    if (!droppableConfig) {
      return;
    }
    const { droppable, config } = droppableConfig;
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
      tempChild.parentElement?.removeChild(tempChild);
    });
  };
  const getCurrentConfig = (event: {
    readonly clientX: number;
    readonly clientY: number;
  }) => {
    const currentElement = childRef.value;
    if (currentElement) {
      currentElement.hidden = true;
    }
    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    if (currentElement) {
      currentElement.hidden = false;
    }
    if (droppableGroupClass && elementBelow) {
      const currentDroppable = elementBelow.closest(`.${droppableGroupClass}`);
      if (currentDroppable) {
        return ConfigHandler.getConfig(currentDroppable);
      }
    }
    return ConfigHandler.getConfig(parent);
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
          document.addEventListener(onLeaveEvent, onLeave(moveEvent));
        }
      }
    };
  };
  const onLeave = (moveEvent: MoveEvent) => {
    return () => {
      onDropDraggingEvent();
      document.removeEventListener(moveEvent, handlerMousemove);
      parent.onscroll = null;
    };
  };
  const startDragging = (
    event: DragMouseTouchEvent,
    droppableConfig?: DroppableConfig
  ) => {
    const element = childRef.value;
    if (!element) {
      return;
    }
    updateDraggingStateBeforeDragging();
    emitEventToSiblings(element, START_DRAG_EVENT, droppableScroll.value);
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
      direction
    );
    var child = document.createElement("div");
    child.classList.add(TEMP_CHILD_CLASS);
    const gap = getGapPixels(droppable, direction);
    const { distance } = getPropByDirection(direction);
    distances[distance] -= gap;
    child.style.height = `${distances.height}px`;
    child.style.minWidth = `${distances.width}px`;
    droppable.appendChild(child);
  };
  const setTransformEvent = (
    event: DragMouseTouchEvent,
    droppableConfig?: DroppableConfig
  ) => {
    const { pageX, pageY } = event;
    pagePosition.value = { pageX, pageY };
    setTransformDragEvent(droppableConfig);
  };
  const setTransformDragEvent = (droppableConfig?: DroppableConfig) => {
    const element = childRef.value as HTMLElement;
    if (pagePosition.value.pageX == 0 && pagePosition.value.pageY == 0) {
      return;
    }
    setTransform(element, parent, pagePosition, translate, direction);
    emitEventToSiblings(element, DRAG_EVENT, droppableScroll.value);
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
    // const { top, left } = element.getBoundingClientRect();
    // TODO: why drop is not working if hidden is setted
    // const droppableConfig = getCurrentConfig({ clientX: left, clientY: top });
    removeDraggingStyles(element);
    emitEventToSiblings(element, START_DROP_EVENT, droppableScroll.value);
  };
  const removeDraggingStyles = (element: HTMLElement) => {
    setTranistion(element, duration);
    console.log(element.style.transform);
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
  createWatchOfFixedSize(fixedWidth, "--fixedWidth");
  createWatchOfFixedSize(fixedHeight, "--fixedHeight");

  setCssStyles();
  setSlotRefElementParams(childRef.value);
}
// TODO: drag between groups https://javascript.info/mouse-drag-and-drop
// TODO: use semantic-realese https://medium.comr/@davidkelley87/using-semantic-release-for-npm-libraries-with-github-actions-234461235fa7
