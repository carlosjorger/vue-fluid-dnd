import { Direction } from "../composables";
import { DragMouseTouchEvent } from "../../index";
import { getBorderWidthProperty, getPropByDirection } from "./GetStyles";

type onTouchEvent = "ontouchstart" | "ontouchmove" | "ontouchend";
const onMouseEvents = ["onmouseup", "onmousedown", "onmousemove"] as const;
type onMouseEvent = typeof onMouseEvents[number];

type TouchEventType = "touchstart" | "touchmove" | "touchend";
const mouseEvents = ["mouseup", "mousedown", "mousemove"] as const;
type MouseEventType = typeof mouseEvents[number];
export const fixSizeStyle = (element: HTMLElement | undefined | null) => {
  if (!element) {
    return;
  }
  const { height, width } = element.getBoundingClientRect();
  element.style.height = `${height}px`;
  element.style.width = `${width}px`;
};
export const moveTranslate = (
  element: HTMLElement | undefined | null,
  height: number,
  width: number
) => {
  if (!element) {
    return;
  }
  if (width == 0 && height == 0) {
    element.style.transform = ``;
  } else {
    element.style.transform = `translate(${width}px,${height}px)`;
  }
};

export const assignDraggingEvent = (
  element: HTMLElement,
  onEvent: onMouseEvent | onTouchEvent,
  callback: ((event: DragMouseTouchEvent) => void) | null
) => {
  if (!callback) {
    return;
  }
  if (isOnMouseEvent(onEvent)) {
    element[onEvent] = callback;
  } else {
    element[onEvent] = (event: TouchEvent) => {
      const dragMouseTouchEvent = convetEventToDragMouseTouchEvent(event);
      callback(dragMouseTouchEvent);
    };
  }
};
export const addDragMouseToucEventListener = (
  event: TouchEventType | MouseEventType,
  callback: ((event: DragMouseTouchEvent) => void) | null
) => {
  if (!callback) {
    return;
  }
  if (isMouseEvent(event)) {
    document.addEventListener(event, callback);
  } else {
    document.addEventListener(event, (event: TouchEvent) => {
      const dragMouseTouchEvent = convetEventToDragMouseTouchEvent(event);
      callback(dragMouseTouchEvent);
    });
  }
};
const isOnMouseEvent = (x: any): x is onMouseEvent => onMouseEvents.includes(x);
const isMouseEvent = (x: any): x is MouseEventType => mouseEvents.includes(x);

export const convetEventToDragMouseTouchEvent = (
  event: MouseEvent | TouchEvent
): DragMouseTouchEvent => {
  let tempEvent = event instanceof TouchEvent ? event.touches[0] : event;
  if (!tempEvent) {
    const { target } = event;
    return {
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      screenX: 0,
      screenY: 0,
      target,
      offsetX: 0,
      offsetY: 0,
    };
  }
  const { clientX, clientY, pageX, pageY, screenX, screenY, target } =
    tempEvent;
  let offsetX = 0,
    offsetY = 0;

  if (event instanceof MouseEvent) {
    offsetX = event.offsetX;
    offsetY = event.offsetY;
  } else {
    const element = event.target as HTMLElement;
    offsetX = getOffset(tempEvent, window, "horizontal", element);
    offsetY = getOffset(tempEvent, window, "vertical", element);
  }
  return {
    clientX,
    clientY,
    pageX,
    pageY,
    screenX,
    screenY,
    target,
    offsetX,
    offsetY,
  };
};
const getOffset = (
  event: MouseEvent | Touch,
  window: Window,
  direction: Direction,
  element: HTMLElement
) => {
  const { page, scroll, before, borderBeforeWidth } =
    getPropByDirection(direction);
  const boundingClientRect = element.getBoundingClientRect();
  return (
    event[page] -
    window[scroll] -
    boundingClientRect[before] -
    getBorderWidthProperty(element, borderBeforeWidth)
  );
};
export const setTranistion = (
  element: HTMLElement | undefined,
  duration: number,
  timingFunction: string = "ease-out"
) => {
  if (element) {
    element.style.transition = `transform ${duration}ms ${timingFunction}`;
  }
};
export const setEventWithInterval = (
  element: HTMLElement | undefined,
  eventName: "onscroll",
  callback: () => void
) => {
  if (!element) {
    return;
  }
  element[eventName] = () => {
    callback();
  };
};
export const AddCssStyleToElement = (element: HTMLElement, cssCode: string) => {
  var draggableClass = document.createElement("style");
  draggableClass.innerHTML = cssCode;
  for (const child of element.children) {
    if (child.innerHTML === cssCode) {
      return;
    }
  }
  element.appendChild(draggableClass);
};
