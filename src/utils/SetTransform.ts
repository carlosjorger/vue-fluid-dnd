import { DragMouseTouchEvent, TransformEvent } from "../../index";
import {
  draggableIsOutside,
  getBorderWidthProperty,
  getMarginStyleByProperty,
  getPropByDirection,
} from "./GetStyles";
import { Ref, ref, watch } from "vue";
import { Direction } from "../composables";
import { scrollByDirection } from "./scroll";
import { HANDLER_CLASS, DRAGGING_CLASS } from "./classes";

export const useTransform = (
  childRef: Ref<HTMLElement | undefined>
) => {
  const currentOffset = ref({ offsetX: 0, offsetY: 0 });
  const position = ref({ top: 0, left: 0 });
  const translate = ref({ x: 0, y: 0 });

  watch(
    translate,
    (newTranslate) => {
      const childElement = childRef.value;
      if (childElement) {
        childElement.style.transform = `translate( ${newTranslate.x}px, ${newTranslate.y}px)`;
      }
    },
    { deep: true }
  );
  watch(
    position,
    (newPosition) => {
      const childElement = childRef.value;
      if (childElement) {
        childElement.style.top = `${newPosition.top}px`;
        childElement.style.left = `${newPosition.left}px`;
      }
    },
    { deep: true }
  );

  function setTransform(
    element: HTMLElement,
    parent: HTMLElement,
    pagePosition: Ref<{
      pageX: number;
      pageY: number;
    }>,
    direction?: Direction
  ) {
    const getTranslateWihtDirection = (translateDirection: Direction) => {
      const {
        beforeMargin,
        borderBeforeWidth,
        before,
        offset,
        scroll,
        page,
        inner,
        distance,
        axis,
      } = getPropByDirection(translateDirection);
      const pageValue = pagePosition.value[page];
      const scrollValue = window[scroll];
      const innerDistance = window[inner];
      const distanceValue = element.getBoundingClientRect()[distance];
      const border = getBorderWidthProperty(element, borderBeforeWidth);
      const margin = getMarginStyleByProperty(element, beforeMargin);
      const elementPosittion = pageValue - currentOffset.value[offset];
      if (
        elementPosittion >= scrollValue - distanceValue / 2 &&
        elementPosittion <= scrollValue + innerDistance
      ) {
        const newTranslate =
          elementPosittion -
          position.value[before] -
          border -
          margin -
          scrollValue;
        updateScroll(translateDirection);
        return newTranslate;
      }
      const defaultTransalation = translate.value[axis];
      return defaultTransalation;
    };
    const updateScroll = (translateDirection: Direction) => {
      if (
        element &&
        element.classList.contains(DRAGGING_CLASS) &&
        translateDirection === direction
      ) {
        const { before, distance, axis } = getPropByDirection(direction);
        const distanceValue = element.getBoundingClientRect()[distance];

        const parentBoundingClientRect = parent.getBoundingClientRect();
        const positionInsideParent =
          position.value[before] -
          parentBoundingClientRect[before] +
          translate.value[axis];

        const parentDistance = parentBoundingClientRect[distance];
        const totalDistance = parentDistance - distanceValue;
        const relativePosition = positionInsideParent / totalDistance;
        const relativeDistanceValue = distanceValue / totalDistance;

        const velocity = 0.1;
        const infLimit = 0.2;
        const upperLimit = 0.8;
        let percent = 0;
        const isOutside = draggableIsOutside(element, parent);
        if (
          !isOutside &&
          relativePosition < infLimit &&
          relativePosition > -relativeDistanceValue
        ) {
          percent = relativePosition / infLimit - 1;
        } else if (
          !isOutside &&
          relativePosition > upperLimit &&
          relativePosition < 1 + relativeDistanceValue
        ) {
          percent = (1 / (1 - upperLimit)) * (relativePosition - upperLimit);
        }
        const scrollAmount = velocity * distanceValue * percent;
        scrollByDirection(parent, direction, scrollAmount);
      }
    };
    const updateTranlateByDirection = (direction: Direction) => {
      const { axis } = getPropByDirection(direction);
      translate.value[axis] = getTranslateWihtDirection(direction);
    };
    updateTranlateByDirection("horizontal");
    updateTranlateByDirection("vertical");
  }

  const updateTransformState = (
    event: DragMouseTouchEvent,
    element: HTMLElement
  ) => {
    const { offsetX, offsetY, top, left } = getTransformState(
      event,
      element,
      childRef.value
    );
    position.value = {
      top,
      left,
    };
    currentOffset.value = { offsetX, offsetY };
  };
  return {
    setTransform,
    updateTransformState,
  };
};

const getOffsetWithDraggable = (
  direction: Direction,
  element: Element,
  draggable: Element
) => {
  const { borderBeforeWidth, before } = getPropByDirection(direction);
  return (
    element.getBoundingClientRect()[before] -
    draggable.getBoundingClientRect()[before] -
    getBorderWidthProperty(draggable, borderBeforeWidth)
  );
};
const getOffset = (event: TransformEvent, draggable: Element | undefined) => {
  let { offsetX, offsetY, target } = event;
  let targetHandler = getHandlerElementAncestor(target, draggable);
  const targetElement = target as HTMLElement;
  if (targetElement && targetHandler && !targetElement.isSameNode(targetHandler)) {
    offsetX += getOffsetWithDraggable("horizontal", targetElement, targetHandler);
    offsetY += getOffsetWithDraggable("vertical", targetElement, targetHandler);
  }
  if (draggable && targetHandler && draggable != target) {
    offsetX += getOffsetWithDraggable("horizontal", targetHandler, draggable);
    offsetY += getOffsetWithDraggable("vertical", targetHandler, draggable);
  }
  return { offsetX, offsetY };
};
const getHandlerElementAncestor = (
  target: EventTarget | null,
  draggable?: Element
) => {
  const targetHandler = (target as Element)?.closest(`.${HANDLER_CLASS}`);
  if (targetHandler && draggable && targetHandler.isSameNode(draggable)) {
    return target as Element;
  }
  return targetHandler;
};
const getPositionByDistance = (
  direction: Direction,
  event: TransformEvent,
  element: HTMLElement,
  offsetEvent: {
    offsetX: number;
    offsetY: number;
  }
) => {
  const { offset, beforeMargin, page, borderBeforeWidth, scroll } =
    getPropByDirection(direction);
  return (
    event[page] -
    offsetEvent[offset] -
    getMarginStyleByProperty(element, beforeMargin) -
    getBorderWidthProperty(element, borderBeforeWidth) -
    window[scroll]
  );
};
export const getTransformState = (
  event: TransformEvent,
  element: HTMLElement,
  draggable?: Element
) => {
  const { offsetX, offsetY } = getOffset(event, draggable);
  return {
    top: getPositionByDistance("vertical", event, element, {
      offsetX,
      offsetY,
    }),
    left: getPositionByDistance("horizontal", event, element, {
      offsetX,
      offsetY,
    }),
    offsetX,
    offsetY,
  };
};
