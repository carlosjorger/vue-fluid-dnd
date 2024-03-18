import {
  AfterMargin,
  BeforeMargin,
  Direction,
  Distance,
  Translate,
} from "../../index";
import {
  gapAndDisplayInformation,
  getMarginStyleByProperty,
  getPropByDirection,
} from "./GetStyles";
// TODO: refactor this function to make more legible
export default function getTranslateBeforeDropping(
  direction: Direction | undefined,
  siblings: HTMLElement[],
  sourceIndex: number,
  targetIndex: number,
  scroll: { scrollY: number; scrollX: number },
  previousScroll: { scrollLeft: number; scrollTop: number }
) {
  let height = 0;
  let width = 0;
  if (!direction) {
    return { height, width };
  }
  if (sourceIndex === targetIndex) {
    return addScrollToTranslate({ height, width }, direction, scroll);
  }
  const directionProps = getPropByDirection(direction);
  const isDraggedFoward = sourceIndex < targetIndex;

  const [firstIndex, secondIndex] = [sourceIndex, targetIndex].toSorted(
    (a, b) => a - b
  );
  const sourceElement = siblings[sourceIndex];
  const targetElement = siblings[targetIndex];
  const siblingsBetween = isDraggedFoward
    ? siblings.slice(firstIndex + 1, secondIndex + 1)
    : siblings.slice(firstIndex, secondIndex);

  const parentElement = sourceElement.parentElement as HTMLElement;
  const {
    scrollElement,
    beforeMargin: beforeMarginProp,
    afterMargin: afterMarginProp,
    distance: spaceProp,
    gap: gapStyle,
  } = directionProps;
  const { gap, hasGaps } = gapAndDisplayInformation(parentElement, gapStyle);
  const { beforeMargin, space, afterMargin } = spaceWithMargins(
    beforeMarginProp,
    afterMarginProp,
    spaceProp,
    siblingsBetween,
    gap,
    hasGaps
  );
  const {
    beforeMargin: beforeMarginOutside,
    afterMargin: afterMarginOutside,
    spaceBeforeDraggedElement,
  } = getBeforeAfterMarginBaseOnDraggedDirection(
    beforeMarginProp,
    afterMarginProp,
    sourceElement,
    targetElement?.previousElementSibling,
    isDraggedFoward,
    hasGaps
  );

  let beforeMarginCalc = Math.max(beforeMargin, afterMarginOutside);
  let afterMarginCalc = Math.max(afterMargin, beforeMarginOutside);

  const spaceBetween = afterMarginCalc + space + beforeMarginCalc + gap;

  const scrollParent = parentElement[scrollElement];
  const previousScrollValue = previousScroll[scrollElement];
  const scrollChange = scrollParent - previousScrollValue;

  let spaceCalc = spaceBetween - spaceBeforeDraggedElement;

  spaceCalc = isDraggedFoward ? spaceCalc : -spaceCalc;

  if (direction === "vertical") {
    height = spaceCalc - scrollChange;
  } else if (direction === "horizontal") {
    width = spaceCalc - scrollChange;
  }

  return addScrollToTranslate({ height, width }, direction, scroll);
}
const spaceWithMargins = (
  beforeMargin: BeforeMargin,
  afterMargin: AfterMargin,
  space: Distance,
  siblings: HTMLElement[],
  gap: number,
  hasGaps: boolean
) => {
  if (siblings.length == 0) {
    return {
      beforeMargin: 0,
      space: 0,
      afterMargin: 0,
    };
  }

  const beforeMarginCalc = getMarginStyleByProperty(siblings[0], beforeMargin);
  let afterMarginCalc = 0;
  let spaceCalc = 0;
  for (let index = 0; index < siblings.length; index++) {
    const sibling = siblings[index];
    const siblingSpace = sibling.getBoundingClientRect()[space];
    const siblingBeforeMargin = getMarginStyleByProperty(sibling, beforeMargin);
    if (hasGaps) {
      afterMarginCalc += siblingBeforeMargin;
    }
    if (hasGaps && index > 0) {
      afterMarginCalc += gap;
    } else {
      afterMarginCalc = Math.max(afterMarginCalc, siblingBeforeMargin);
    }
    spaceCalc += afterMarginCalc + siblingSpace;
    afterMarginCalc = getMarginStyleByProperty(sibling, afterMargin);
  }

  return {
    beforeMargin: beforeMarginCalc,
    space: spaceCalc - beforeMarginCalc,
    afterMargin: afterMarginCalc,
  };
};
const addScrollToTranslate = (
  translate: Translate,
  direction: Direction,
  initialScroll: { scrollY: number; scrollX: number }
) => {
  const { scroll, distance } = getPropByDirection(direction);
  const actualWindowScroll = window[scroll];
  const initialScrollProp = initialScroll[scroll];
  const scrollChange = initialScrollProp - actualWindowScroll;
  translate[distance] += scrollChange;
  return translate;
};
const getBeforeAfterMarginBaseOnDraggedDirection = (
  beforeMarginProp: BeforeMargin,
  afterMarginProp: AfterMargin,
  draggedElement: HTMLElement,
  previousElement: Element | null,
  isDraggedFoward: boolean,
  hasGaps: boolean
) => {
  const previousElementByDirection = isDraggedFoward
    ? draggedElement.previousElementSibling
    : previousElement;

  return getBeforeAfterMargin(
    beforeMarginProp,
    afterMarginProp,
    previousElementByDirection,
    draggedElement,
    hasGaps
  );
};
const getBeforeAfterMargin = (
  beforeMarginProp: BeforeMargin,
  afterMarginProp: AfterMargin,
  previousElement: HTMLElement | Element | null,
  nextElement: HTMLElement | Element | null,
  hasGaps: boolean
) => {
  if (hasGaps) {
    return {
      afterMargin: 0,
      beforeMargin: 0,
      spaceBeforeDraggedElement: 0,
    };
  }
  const afterMargin = getMarginStyleByProperty(
    previousElement,
    afterMarginProp
  );
  const beforeMargin = getMarginStyleByProperty(nextElement, beforeMarginProp);

  let spaceBeforeDraggedElement = Math.max(afterMargin, beforeMargin);
  return {
    afterMargin,
    beforeMargin,
    spaceBeforeDraggedElement,
  };
};
