import { DragMouseTouchEvent } from "index";

type onMouseEvent = "onmouseup" | "onmousedown" | "onmousemove";
type onTouchEvent = "ontouchstart" | "ontouchmove";
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
  if (
    onEvent == "onmouseup" ||
    onEvent == "onmousedown" ||
    onEvent == "onmousemove"
  ) {
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
const convetEventToDragMouseTouchEvent = (
  event: MouseEvent | Touch
): DragMouseTouchEvent => {
  const { clientX, clientY, pageX, pageY, screenX, screenY, target } = event;
  return {
    clientX,
    clientY,
    pageX,
    pageY,
    screenX,
    screenY,
    target,
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
