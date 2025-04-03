import { Direction } from "../composables";
import {
  BeforeMargin,
  AfterMargin,
  BorderWidth,
  PaddingBefore,
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
export const getPaddingWidthProperty = (
  element: HTMLElement | Element | undefined | null,
  property: PaddingBefore
) => {
  if (element) {
    return parseFloatEmpty(getComputedStyle(element)[property]);
  }
  return 0;
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
)=> {
  const ifHorizontal = direction == "horizontal";
  return {
    beforeMargin: ifHorizontal? "marginLeft": "marginTop",
    afterMargin:  ifHorizontal? "marginRight": "marginBottom",
    borderBeforeWidth: ifHorizontal? "borderLeftWidth": "borderTopWidth",
    before:  ifHorizontal?"left": "top",
    after:  ifHorizontal?"right": "down",
    gap:  ifHorizontal?"columnGap": "rowGap",
    distance:  ifHorizontal?"width": "height",
    axis:  ifHorizontal?"x": "y",
    offset:  ifHorizontal?"offsetX": "offsetY",
    scroll:  ifHorizontal?"scrollX": "scrollY",
    scrollElement:  ifHorizontal?"scrollLeft": "scrollTop",
    page:  ifHorizontal?"pageX": "pageY",
    inner:  ifHorizontal?"innerWidth": "innerHeight",
    offsetElement:  ifHorizontal?"offsetLeft": "offsetTop",
    scrollDistance:  ifHorizontal?"scrollWidth": "scrollHeight",
    clientDistance:  ifHorizontal?"clientWidth": "clientHeight",
    paddingBefore:  ifHorizontal?'paddingLeft': 'paddingTop',
  } as const;
  
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
export const getParentDraggableChildren = (parent: HTMLElement) =>{
  const siblings = [...parent.children]
      .filter(
        (child) =>
          child.classList.contains("draggable")
      );
  return siblings
}
export const getSiblingsByParent = (
  current: HTMLElement,
  parent: HTMLElement
) => {
  const siblings = [...parent.children]
    .filter(
      (child) =>
        child.classList.contains("draggable") &&
        !child.isEqualNode(current) 
    )
    .toReversed();

  const positionOnDroppable = [...parent.children].findLastIndex((child) =>
    child.isEqualNode(current)
  );
  
  return [
    siblings,
    positionOnDroppable,
    parent,
  ] as const;
};
