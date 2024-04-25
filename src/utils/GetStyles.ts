import { Direction } from "../composables";
import {
  BeforeMargin,
  AfterMargin,
  GapStyle,
  BorderWidth,
  Distance,
  Before,
  Axis,
  Offset,
  Scroll,
  InnerDistance,
  Page,
  After,
  OffsetElement,
  ScrollElement,
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
export const parseIntEmpty = (value: string | null) => {
  if (!value) {
    return -1;
  }
  return parseInt(value);
};
export const computeGapPixels = (element: HTMLElement, gapType: GapStyle) => {
  const gap = getComputedStyle(element as HTMLElement)[gapType];
  if (gap.match("%")) {
    const gap_percent = parseFloatEmpty(gap.replace("%", ""));
    const { width } = element.getBoundingClientRect();
    return width * (gap_percent / 100);
  }
  const gap_px = getNumberFromPixels(gap);
  return gap_px;
};
export const getNumberFromPixels = (pixels: string | undefined) => {
  if (!pixels || pixels.length == 0) {
    return 0;
  }
  return parseFloatEmpty(pixels.replace("px", ""));
};
export const getTransform = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    x: matrix.m41,
    y: matrix.m42,
  };
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
export const draggableIsOutside = (draggable: HTMLElement) => {
  const parentElement = draggable.parentElement as HTMLElement;
  return !hasIntersection(draggable, parentElement);
};
export const hasIntersection = (
  element1: HTMLElement,
  element2: HTMLElement
) => {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  const intersectionY = intersectionByDirection(rect1, rect2, "vertical");
  const intersectionX = intersectionByDirection(rect1, rect2, "horizontal");
  return (
    intersectionY >= Math.min(rect1.height, rect2.height) / 2 &&
    intersectionX >= Math.min(rect1.width, rect2.width) / 2
  );
};
const intersectionByDirection = (
  rect1: DOMRect,
  rect2: DOMRect,
  direction: Direction
) => {
  const { before, distance } = getPropByDirection(direction);
  return intersection(
    {
      x1: rect1[before],
      x2: rect1[before] + rect1[distance],
    },
    {
      x1: rect2[before],
      x2: rect2[before] + rect2[distance],
    }
  );
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
export const getGapPixels = (element: HTMLElement, direction: Direction) => {
  const { gap: gapStyle } = getPropByDirection(direction);
  const { gap, hasGaps } = gapAndDisplayInformation(element, gapStyle);
  if (hasGaps) {
    return gap;
  }
  return 0;
};
export const gapAndDisplayInformation = (
  element: HTMLElement,
  gapStyle: GapStyle
) => {
  const gap = computeGapPixels(element, gapStyle);
  const display = window.getComputedStyle(element).display;
  const hasGaps = gap > 0 || display === "flex";
  return {
    gap,
    hasGaps,
  };
};
export const getScrollElement = (element: HTMLElement) => {
  const { scrollLeft, scrollTop } = element;
  return { scrollLeft, scrollTop };
};
// TODO: refactor this function
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
      scrollElement: "scrollLeft" as ScrollElement,
      page: "pageX" as Page,
      inner: "innerWidth" as InnerDistance,
      offsetElement: "offsetLeft" as OffsetElement,
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
      scrollElement: "scrollTop" as ScrollElement,
      page: "pageY" as Page,
      inner: "innerHeight" as InnerDistance,
      offsetElement: "offsetTop" as OffsetElement,
    };
  }
};

export const getSiblings = (current: HTMLElement) => {
  const nextSiblings = nextSiblingsFromElement(current);
  const { previousSiblings, elementPosition } =
    previousSiblingsFromElement(current);
  return {
    siblings: [...nextSiblings, ...previousSiblings],
    elementPosition,
  };
};
const nextSiblingsFromElement = (current: HTMLElement) => {
  const siblings = [] as HTMLElement[];
  let sibling = current as Element | null;
  while (sibling) {
    sibling = sibling.nextElementSibling;
    if (sibling instanceof HTMLElement) {
      siblings.push(sibling as HTMLElement);
    }
  }
  return siblings.toReversed();
};
const previousSiblingsFromElement = (current: HTMLElement) => {
  const siblings = [] as HTMLElement[];
  let previousSibling = current as Element | null;
  while (previousSibling) {
    previousSibling = previousSibling.previousElementSibling;
    if (previousSibling instanceof HTMLElement) {
      siblings.push(previousSibling as HTMLElement);
    }
  }
  return {
    previousSiblings: siblings,
    elementPosition: siblings.length,
  };
};
