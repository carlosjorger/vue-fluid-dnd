import { CoreConfig } from "../composables";
import { getPropByDirection } from "./GetStyles";
import { getGapPixels } from "./ParseStyles";
import { setTranistion } from "./SetStyles";
import { observeMutation } from "./observer";
import getTranslationByDragging from "./translate/GetTranslationByDraggingAndEvent";

const TEMP_CHILD_CLASS = "temp-child";
const START_DRAG_EVENT = "startDrag";
const draggableTargetTimingFunction = "cubic-bezier(0.2, 0, 0, 1)";

export const addTempChild = <T>(
  droppable: HTMLElement,
  draggedElement: HTMLElement | undefined,
  parent: Element,
  config: CoreConfig<T>
) => {
  const { direction, animationDuration } = config;
  if (droppable.querySelector(`.${TEMP_CHILD_CLASS}`) || !draggedElement) {
    return;
  }
  let distances = getTranslationByDragging(
    draggedElement,
    START_DRAG_EVENT,
    direction,
    droppable
  );
  var child = document.createElement("div");
  child.classList.add(TEMP_CHILD_CLASS);
  const gap = getGapPixels(droppable, direction);
  const { distance } = getPropByDirection(direction);
  distances[distance] -= gap;

  child.style.height = "0px";
  child.style.minWidth = "0px";

  setTranistion(
    child,
    animationDuration,
    draggableTargetTimingFunction,
    "height, width"
  );
  if (parent.isSameNode(droppable)) {
    child.style.height = `${distances.height}px`;
    child.style.minWidth = `${distances.width}px`;
  }
  observeMutation(
    (observer) => {
      if (!droppable.contains(child)) {
        return;
      }
      child.style.height = `${distances.height}px`;
      child.style.minWidth = `${distances.width}px`;
      observer.disconnect();
    },
    droppable,
    {
      childList: true,
      subtree: true,
    }
  );
  droppable.appendChild(child);
};
export const removeTempChildrens = (
  droppable: HTMLElement,
  parent: HTMLElement,
  droppableGroupClass: string | null,
  animationDuration: number
) => {
  if (!droppableGroupClass) {
    return;
  }
  var children = document.querySelectorAll(
    `.${droppableGroupClass} .${TEMP_CHILD_CLASS}`
  );
  children.forEach((tempChild) => {
    const childParent = tempChild.parentElement;
    if (childParent?.isSameNode(parent) || childParent?.isSameNode(droppable)) {
      return;
    }
    const tempChildElement = tempChild as HTMLElement;
    tempChildElement.style.width = "0px";
    tempChildElement.style.height = "0px";
    setTimeout(() => {
      tempChild.parentNode?.removeChild(tempChild);
    }, animationDuration);
  });
};
