import {
  getGapPixels,
  getPropByDirection,
  getScroll,
} from "../utils/GetStyles";
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
} from "../../index";
import { ref, watch } from "vue";
import { Config } from ".";
import useEmitEvents from "../utils/emitEvents";
import { DraggingState } from "../utils";
import { getConfig } from "../utils/config";

const DRAGGABLE_CLASS = "draggable";
const HANDLER_CLASS = "handler-class";
const DRAGGING_HANDLER_CLASS = "dragging-handler-class";
const DROPPABLE_CLASS = "droppable";
const TEMP_CHILD_CLASS = "temp-child";
const DRAGING_CLASS = "dragging";

const DRAG_EVENT = "drag";
const START_DRAG_EVENT = "startDrag";
const START_DROP_EVENT = "startDrop";

export default function useDraggable(
  child: HTMLElement | undefined,
  index: number,
  config: Config | undefined,
  onDrop: (source: DraggableElement, destination: DraggableElement) => void,
  parent: HTMLElement
) {
  const { handlerClass, direction } = getConfig(config);
  const draggingState = ref<DraggingState>(DraggingState.NOT_DRAGGING);
  const childRef = ref(child);
  const translate = ref({ x: 0, y: 0 });
  const scroll = ref({ scrollLeft: 0, scrollTop: 0 });

  const duration = 200;

  const pagePosition = ref({ pageX: 0, pageY: 0 });

  const fixedWidth = ref("");
  const fixedHeight = ref("");
  const { setTransform, updateTransformState } = useTransform(childRef);
  const { emitEventToSiblings } = useEmitEvents(
    childRef,
    draggingState,
    fixedHeight,
    fixedWidth,
    index,
    handlerClass,
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
    AddCssStyleToElement(
      parent,
      `.${HANDLER_CLASS} { cursor: grab; pointer-events: auto !important; }`
    );
    setHandlerStyles();
    AddCssStyleToElement(
      parent,
      `.${DRAGGABLE_CLASS} * { pointer-events: none; }`
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
  const setSlotRefElementParams = (element: HTMLElement | undefined) => {
    const handlerElement =
      (element?.querySelector(`.${HANDLER_CLASS}`) as HTMLElement) ?? element;
    if (handlerElement) {
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
  const removeDraggingStyles = (element: HTMLElement) => {
    setTranistion(element, duration);
    moveTranslate(element, 0, 0);
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
// TODO: add isDraggable prop
// TODO: drag between groups https://javascript.info/mouse-drag-and-drop
