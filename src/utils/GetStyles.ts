import {
  BeforeMargin,
  AfterMargin,
  GapStyle,
  Direction,
  BorderWidth,
  Distance,
  Before,
  Axis,
  Offset,
  Scroll,
  InnerDistance,
  Page,
  After,
} from "../../index";
export const getScroll = (element: HTMLElement | undefined | null) => {
  if (element) {
    const { scrollLeft, scrollTop } = element;
    return { scrollLeft, scrollTop };
  }
  return { scrollLeft: 0, scrollTop: 0 };
};
export const getWindowScroll = () => {
  const { scrollX, scrollY } = window;
  return { scrollX, scrollY };
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

export const calculateRangeWhileDragging = (
  direction: Direction | undefined,
  siblings: HTMLElement[],
  sourceIndex: number,
  targetIndex: number,
  scroll: { scrollY: number; scrollX: number }
) => {
  let height = 0;
  let width = 0;
  if (!direction) {
    return { height, width };
  }
  if (sourceIndex === targetIndex) {
    return addScrollToRageDragging({ height, width }, direction, scroll);
  }
  const directionProps = getPropByDirection(direction);
  const isDraggedFoward = sourceIndex < targetIndex;

  const [firstIndex, secondIndex] = [sourceIndex, targetIndex].sort();
  const sourceElement = siblings[sourceIndex];
  const targetElement = siblings[targetIndex];
  const siblingsBetween = isDraggedFoward
    ? siblings.slice(firstIndex + 1, secondIndex + 1)
    : siblings.slice(firstIndex, secondIndex);

  const parentElement = sourceElement.parentElement as HTMLElement;

  const gapStyle = directionProps.gap;
  const { gap, hasGaps } = gapAndDisplayInformation(parentElement, gapStyle);
  const beforeMarginProp = directionProps.beforeMargin;
  const afterMarginProp = directionProps.afterMargin;
  const spaceProp = directionProps.distance;
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

  spaceCalc = isDraggedFoward ? spaceCalc : -spaceCalc;
  if (direction === "vertical") {
    height = spaceCalc;
  } else if (direction === "horizontal") {
    width = spaceCalc;
  }

  return addScrollToRageDragging({ height, width }, direction, scroll);
};
const addScrollToRageDragging = (
  dragging: {
    height: number;
    width: number;
  },
  direction: Direction,
  initialScroll: { scrollY: number; scrollX: number }
) => {
  const { scroll } = getPropByDirection(direction);
  const actualWindowScroll = window[scroll];
  const initialScrollProp = initialScroll[scroll];
  const scrollChange = initialScrollProp - actualWindowScroll;
  if (direction === "vertical") {
    dragging.height += scrollChange;
  } else if (direction === "horizontal") {
    dragging.width += scrollChange;
  }
  return dragging;
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
export const getBorderWidthProperty = (
  element: HTMLElement | Element | undefined | null,
  property: BorderWidth
) => {
  if (element && element instanceof HTMLElement) {
    return parseFloatEmpty(getComputedStyle(element)[property]);
  }
  return 0;
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
const gapAndDisplayInformation = (element: HTMLElement, gapStyle: GapStyle) => {
  const gap = computeGapPixels(element, gapStyle);
  const display = window.getComputedStyle(element).display;
  const hasGaps = gap > 0 || display === "flex";
  return {
    gap,
    hasGaps,
  };
};
export const calculateWhileDragging = (
  direction: Direction | undefined,
  current: HTMLElement,
  previousElement: Element | null,
  nextElement: Element | null
) => {
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
};
const getDistancesByDirection = (direction: Direction, value: number) => {
  if (direction == "horizontal") {
    return { width: value, height: 0 };
  } else {
    return { width: 0, height: value };
  }
};
export const getPropByDirection = (direction: Direction) => {
  if (direction == "horizontal") {
    return {
      beforeMargin: "marginLeft" as BeforeMargin,
      afterMargin: "marginRight" as AfterMargin,
      borderBeforeWidth: "borderLeftWidth" as BorderWidth,
      before: "left" as Before,
      after: "right" as After,
      gap: "columnGap" as GapStyle,
      distance: "width" as Distance,
      axis: "x" as Axis,
      offset: "offsetX" as Offset,
      scroll: "scrollX" as Scroll,
      page: "pageX" as Page,
      inner: "innerWidth" as InnerDistance,
    };
  } else {
    return {
      beforeMargin: "marginTop" as BeforeMargin,
      afterMargin: "marginBottom" as AfterMargin,
      borderBeforeWidth: "borderTopWidth" as BorderWidth,
      before: "top" as Before,
      after: "down" as After,
      gap: "rowGap" as GapStyle,
      distance: "height" as Distance,
      axis: "y" as Axis,
      offset: "offsetY" as Offset,
      scroll: "scrollY" as Scroll,
      page: "pageY" as Page,
      inner: "innerHeight" as InnerDistance,
    };
  }
};
