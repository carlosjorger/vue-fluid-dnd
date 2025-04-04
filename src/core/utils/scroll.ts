import { ElementScroll } from "index";
import { Direction } from "..";
import { getPropByDirection } from "./GetStyles";
export const scrollByDirection = (
  element: HTMLElement,
  direction: Direction,
  scrollAmount: number
) => {
  if (scrollAmount == 0) {
    return;
  }
  if (direction === "vertical") {
    element.scrollBy(0, scrollAmount);
  } else {
    element.scrollBy(scrollAmount, 0);
  }
};
export const scrollPercent = (
  direction: Direction,
  droppable: HTMLElement,
  droppableScroll: ElementScroll
) => {
  const { scrollDistance, clientDistance, scrollElement } =
    getPropByDirection(direction);
  return (
    droppableScroll[scrollElement] /
    (droppable[scrollDistance] - droppable[clientDistance])
  );
};
