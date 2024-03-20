import { DragAndDropEvent, IsDropEvent } from "./index";

class DragAndDropEventEmitter {
  draggedElement: HTMLElement;
  event: DragAndDropEvent;
  constructor(draggedElement: HTMLElement, event: DragAndDropEvent) {
    this.draggedElement = draggedElement;
    this.event = event;
  }
  emit = () => {
    let tranlation = { height: 0, width: 0 };
    // tranlation = calculateInitialTranslation(draggedElement, event);
    // const { siblings, elementPosition } = getSiblings(draggedElement);
    const dropping = IsDropEvent(this.event);
    // if (!dropping) {
    //   emitDraggingEventToSiblings(draggedElement, event, siblings, tranlation);
    // } else {
    //   emitDroppingEventToSiblings(
    //     draggedElement,
    //     event,
    //     siblings,
    //     elementPosition,
    //     tranlation
    //   );
    // }
  };
}
