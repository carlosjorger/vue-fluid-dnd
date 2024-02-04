import { BeforeMargin, AfterMargin, GapStyle, Direction } from "../../index";
export const getScroll = (element: HTMLElement | undefined | null) => {
  if (element) {
    const { scrollLeft, scrollTop } = element;
    return { scrollLeft, scrollTop };
  }
  return { scrollLeft: 0, scrollTop: 0 };
};
export const parseFloatEmpty = (value: string) => {
  if (!value || value.trim().length == 0 || value == "normal") {
    return 0;
  }
  return parseFloat(value);
};
export const computeGapPixels = (element: HTMLElement, gapType: GapStyle) => {
  const gap = getComputedStyle(element as HTMLElement)[gapType];
  if (gap.match("%")) {
    const gap_percent = parseFloatEmpty(gap.replace("%", ""));
    const { width } = element.getBoundingClientRect();
    return width * (gap_percent / 100);
  }
  const gap_px = parseFloatEmpty(gap.replace("px", ""));
  return gap_px;
};

const intersection = (
  firstInterval: { x1: number; x2: number },
  secondInterval: { x1: number; x2: number }
): number => {
  if (firstInterval.x1 > secondInterval.x1) {
    return intersection(secondInterval, firstInterval);
  }
  if (firstInterval.x2 < secondInterval.x1) {
    return 0;
  }
  if (firstInterval.x2 >= secondInterval.x2) {
    return firstInterval.x2 - firstInterval.x1;
  }
  return firstInterval.x2 - secondInterval.x1;
};

export const hasIntersection = (
  element1: HTMLElement,
  element2: HTMLElement
) => {
  const element1ElementRect = element1.getBoundingClientRect();
  const element2ElementRect = element2.getBoundingClientRect();

  const intersectionY = intersection(
    {
      x1: element1ElementRect.top,
      x2: element1ElementRect.top + element1ElementRect.height,
    },
    {
      x1: element2ElementRect.top,
      x2: element2ElementRect.top + element2ElementRect.height,
    }
  );
  const intersectionX = intersection(
    {
      x1: element1ElementRect.left,
      x2: element1ElementRect.left + element1ElementRect.width,
    },
    {
      x1: element2ElementRect.left,
      x2: element2ElementRect.left + element2ElementRect.width,
    }
  );
  return (
    intersectionY >=
      Math.min(element1ElementRect.height, element2ElementRect.height) / 2 &&
    intersectionX >=
      Math.min(element1ElementRect.width, element2ElementRect.width) / 2
  );
};
export const calculateRangeWhileDraggingByDirection = (
  siblings: HTMLElement[],
  sourceIndex: number,
  targetIndex: number,
  direction: Direction | undefined
) => {
  let height = 0;
  let width = 0;
  if (direction === "vertical") {
    height = calculateRangeWhileDragging(
      "marginTop",
      "marginBottom",
      "height",
      "rowGap",
      siblings,
      sourceIndex,
      targetIndex
    );
  } else if (direction === "horizontal") {
    width = calculateRangeWhileDragging(
      "marginLeft",
      "marginRight",
      "width",
      "columnGap",
      siblings,
      sourceIndex,
      targetIndex
    );
  }
  return { width, height };
};

export const calculateRangeWhileDragging = (
  beforeMarginProp: BeforeMargin,
  afterMarginProp: AfterMargin,
  spaceProp: "width" | "height",
  gapStyle: GapStyle,
  siblings: HTMLElement[],
  sourceIndex: number,
  targetIndex: number
) => {
  const isDraggedFoward = sourceIndex < targetIndex;

  const [firstIndex, secondIndex] = [sourceIndex, targetIndex].sort();
  const sourceElement = siblings[sourceIndex];
  const targetElement = siblings[targetIndex];
  const siblingsBetween = isDraggedFoward
    ? siblings.slice(firstIndex + 1, secondIndex + 1)
    : siblings.slice(firstIndex, secondIndex);

  const parentElement = sourceElement.parentElement as HTMLElement;

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

  let spaceCalc = spaceBetween - spaceBeforeDraggedElement;
  if (isDraggedFoward) {
    return spaceCalc;
  } else {
    return -spaceCalc;
  }
};
const getBeforeAfterMarginBaseOnDraggedDirection = (
  beforeMarginProp: BeforeMargin,
  afterMarginProp: AfterMargin,
  draggedElement: HTMLElement,
  previousElement: Element | null,
  isDraggedFoward: boolean,
  hasGaps: boolean
) => {
  if (isDraggedFoward) {
    return getBeforeAfterMargin(
      beforeMarginProp,
      afterMarginProp,
      draggedElement.previousElementSibling,
      draggedElement,
      hasGaps
    );
  } else {
    return getBeforeAfterMargin(
      beforeMarginProp,
      afterMarginProp,
      previousElement,
      draggedElement,
      hasGaps
    );
  }
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
const spaceWithMargins = (
  beforeMargin: BeforeMargin,
  afterMargin: AfterMargin,
  space: "width" | "height",
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
    if (hasGaps) {
      afterMarginCalc =
        afterMarginCalc + getMarginStyleByProperty(sibling, beforeMargin);
    }
    if (hasGaps && index > 0) {
      afterMarginCalc += gap;
    } else {
      afterMarginCalc = Math.max(
        afterMarginCalc,
        getMarginStyleByProperty(sibling, beforeMargin)
      );
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
export const getMarginStyleByProperty = (
  element: HTMLElement | Element | undefined | null,
  property: BeforeMargin | AfterMargin
) => {
  if (element && element instanceof HTMLElement) {
    return parseFloatEmpty(window.getComputedStyle(element)[property]);
  }
  return 0;
};
export const calculateWhileDraggingByDirection = (
  current: HTMLElement,
  previousElement: Element | null,
  nextElement: Element | null,
  direction: Direction | undefined
) => {
  let height = 0;
  let width = 0;
  let { height: elementHeight, width: elementWidth } =
    current.getBoundingClientRect();
  if (direction === "vertical") {
    height = calculateWhileDragging(
      current,
      "marginTop",
      "marginBottom",
      elementHeight,
      "rowGap",
      previousElement,
      nextElement
    );
  } else if (direction === "horizontal") {
    width = calculateWhileDragging(
      current,
      "marginLeft",
      "marginRight",
      elementWidth,
      "columnGap",
      previousElement,
      nextElement
    );
  }
  return { width, height };
};
const gapAndDisplayInformation = (element: HTMLElement, gapStyle: GapStyle) => {
  const gap = computeGapPixels(element, gapStyle);
  const display = window.getComputedStyle(element).display;
  const hasGaps = gap > 0 || display === "flex";
  return {
    gap,
    hasGaps,
  };
};
const calculateWhileDragging = (
  current: HTMLElement,
  beforeMargin: BeforeMargin,
  afterMargin: AfterMargin,
  space: number,
  gapStyle: GapStyle,
  previousElement: Element | null,
  nextElement: Element | null
) => {
  const currentAfterMargin = getMarginStyleByProperty(current, afterMargin);
  const currentBeforeMargin = getMarginStyleByProperty(current, beforeMargin);

  let nextBeforeMargin = getMarginStyleByProperty(nextElement, beforeMargin);

  let afterSpace = currentAfterMargin;
  let beforeScace = currentBeforeMargin;
  let rest = nextBeforeMargin;
  const parentElement = current.parentElement as HTMLElement;

  const { gap, hasGaps } = gapAndDisplayInformation(parentElement, gapStyle);

  if (hasGaps) {
    return space + beforeScace + afterSpace + gap;
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
  return space + beforeScace + afterSpace - rest;
};
