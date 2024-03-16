import { Direction } from "index";
import {
  gapAndDisplayInformation,
  getMarginStyleByProperty,
  getPropByDirection,
} from "./GetStyles";
export default function getTranslationByDragging(
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
  const parentElement = current.parentElement as HTMLElement;

  const gapStyle = directionProps.gap;
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
