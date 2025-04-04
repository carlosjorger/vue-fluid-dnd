export const isTouchEvent = (
  event: MouseEvent | TouchEvent
): event is TouchEvent => window.TouchEvent && event instanceof TouchEvent;

export const IsHTMLElement = (
  element: Element | undefined
): element is HTMLElement => element instanceof HTMLElement;
