import { DragAndDropEvent } from ".";
import { Direction } from "../../index";
import {
  draggableIsOutside,
  gapAndDisplayInformation,
  getMarginStyleByProperty,
  getPropByDirection,
} from "./GetStyles";

export default function getTranslationByDraggingAndEvent(
  current: HTMLElement,
  event: DragAndDropEvent,
  direction: Direction | undefined,
  previousElement = current.previousElementSibling,
  nextElement = current.nextElementSibling
) {
  let { height, width } = getTranslationByDragging(
    direction,
    current,
    previousElement,
    nextElement
  );
  const intersection = draggableIsOutside(current);
  if (intersection && event == "drag") {
    height = 0;
    width = 0;
  }
  return { height, width };
}
// TODO: refactor this function to make more legible

function getTranslationByDragging(
  direction: Direction | undefined,
  current: HTMLElement,
  previousElement: Element | null,
  nextElement: Element | null
) {
  let height = 0;
  let width = 0;
  if (!direction) {
    return { width, height };
  }
  const directionProps = getPropByDirection(direction);

  const { afterMargin, beforeMargin } = directionProps;

  const currentAfterMargin = getMarginStyleByProperty(current, afterMargin);
  const currentBeforeMargin = getMarginStyleByProperty(current, beforeMargin);

  let nextBeforeMargin = getMarginStyleByProperty(nextElement, beforeMargin);

  let afterSpace = currentAfterMargin;
  let beforeScace = currentBeforeMargin;
  let rest = nextBeforeMargin;

  const gapStyle = directionProps.gap;

  const parentElement = current.parentElement as HTMLElement;

  const { gap, hasGaps } = gapAndDisplayInformation(parentElement, gapStyle);

  const space = current.getBoundingClientRect()[directionProps.distance];

  if (hasGaps) {
    return getDistancesByDirection(
      direction,
      space + beforeScace + afterSpace + gap
    );
  }
  afterSpace = Math.max(nextBeforeMargin, currentAfterMargin);
  if (previousElement) {
    const previousAfterMargin = getMarginStyleByProperty(
      previousElement,
      afterMargin
    );
    beforeScace = Math.max(previousAfterMargin, currentBeforeMargin);
    rest = Math.max(rest, previousAfterMargin);
  }
  return getDistancesByDirection(
    direction,
    space + beforeScace + afterSpace - rest
  );
}

const getDistancesByDirection = (direction: Direction, value: number) => {
  if (direction == "horizontal") {
    return { width: value, height: 0 };
  } else {
    return { width: 0, height: value };
  }
};
