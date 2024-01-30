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
export const computeGapPixels = (
  element: HTMLElement,
  gapType: "columnGap" | "rowGap"
) => {
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
  beforeMargin: "marginTop" | "marginLeft",
  afterMargin: "marginBottom" | "marginRight",
  space: "width" | "height",
  gapStyle: "columnGap" | "rowGap",
  siblings: HTMLElement[],
  sourceIndex: number,
  targetIndex: number
) => {
  let spaceCalc = 0;
  const current = siblings[sourceIndex];
  const target = siblings[targetIndex];
  const siblingsBetween = siblings.slice(sourceIndex + 1, targetIndex + 1);
  console.log(
    spaceWithMargins(beforeMargin, afterMargin, space, siblingsBetween)
  );
};
const spaceWithMargins = (
  beforeMargin: "marginTop" | "marginLeft",
  afterMargin: "marginBottom" | "marginRight",
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
  const beforeMarginCalc = parseFloatEmpty(siblings[0].style[beforeMargin]);
  let afterMarginCalc = 0;
  let spaceCalc = 0;
  for (const sibling of siblings) {
    const siblingSpace = sibling.getBoundingClientRect()[space];
    afterMarginCalc = Math.max(
      afterMarginCalc,
      parseFloatEmpty(sibling.style[beforeMargin])
    );
    spaceCalc += afterMarginCalc + siblingSpace;
    afterMarginCalc = parseFloatEmpty(sibling.style[afterMargin]);
  }
  return {
    beforeMargin: beforeMarginCalc,
    space: spaceCalc,
    afterMargin: afterMarginCalc,
  };
};
