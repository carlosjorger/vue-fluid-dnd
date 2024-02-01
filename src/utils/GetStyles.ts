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
  const { beforeMargin, space, afterMargin } = spaceWithMargins(
    beforeMarginProp,
    afterMarginProp,
    spaceProp,
    siblingsBetween
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
    isDraggedFoward
  );

  const beforeMarginCalc = Math.max(beforeMargin, afterMarginOutside);
  const afterMarginCalc = Math.max(afterMargin, beforeMarginOutside);
  const spaceBetween = afterMarginCalc + space + beforeMarginCalc;

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
  isDraggedFoward: boolean
) => {
  let beforeMargin = 0;
  let afterMargin = 0;
  let spaceBeforeDraggedElement = 0;
  if (isDraggedFoward) {
    afterMargin = getMarginStyleByProperty(
      draggedElement.previousElementSibling,
      afterMarginProp
    );
    beforeMargin = getMarginStyleByProperty(draggedElement, beforeMarginProp);
    spaceBeforeDraggedElement = Math.max(afterMargin, beforeMargin);
  } else {
    afterMargin = getMarginStyleByProperty(previousElement, afterMarginProp);
    beforeMargin = getMarginStyleByProperty(draggedElement, beforeMarginProp);
    spaceBeforeDraggedElement = Math.max(beforeMargin, afterMargin);
  }
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
  siblings: HTMLElement[]
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
  for (const sibling of siblings) {
    const siblingSpace = sibling.getBoundingClientRect()[space];
    afterMarginCalc = Math.max(
      afterMarginCalc,
      getMarginStyleByProperty(sibling, beforeMargin)
    );
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
  const nextHTMLElement = nextElement as HTMLElement;
  let nextBeforeMargin = getMarginStyleByProperty(
    nextHTMLElement,
    beforeMargin
  );

  let afterSpace = currentAfterMargin;
  let beforeScace = currentBeforeMargin;
  let rest = nextBeforeMargin;
  let gap = 0;
  const parentElement = current.parentElement as HTMLElement;

  gap = computeGapPixels(parentElement, gapStyle);
  const display = window.getComputedStyle(parentElement).display;
  if (gap > 0 || display === "flex") {
    return space + beforeScace + afterSpace + gap;
  }
  afterSpace = Math.max(nextBeforeMargin, currentAfterMargin);
  const previousHTMLElement = previousElement as HTMLElement;
  if (previousHTMLElement) {
    const previousAfterMargin = getMarginStyleByProperty(
      previousHTMLElement,
      afterMargin
    );
    beforeScace = Math.max(previousAfterMargin, currentBeforeMargin);
    rest = Math.max(rest, previousAfterMargin);
  }
  return space + beforeScace + afterSpace - rest;
};
