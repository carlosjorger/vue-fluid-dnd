import { Direction } from "../../composables";
import {
  AfterMargin,
  BeforeMargin,
  Distance,
  ScrollElement,
  Translate,
  WindowScroll,
} from "../../../index";
import {
  getBorderWidthProperty,
  getMarginStyleByProperty,
  getPaddingWidthProperty,
  getPropByDirection,
} from "../GetStyles";
import { gapAndDisplayInformation, getBeforeStyles } from "../ParseStyles";

// TODO: fix cases with margins
const getGroupTranslate = (
  droppable: HTMLElement,
  draggable: HTMLElement,
  targetElement: Element
) =>{
  const {
    beforeMargin: beforeMarginVertical,
    borderBeforeWidth: borderBeforeWidthVertical,
    paddingBefore: paddingBeforeVertical
  } = getPropByDirection("vertical");

  const { 
    beforeMargin: beforeMarginHorizontal,
    borderBeforeWidth: borderBeforeWidthHorizontal,
    paddingBefore: paddingBeforeHorizontal
  } =
    getPropByDirection("horizontal");

  const beforeMarginVerticalValue = getMarginStyleByProperty(
    draggable,
    beforeMarginVertical
  );
  const beforeMarginHorizontalValue = getMarginStyleByProperty(
    draggable,
    beforeMarginHorizontal
  );

  const beforeTarget = targetElement
  
  const beforeMarginVerticalValuePreviousTarget = getMarginStyleByProperty(
    beforeTarget,
    beforeMarginVertical
  );

  const { top, left } = getBeforeStyles(draggable);
  const {x: xDroppable, y: yDroppable} = droppable.getBoundingClientRect()

  const borderBeforeWidthDroppableVertical =  getBorderWidthProperty(droppable, borderBeforeWidthVertical)
  const borderBeforeWidthDroppableHorizontal =  getBorderWidthProperty(droppable, borderBeforeWidthHorizontal)

  const paddingBeforeDroppableVertical =  getPaddingWidthProperty(droppable, paddingBeforeVertical)
  const paddingBeforeDroppableHorizontal =  getPaddingWidthProperty(droppable, paddingBeforeHorizontal)
  // console.log({beforeMarginVerticalValue, beforeMarginVerticalValuePreviousTarget }, Math.abs(beforeMarginVerticalValue - beforeMarginVerticalValuePreviousTarget))
  return {
    x: xDroppable + paddingBeforeDroppableHorizontal + borderBeforeWidthDroppableHorizontal - (left),
    y: yDroppable + paddingBeforeDroppableVertical + borderBeforeWidthDroppableVertical  - 
    (top)
  }

}
export default function getTranslateBeforeDropping(
  direction: Direction,
  siblings: Element[],
  sourceIndex: number,
  targetIndex: number,
  scroll: WindowScroll,
  previousScroll: { scrollLeft: number; scrollTop: number },
  initialWindowScroll: WindowScroll,
  droppable: HTMLElement,
  draggable?: HTMLElement
) {
  let height = 0;
  let width = 0;
  const isGroupDropping = Boolean(sourceIndex < 0 && draggable);

  if (sourceIndex === targetIndex && !isGroupDropping) {
    return addScrollToTranslate(
      { height, width },
      direction,
      scroll,
      initialWindowScroll,
      isGroupDropping
    );
  }
  
  const { sourceElement, targetElement, siblingsBetween, isDraggedFoward } =
  getElementsRange(siblings, sourceIndex, targetIndex, draggable);

  if (isGroupDropping) {
    const { x, y } = getGroupTranslate(droppable, draggable!, targetElement);
    height += y;
    width += x;
  }

  const {
    scrollElement,
    beforeMargin: beforeMarginProp,
    afterMargin: afterMarginProp,
    distance: spaceProp,
    gap: gapStyle,
  } = getPropByDirection(direction);
  const { gap, hasGaps } = gapAndDisplayInformation(droppable, gapStyle);

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
    hasGaps,
    isGroupDropping
  );
  const { beforeSpace, space, afterSpace } = spaceWithMargins(
    beforeMarginProp,
    afterMarginProp,
    spaceProp,
    siblingsBetween,
    gap,
    hasGaps
  );
  const spaceBetween = getSpaceBetween(
    space,
    beforeSpace,
    afterSpace,
    beforeMarginOutside,
    afterMarginOutside,
    gap
  );

  const scrollChange = isGroupDropping
    ? droppable[scrollElement]
    : getScrollChange(scrollElement, droppable, previousScroll);
  const spaceCalc = isDraggedFoward
    ? spaceBetween - spaceBeforeDraggedElement
    : spaceBeforeDraggedElement - spaceBetween;

  const translate = spaceCalc - scrollChange;
  if (direction === "vertical") {
    height += translate;
  } else if (direction === "horizontal") {
    width += translate;
  }
  return addScrollToTranslate(
    { height, width },
    direction,
    scroll,
    initialWindowScroll,
    isGroupDropping
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
  siblings: Element[],
  sourceIndex: number,
  targetIndex: number,
  draggable?: HTMLElement
) => {
  const isDraggedFoward = sourceIndex < targetIndex;

  const [firstIndex, secondIndex] = [sourceIndex, targetIndex].toSorted(
    (a, b) => a - b
  );
  const sourceElement = siblings[sourceIndex] ?? draggable;
  const targetElement = siblings[targetIndex];

  let siblingsBetween = isDraggedFoward
    ? siblings.slice(firstIndex + 1, secondIndex + 1)
    : siblings.slice(firstIndex, secondIndex);

  if (firstIndex < 0 && draggable) {
    siblingsBetween = siblings.slice(firstIndex + 1, secondIndex);
  }
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
  distance: Distance,
  siblings: Element[],
  gap: number,
  hasGaps: boolean
) => {
  if (siblings.length == 0) {
    return {
      beforeSpace: 0,
      space: 0,
      afterSpace: 0,
    };
  }
  const beforeSpace = getMarginStyleByProperty(siblings[0], beforeMargin);
  let afterSpace = 0;
  let space = -beforeSpace;
  for (const [index, sibling] of siblings.entries()) {
    const siblingSpace = sibling.getBoundingClientRect()[distance];
    const siblingBeforeMargin = getMarginStyleByProperty(sibling, beforeMargin);
    if (hasGaps) {
      afterSpace += siblingBeforeMargin;
    }
    if (hasGaps && index > 0) {
      afterSpace += gap;
    } else {
      afterSpace = Math.max(afterSpace, siblingBeforeMargin);
    }
    space += afterSpace + siblingSpace;
    afterSpace = getMarginStyleByProperty(sibling, afterMargin);
  }
  return { beforeSpace, space, afterSpace };
};
const addScrollToTranslate = (
  translate: Translate,
  direction: Direction,
  initialScroll: WindowScroll,
  initialWindowScroll: WindowScroll,
  isGroupDropping: Boolean
) => {
  const { scroll, distance } = getPropByDirection(direction);
  const actualWindowScroll = window[scroll];
  const initialScrollProp = initialScroll[scroll];
  const scrollChange = isGroupDropping
    ? 0
    : initialScrollProp - 2 * actualWindowScroll + initialWindowScroll[scroll];
  translate[distance] += scrollChange;
  return translate;
};
const getBeforeAfterMarginBaseOnDraggedDirection = (
  beforeMarginProp: BeforeMargin,
  afterMarginProp: AfterMargin,
  draggedElement: Element,
  previousElement: Element | null,
  isDraggedFoward: boolean,
  hasGaps: boolean,
  isGroupDropping: boolean
) => {
  const previousElementByDirection = isDraggedFoward
    ? draggedElement.previousElementSibling
    : previousElement;
  return getBeforeAfterMargin(
    beforeMarginProp,
    afterMarginProp,
    previousElementByDirection,
    draggedElement,
    hasGaps,
    isGroupDropping
  );
};
const getBeforeAfterMargin = (
  beforeMarginProp: BeforeMargin,
  afterMarginProp: AfterMargin,
  previousElement: HTMLElement | Element | null,
  nextElement: HTMLElement | Element | null,
  hasGaps: boolean,
  isGroupDropping: boolean
) => {
  if (hasGaps) {
    return {
      afterMargin: 0,
      beforeMargin: 0,
      spaceBeforeDraggedElement: 0,
    };
  }
  const afterMargin = getMarginStyleByProperty(
    isGroupDropping? null: previousElement,
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
