import { Translate } from "../../index";
import { CoreConfig, Direction } from "../composables";
import { getPropByDirection } from "./GetStyles";
import { getGapPixels } from "./ParseStyles";
import { setTranistion } from "./SetStyles";
import { observeMutation } from "./observer";
// import { scrollByDirection } from "./scroll";
import getTranslationByDragging from "./translate/GetTranslationByDraggingAndEvent";

const TEMP_CHILD_CLASS = "temp-child";
const START_DRAG_EVENT = "startDrag";
const timingFunction = "cubic-bezier(0.2, 0, 0, 1)";
const getDistance = (
  droppable: HTMLElement,
  draggedElement: HTMLElement,
  direction: Direction
) => {
  let distances = getTranslationByDragging(
    draggedElement,
    START_DRAG_EVENT,
    direction,
    droppable
  );
  const gap = getGapPixels(droppable, direction);
  const { distance } = getPropByDirection(direction);
  distances[distance] -= gap;
  const { large, largeDistance } = getlarge(direction, draggedElement);
  distances[largeDistance] = large;
  return distances;
};
const getlarge = (direction: Direction, draggedElement: HTMLElement) => {
  const largeDirection = direction == "horizontal" ? "vertical" : "horizontal";
  const { distance } = getPropByDirection(largeDirection);
  return {
    large: draggedElement.getBoundingClientRect()[distance],
    largeDistance: distance,
  };
};
const setSizes = (element: HTMLElement, height: number, width: number) => {
  element.style.height = `${height}px`;
  element.style.width = `${width}px`;
  element.style.width = `${width}px`;
  element.style.minWidth = `${width}px`;
};
const updateChildAfterCreated = (
  child: HTMLElement,
  droppable: HTMLElement,
  distances: Translate
) => {
  return (observer: MutationObserver) => {
    if (!droppable.contains(child)) {
      return;
    }
    setSizes(child, distances.height, distances.width);
    observer.disconnect();
  };
};
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
  var child = document.createElement("div");
  child.classList.add(TEMP_CHILD_CLASS);
  setSizes(child, 0, 0);
  const distances = getDistance(droppable, draggedElement, direction);
  setTranistion(child, animationDuration, timingFunction, "height, width");
  if (parent.isSameNode(droppable)) {
    setSizes(child, distances.height, distances.width);
  }
  droppable.appendChild(child);
  droppable.appendChild(child);
  observeMutation(
    updateChildAfterCreated(child, droppable, distances),
    droppable,
    {
      childList: true,
      subtree: true,
    }
  );
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
