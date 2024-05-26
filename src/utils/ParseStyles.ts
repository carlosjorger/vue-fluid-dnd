import { GapStyle } from "../../index";
import { getPropByDirection, parseFloatEmpty } from "./GetStyles";
import { Direction } from "../composables";

export const getNumberFromPixels = (pixels: string | undefined) => {
  if (!pixels || pixels.length == 0) {
    return 0;
  }
  return parseFloatEmpty(pixels.replace("px", ""));
};
export const computeGapPixels = (element: HTMLElement, gapType: GapStyle) => {
  const gap = getComputedStyle(element)[gapType];
  if (gap.match("%")) {
    const gap_percent = parseFloatEmpty(gap.replace("%", ""));
    const { width } = element.getBoundingClientRect();
    return width * (gap_percent / 100);
  }
  const gap_px = getNumberFromPixels(gap);
  return gap_px;
};
export const gapAndDisplayInformation = (
  element: HTMLElement,
  gapStyle: GapStyle
) => {
  if (!(element instanceof Element))
    return {
      gap: 0,
      hasGaps: false,
    };
  const gap = computeGapPixels(element, gapStyle);
  const display = window.getComputedStyle(element).display;
  const hasGaps = gap > 0 || display === "flex";
  return {
    gap,
    hasGaps,
  };
};
export const getBeforeStyles = (element: HTMLElement) => {
  const { top, left } = getComputedStyle(element);
  return {
    top: getNumberFromPixels(top),
    left: getNumberFromPixels(left),
  };
};
export const getGapPixels = (element: HTMLElement, direction: Direction) => {
  const { gap: gapStyle } = getPropByDirection(direction);
  const { gap, hasGaps } = gapAndDisplayInformation(element, gapStyle);
  if (hasGaps) {
    return gap;
  }
  return 0;
};
