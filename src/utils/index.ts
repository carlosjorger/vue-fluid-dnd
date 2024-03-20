const START_DRAG_EVENT = "startDrag";
export const DRAG_EVENT = "drag";
export const START_DROP_EVENT = "startDrop";
export const DROP_EVENT = "drop";
export type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
export type DropEvent = typeof DROP_EVENT | typeof START_DROP_EVENT;
export type DragAndDropEvent = DraggingEvent | DropEvent;
export const IsDropEvent = (event: DragAndDropEvent): event is DropEvent => {
  return event === DROP_EVENT || event === START_DROP_EVENT;
};
