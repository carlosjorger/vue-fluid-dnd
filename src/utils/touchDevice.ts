export const isTouchEvent = (
  event: MouseEvent | TouchEvent
): event is TouchEvent => window.TouchEvent && event instanceof TouchEvent;
