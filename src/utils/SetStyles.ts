import { DragMouseTouchEvent } from "index";
import { getBorderWidthProperty } from "./GetStyles";

type onTouchEvent = "ontouchstart" | "ontouchmove";
const mouseEvents = ["onmouseup", "onmousedown", "onmousemove"] as const;
type onMouseEvent = typeof mouseEvents[number];

export const setBorderBoxStyle = (element: HTMLElement) => {
  element.style.boxSizing = "border-box";
};
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
  element.style.transform = `translate(${width}px,${height}px)`;
};

export const assignDraggingEvent = (
  element: HTMLElement,
  onEvent: onMouseEvent | onTouchEvent,
  onmouseupFunc: ((event: DragMouseTouchEvent) => void) | null
) => {
  if (!onmouseupFunc) {
    return;
  }
  if (isMouseEvent(onEvent)) {
    element[onEvent] = onmouseupFunc;
  } else {
    element[onEvent] = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        onmouseupFunc(convetEventToDragMouseTouchEvent(touch));
      }
    };
  }
};
// TODO: create addEventListener and removeEventListener
const isMouseEvent = (x: any): x is onMouseEvent => mouseEvents.includes(x);
const convetEventToDragMouseTouchEvent = (
  event: MouseEvent | Touch
): DragMouseTouchEvent => {
  const { clientX, clientY, pageX, pageY, screenX, screenY, target } = event;
  let offsetX = 0,
    offsetY = 0;

  if (event instanceof MouseEvent) {
    offsetX = event.offsetX;
    offsetY = event.offsetY;
  } else {
    const element = event.target as HTMLElement;
    const boundingClientRect = element.getBoundingClientRect();
    offsetX =
      pageX -
      window.scrollX -
      boundingClientRect.left -
      getBorderWidthProperty(element, "borderLeftWidth");

    offsetY =
      pageY -
      window.scrollY -
      boundingClientRect.top -
      getBorderWidthProperty(element, "borderTopWidth");
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
export const setTranistion = (
  element: HTMLElement | undefined,
  duration: number,
  timingFunction: string = "ease-out"
) => {
  if (element) {
    element.style.transition = `transform ${duration}ms ${timingFunction}`;
  }
};
