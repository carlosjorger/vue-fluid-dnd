import { Direction } from "../composables";
import {
  AfterMargin,
  BeforeMargin,
  Distance,
  ScrollElement,
  Translate,
} from "../../index";
import {
  gapAndDisplayInformation,
  getBeforeStyles,
  getMarginStyleByProperty,
  getPropByDirection,
  getTransform,
} from "./GetStyles";
const getGroupDraggedTranslate = (
  firstElement: HTMLElement,
  draggable: HTMLElement
) => {
  const { top, left } = getBeforeStyles(draggable);
  const { top: firstElementTop, left: firstElementLeft } =
    firstElement.getBoundingClientRect();
  const { x, y } = getTransform(firstElement);
  return {
    height: firstElementTop - top - y,
    width: firstElementLeft - left - x,
  };
};
export default function getTranslateBeforeDropping(
  direction: Direction,
  siblings: HTMLElement[],
  sourceIndex: number,
  targetIndex: number,
  scroll: { scrollY: number; scrollX: number },
  previousScroll: { scrollLeft: number; scrollTop: number },
  initialWindowScroll: number,
  droppable: HTMLElement,
  draggable?: HTMLElement
) {
  let height = 0;
  let width = 0;
  if (sourceIndex === targetIndex) {
    return addScrollToTranslate(
      { height, width },
      direction,
      scroll,
      initialWindowScroll
    );
  }
  if (sourceIndex < 0 && draggable) {
    sourceIndex = 0;
    const [firstElement] = siblings;
    console.log(getGroupDraggedTranslate(firstElement, draggable));
    //TODO rest transform
    //and pass dragged element
  }
  const { sourceElement, targetElement, siblingsBetween, isDraggedFoward } =
    getElementsRange(siblings, sourceIndex, targetIndex);
  const {
    scrollElement,
    beforeMargin: beforeMarginProp,
    afterMargin: afterMarginProp,
    distance: spaceProp,
    gap: gapStyle,
  } = getPropByDirection(direction);
  const { gap, hasGaps } = gapAndDisplayInformation(droppable, gapStyle);

  const { beforeMarginSpace, space, afterMarginSpace } = spaceWithMargins(
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

  const spaceBetween = getSpaceBetween(
    space,
    beforeMarginSpace,
    afterMarginSpace,
    beforeMarginOutside,
    afterMarginOutside,
    gap
  );

  const scrollChange = getScrollChange(
    scrollElement,
    droppable,
    previousScroll
  );

  const spaceCalc = isDraggedFoward
    ? spaceBetween - spaceBeforeDraggedElement
    : spaceBeforeDraggedElement - spaceBetween;

  const translate = spaceCalc - scrollChange;
  if (direction === "vertical") {
    height = translate;
  } else if (direction === "horizontal") {
    width = translate;
  }

  return addScrollToTranslate(
    { height, width },
    direction,
    scroll,
    initialWindowScroll
  );
}
const getScrollChange = (
  scrollElement: ScrollElement,
  parentElement: HTMLElement,
  previousScroll: { scrollLeft: number; scrollTop: number }
) => {
  const scrollParent = parentElement[scrollElement];
  const previousScrollValue = previousScroll[scrollElement];
  return scrollParent - previousScrollValue;
};
const getSpaceBetween = (
  innerSpace: number,
  beforeMarginSpace: number,
  afterMarginSpace: number,
  beforeMarginOutside: number,
  afterMarginOutside: number,
  gap: number
) => {
  const beforeMarginCalc = Math.max(beforeMarginSpace, afterMarginOutside);
  const afterMarginCalc = Math.max(afterMarginSpace, beforeMarginOutside);

  return afterMarginCalc + innerSpace + beforeMarginCalc + gap;
};
const getElementsRange = (
  siblings: HTMLElement[],
  sourceIndex: number,
  targetIndex: number
) => {
  const isDraggedFoward = sourceIndex < targetIndex;

  const [firstIndex, secondIndex] = [sourceIndex, targetIndex].toSorted(
    (a, b) => a - b
  );
  const sourceElement = siblings[sourceIndex];
  const targetElement = siblings[targetIndex];
  const siblingsBetween = isDraggedFoward
    ? siblings.slice(firstIndex + 1, secondIndex + 1)
    : siblings.slice(firstIndex, secondIndex);
  return {
    sourceElement,
    targetElement,
    siblingsBetween,
    isDraggedFoward,
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
      beforeMarginSpace: 0,
      space: 0,
      afterMarginSpace: 0,
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
    beforeMarginSpace: beforeMarginCalc,
    space: spaceCalc - beforeMarginCalc,
    afterMarginSpace: afterMarginCalc,
  };
};
const addScrollToTranslate = (
  translate: Translate,
  direction: Direction,
  initialScroll: { scrollY: number; scrollX: number },
  initialWindowScroll: number
) => {
  const { scroll, distance } = getPropByDirection(direction);
  const actualWindowScroll = window[scroll];
  const initialScrollProp = initialScroll[scroll];
  const scrollChange =
    initialScrollProp - 2 * actualWindowScroll + initialWindowScroll;
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
