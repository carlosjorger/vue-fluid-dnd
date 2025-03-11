import { Direction } from "../composables";
import { DragMouseTouchEvent } from "../../index";
import { getBorderWidthProperty, getPropByDirection } from "./GetStyles";
import { IsHTMLElement, isTouchEvent } from "./touchDevice";

type onTouchEvent = "ontouchstart" | "ontouchmove" | "ontouchend";
const onMouseEvents = ["onmouseup", "onmousedown", "onmousemove"] as const;
type onMouseEvent = (typeof onMouseEvents)[number];

type TouchEventType = "touchstart" | "touchmove" | "touchend";
const mouseEvents = ["mouseup", "mousedown", "mousemove"] as const;
type MouseEventType = (typeof mouseEvents)[number];
type DragEventCallback = (event: DragMouseTouchEvent) => void;
export const fixSizeStyle = (element: HTMLElement | undefined | null) => {
  if (!element) {
    return;
  }
  const { height, width } = element.getBoundingClientRect();
  element.style.height = `${height}px`;
  element.style.width = `${width}px`;
};
export const moveTranslate = (
  element: Element | undefined | null,
  height: number,
  width: number
) => {
  if (!element || !IsHTMLElement(element)) {
    return;
  }
  if (width == 0 && height == 0) {
    element.style.transform = "";
  } else {
    element.style.transform = `translate(${width}px,${height}px)`;
  }
};
const assignDraggingTouchEvent = (
  element: HTMLElement,
  onEvent: onTouchEvent,
  callback: DragEventCallback
) => {
  element[onEvent] = (event: TouchEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    const dragMouseTouchEvent = convetEventToDragMouseTouchEvent(event);
    callback(dragMouseTouchEvent);
  };
};
export const assignDraggingEvent = (
  element: HTMLElement,
  onEvent: onMouseEvent | onTouchEvent,
  callback: DragEventCallback | null
) => {
  if (!callback) {
    return;
  }
  if (isOnMouseEvent(onEvent)) {
    element[onEvent] = callback;
  } else {
    assignDraggingTouchEvent(element, onEvent, callback);
  }
};
export const addDragMouseToucEventListener = (
  event: TouchEventType | MouseEventType,
  callback: DragEventCallback | null
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
const getDefaultEvent = (event: TouchEvent | MouseEvent) => {
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
};
const getOffsetFromEvent = (
  event: MouseEvent | TouchEvent,
  tempEvent: MouseEvent | Touch
) => {
  const getTouchEventOffset = (element: Element, direction: Direction) => {
    return getOffset(tempEvent, window, direction, element);
  };
  if (event instanceof MouseEvent) {
    const { offsetX, offsetY } = event;
    return { offsetX, offsetY };
  } else {
    const element = event.target as Element;
    return {
      offsetX: getTouchEventOffset(element, "horizontal"),
      offsetY: getTouchEventOffset(element, "vertical"),
    };
  }
};
export const convetEventToDragMouseTouchEvent = (
  event: MouseEvent | TouchEvent,

): DragMouseTouchEvent => {
  const tempEvent = getEvent(event);
  if (!tempEvent) {
    return getDefaultEvent(event);
  }

  const { offsetX, offsetY } = getOffsetFromEvent(event, tempEvent);
  const { clientX, clientY, pageX, pageY, screenX, screenY, target } =
    tempEvent;

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
const getEvent = (event: MouseEvent | TouchEvent) => {
  if (isTouchEvent(event)) {
    return event.touches[0] ?? event.changedTouches[0];
  }
  if (event instanceof MouseEvent) {
    return event;
  }
};
const getOffset = (
  event: MouseEvent | Touch,
  window: Window,
  direction: Direction,
  element: Element
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
  element: Element | undefined,
  duration: number,
  timingFunction: string = "ease-out",
  types: string = "transform"
) => {
  if (IsHTMLElement(element)) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transitionTimingFunction = `${timingFunction}`;
    element.style.transitionProperty = `${types}`;
  }
};
export const setEventWithInterval = (
  element: Element | undefined,
  eventName: "onscroll",
  callback: () => void
) => {
  if (!element || !IsHTMLElement(element)) {
    return;
  }
  element[eventName] = () => {
    callback();
  };
};
const getStyles = (node: ParentNode) => {
  var style = node.querySelector("style");
  if (!style) {
    var newStyle = document.createElement("style");
    node.appendChild(newStyle);
    return newStyle;
  }
  return style;
};
const containRule = (sheet: CSSStyleSheet, cssCode: string) => {
  const selectorTextRegex = /\.-?[_a-zA-Z0-9-*\s<>():]+/g;
  const [selectorText] = cssCode.match(selectorTextRegex) || [];
  for (const rule of sheet.cssRules) {
    const [ruleSelectorText] = rule.cssText.match(selectorTextRegex) || [];
    if (selectorText === ruleSelectorText) {
      return true;
    }
  }
  return false;
};
export const AddCssStylesToElement = (node: ParentNode, cssCodes: string[]) => {
  cssCodes.forEach((cssCode) => {
    AddCssStyleToElement(node, cssCode);
  });
};

const AddCssStyleToElement = (node: ParentNode, cssCode: string) => {
  var style = getStyles(node);
  if (!style.sheet) {
    return;
  }
  if (!containRule(style.sheet, cssCode)) {
    style.sheet?.insertRule(cssCode, style.sheet.cssRules.length);
  }
};
