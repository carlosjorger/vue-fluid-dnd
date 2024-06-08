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

export const getTransform = (element: Element) => {
  const style = getComputedStyle(element);
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
export const draggableIsOutside = (draggable: Element, droppable: Element) => {
  return !hasIntersection(draggable, droppable);
};
export const hasIntersection = (element1: Element, element2: Element) => {
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
  if (element) {
    return parseFloatEmpty(getComputedStyle(element)[property]);
  }
  return 0;
};
export const getMarginStyleByProperty = (
  element: HTMLElement | Element | undefined | null,
  property: BeforeMargin | AfterMargin
) => {
  if (element) {
    return parseFloatEmpty(getComputedStyle(element)[property]);
  }
  return 0;
};

export const getScrollElement = (element: HTMLElement) => {
  const { scrollLeft, scrollTop } = element;
  return { scrollLeft, scrollTop };
};
export const getPropByDirection = (
  direction: Direction
): {
  beforeMargin: BeforeMargin;
  afterMargin: AfterMargin;
  borderBeforeWidth: BorderWidth;
  before: Before;
  after: After;
  gap: GapStyle;
  distance: Distance;
  axis: Axis;
  offset: Offset;
  scroll: Scroll;
  scrollElement: ScrollElement;
  page: Page;
  inner: InnerDistance;
  offsetElement: OffsetElement;
  scrollDistance: ScrollDistance;
  clientDistance: ClientDistance;
} => {
  if (direction == "horizontal") {
    return {
      beforeMargin: "marginLeft",
      afterMargin: "marginRight",
      borderBeforeWidth: "borderLeftWidth",
      before: "left",
      after: "right",
      gap: "columnGap",
      distance: "width",
      axis: "x",
      offset: "offsetX",
      scroll: "scrollX",
      scrollElement: "scrollLeft",
      page: "pageX",
      inner: "innerWidth",
      offsetElement: "offsetLeft",
      scrollDistance: "scrollWidth",
      clientDistance: "clientWidth",
    };
  } else {
    return {
      beforeMargin: "marginTop",
      afterMargin: "marginBottom",
      borderBeforeWidth: "borderTopWidth",
      before: "top",
      after: "down",
      gap: "rowGap",
      distance: "height",
      axis: "y",
      offset: "offsetY",
      scroll: "scrollY",
      scrollElement: "scrollTop",
      page: "pageY",
      inner: "innerHeight",
      offsetElement: "offsetTop",
      scrollDistance: "scrollHeight",
      clientDistance: "clientHeight",
    };
  }
};
export const getSiblings = (current: HTMLElement, parent: HTMLElement) => {
  return getSiblingsByParent(current, parent);
};
export const getGroupDroppables = (
  currentDroppable: HTMLElement,
  droppableGroup?: string
) => {
  if (!droppableGroup) {
    return [currentDroppable];
  }
  return Array.from(
    document.querySelectorAll(`.droppable-group-${droppableGroup}`)
  );
};
export const getSiblingsByParent = (
  current: HTMLElement,
  parent: HTMLElement
) => {
  const siblings = [...parent.children]
    .filter(
      (child) =>
        !child.isEqualNode(current) && child.classList.contains("draggable")
    )
    .toReversed();

  const positionOnDroppable = [...parent.children].findLastIndex((child) =>
    child.isEqualNode(current)
  );

  return {
    siblings,
    positionOnDroppable,
    parent,
  };
};
