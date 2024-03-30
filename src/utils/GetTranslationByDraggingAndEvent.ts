import { Direction } from "../composables";
import { DragAndDropEvent } from ".";
import { AfterMargin } from "../../index";
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

function getTranslationByDragging(
  direction: Direction | undefined,
  current: HTMLElement,
  previousElement: Element | null,
  nextElement: Element | null
) {
  if (!direction) {
    return { width: 0, height: 0 };
  }
  const {
    afterMargin,
    beforeMargin,
    distance,
    gap: gapStyle,
  } = getPropByDirection(direction);

  const currentAfterMargin = getMarginStyleByProperty(current, afterMargin);
  const currentBeforeMargin = getMarginStyleByProperty(current, beforeMargin);

  let nextBeforeMargin = getMarginStyleByProperty(nextElement, beforeMargin);

  const parentElement = current.parentElement as HTMLElement;

  const { gap, hasGaps } = gapAndDisplayInformation(parentElement, gapStyle);

  const space = current.getBoundingClientRect()[distance];

  if (hasGaps) {
    return getDistancesByDirection(
      direction,
      getTranslation(space, currentBeforeMargin, currentAfterMargin, gap, 0)
    );
  }

  const { afterSpace, beforeScace, rest } = getTranslationByDraggingWithoutGaps(
    previousElement,
    nextBeforeMargin,
    currentAfterMargin,
    currentBeforeMargin,
    afterMargin
  );

  return getDistancesByDirection(
    direction,
    getTranslation(space, beforeScace, afterSpace, 0, rest)
  );
}
const getTranslationByDraggingWithoutGaps = (
  previousElement: Element | null,
  nextBeforeMargin: number,
  currentAfterMargin: number,
  currentBeforeMargin: number,
  afterMargin: AfterMargin
) => {
  const afterSpace = Math.max(nextBeforeMargin, currentAfterMargin);
  let beforeScace = currentBeforeMargin;
  let rest = nextBeforeMargin;

  if (previousElement) {
    const previousAfterMargin = getMarginStyleByProperty(
      previousElement,
      afterMargin
    );
    beforeScace = Math.max(previousAfterMargin, currentBeforeMargin);
    rest = Math.max(rest, previousAfterMargin);
  }
  return { afterSpace, beforeScace, rest };
};
const getTranslation = (
  space: number,
  beforeScace: number,
  afterSpace: number,
  gap: number,
  rest: number
) => {
  return space + beforeScace + afterSpace + gap - rest;
};
const getDistancesByDirection = (direction: Direction, value: number) => {
  if (direction == "horizontal") {
    return { width: value, height: 0 };
  } else {
    return { width: 0, height: value };
  }
};
