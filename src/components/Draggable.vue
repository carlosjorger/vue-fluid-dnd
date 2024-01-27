<template><slot :set-ref="setSlotRef"></slot></template>
<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  inject,
  onMounted,
  ref,
  watch,
} from "vue";
import eventBus from "@/utils/EventBus";
import { Direction } from "../../index.ts";
import {
  setBorderBoxStyle,
  fixSizeStyle,
  moveTranslate,
  assignOnmouseup,
  setTranistion,
} from "@/utils/SetStyles";
import {
  getScroll,
  parseFloatEmpty,
  computeGapPixels,
} from "@/utils/GetStyles";
const { draggableId } = defineProps<{
  draggableId: string;
  enableDrag: boolean;
}>();

type RefElement<T> = Element | ComponentPublicInstance<T> | null;
type DragEvent = "drag" | "drop" | "startDrag" | "startDrop";
const START_DRAG_EVENT = "startDrag";
const DRAG_EVENT = "drag";
const START_DROP_EVENT = "startDrop";
const DROP_EVENT = "drop";

const style = ref("");
const position = ref({ top: 0, left: 0 });
const offset = ref({ offsetX: 0, offsetY: 0 });
const dragging = ref(false);
const direction = inject<Direction>("direction");
const translate = ref({ x: 0, y: 0 });
const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
const duration = 300;

let childRef = ref<HTMLElement>();
onMounted(() => {
  eventBus.on(DRAG_EVENT, ({ element, height, width, draggableIdEvent }) => {
    if (draggableId == draggableIdEvent) {
      moveTranslate(element, height, width);
      setTranistion(element, duration);
    }
  });
  eventBus.on(
    START_DRAG_EVENT,
    ({ element, height, width, draggableIdEvent }) => {
      if (draggableId == draggableIdEvent) {
        moveTranslate(element, height, width);
      }
    }
  );
  eventBus.on(
    START_DROP_EVENT,
    ({ element, height, width, draggableIdEvent }) => {
      if (draggableId == draggableIdEvent) {
        moveTranslate(element, height, width);
      }
    }
  );
  eventBus.on(DROP_EVENT, ({ element }: { element: HTMLElement }) => {
    element.style.transition = ``;
    moveTranslate(element, 0, 0);
  });
});

const setSlotRef = <_>(el: RefElement<_>) => {
  childRef.value = el as HTMLElement;
};

const setSlotRefElementParams = (element: HTMLElement | undefined) => {
  if (element) {
    element.classList.add("draggable");
    element.onmousedown = onmousedown;
    element.setAttribute("draggable-id", draggableId);
  }
};
const setTransform = (element: HTMLElement, pageX: number, pageY: number) => {
  const { width, height } = element.getBoundingClientRect();
  const { innerWidth, innerHeight } = window;
  const elementXPosittion = pageX - offset.value.offsetX;
  const elementYPosition = pageY - offset.value.offsetY;

  if (
    elementXPosittion >= -width / 2 &&
    elementXPosittion <= innerWidth + width / 2
  ) {
    translate.value.x =
      elementXPosittion -
      position.value.left -
      parseFloatEmpty(element.style.marginLeft);
  }
  if (
    elementYPosition >= -height / 2 &&
    elementYPosition <= innerHeight + height / 2
  ) {
    translate.value.y =
      elementYPosition -
      position.value.top -
      parseFloatEmpty(element.style.marginTop);
  }
};

const onmousemove = function (event: MouseEvent, element: HTMLElement) {
  if (!dragging.value) {
    return;
  }
  setTransform(element, event.pageX, event.pageY);
  emitEventToSiblings(element, DRAG_EVENT);
};
const handlerMousemove = (event: MouseEvent) => {
  if (childRef.value) {
    onmousemove(event, childRef.value);
  }
};
const onmousedown = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  scroll.value = getScroll(element.parentElement);

  if (dragging.value) {
    onDropDraggingEvent(event);
    document.removeEventListener("mousemove", handlerMousemove, false);
    return;
  }
  style.value = element.style.cssText;
  const { width, height } = element.getBoundingClientRect();
  const { offsetX, offsetY, x, y, pageY, pageX } = event;
  const { marginTop, marginLeft } = element.style;
  dragging.value = true;
  offset.value = { offsetX, offsetY };
  emitEventToSiblings(element, START_DRAG_EVENT);
  fixSizeStyle(element.parentElement);
  position.value = {
    top: y - height / 2 - parseFloatEmpty(marginTop),
    left: x - width / 2 - parseFloatEmpty(marginLeft),
  };
  setDraggingStyles(element);
  setBorderBoxStyle(element);
  setTransform(element, pageX, pageY);

  document.addEventListener("mousemove", handlerMousemove);
  if (element) {
    assignOnmouseup(element, (event: MouseEvent) => {
      onmouseup(event);
      document.removeEventListener("mousemove", handlerMousemove);
      assignOnmouseup(element, null);
    });
  }
};
const emitEventToSiblings = (element: HTMLElement, event: DragEvent) => {
  let tranlation = { height: 0, width: 0 };

  let sibling = element.nextElementSibling;
  const brother = sibling as HTMLElement;
  if (!(sibling instanceof HTMLElement)) {
    return;
  }
  if (!direction) {
    return;
  }
  if (direction === "vertical") {
    tranlation.height = calculateHeightWhileDragging(element, brother, event);
  } else if (direction === "horizontal") {
    tranlation.width = calculateWidthWhileDragging(element, brother, event);
  }
  // const currentElementRect = element.getBoundingClientRect();

  while (sibling) {
    var element = sibling as HTMLElement;
    if (sibling instanceof HTMLElement) {
      const siblingDraggableId = sibling.getAttribute("draggable-id") ?? "";
      // const siblingHTMLElement = sibling as HTMLElement;

      // console.log(
      //   hasIntersection(
      //     currentElementRect,
      //     siblingHTMLElement.getBoundingClientRect()
      //   )
      // );
      eventBus.emit(event, {
        element: sibling,
        draggableIdEvent: siblingDraggableId,
        ...tranlation,
      });
    }
    sibling = sibling.nextElementSibling;
  }
};
const hasIntersection = (element1: DOMRect, element2: DOMRect) => {
  const element1ElementRect = element1;
  const element2ElementRect = element2;

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
const calculateHeightWhileDragging = (
  current: HTMLElement,
  brother: HTMLElement,
  event: DragEvent
) => {
  let { height } = current.getBoundingClientRect();
  return calculateWhileDragging(
    current,
    brother,
    "marginTop",
    "marginBottom",
    height,
    "rowGap",
    event
  );
};

const calculateWidthWhileDragging = (
  current: HTMLElement,
  brother: HTMLElement,
  event: DragEvent
) => {
  let { width } = current.getBoundingClientRect();
  return calculateWhileDragging(
    current,
    brother,
    "marginLeft",
    "marginRight",
    width,
    "columnGap",
    event
  );
};
const calculateWhileDragging = (
  current: HTMLElement,
  brother: HTMLElement,
  beforeMargin: "marginTop" | "marginLeft",
  afterMargin: "marginBottom" | "marginRight",
  space: number,
  gapStyle: "columnGap" | "rowGap",
  event: DragEvent
) => {
  const brotherBeforeMargin = parseFloatEmpty(brother.style[beforeMargin]);
  const currentAfterMargin = parseFloatEmpty(current.style[afterMargin]);
  const currentBeforeMargin = parseFloatEmpty(current.style[beforeMargin]);
  let afterSpace = currentAfterMargin;
  let beforeScace = currentBeforeMargin;
  let rest = brotherBeforeMargin;
  let gap = 0;
  const parentElement = current.parentElement as HTMLElement;
  if (
    !hasIntersection(
      current.getBoundingClientRect(),
      parentElement.getBoundingClientRect()
    ) &&
    event == "drag"
  ) {
    return 0;
  }
  gap = computeGapPixels(parentElement, gapStyle);
  if (gap > 0 || parentElement.style.display === "flex") {
    return space + beforeScace + afterSpace + gap;
  }
  afterSpace = Math.max(brotherBeforeMargin, currentAfterMargin);
  const previousElement = current.previousElementSibling as HTMLElement;
  if (previousElement) {
    const previousAfterMargin = parseFloatEmpty(
      previousElement.style[afterMargin]
    );
    beforeScace = Math.max(previousAfterMargin, currentBeforeMargin);
    rest = Math.max(rest, previousAfterMargin);
  }
  return space + beforeScace + afterSpace - rest;
};
const onmouseup = (event: MouseEvent) => {
  onDropDraggingEvent(event);
};
const onDropDraggingEvent = (event: MouseEvent) => {
  dragging.value = false;
  const element = event.target as HTMLElement;
  removeDraggingStyles(event, element);
};
const removeDraggingStyles = (event: MouseEvent, element: HTMLElement) => {
  const { pageY, y, pageX, x } = event;
  const { width, height } = element.getBoundingClientRect();
  setTranistion(element, duration);

  const { scrollTop, scrollLeft } = getScroll(element.parentElement);
  moveTranslate(
    element,
    pageY -
      y -
      offset.value.offsetY +
      height / 2 +
      (scroll.value.scrollTop - scrollTop),
    pageX -
      x -
      offset.value.offsetX +
      width / 2 +
      (scroll.value.scrollLeft - scrollLeft)
  );
  emitEventToSiblings(element, START_DROP_EVENT);
  setTimeout(() => {
    emitEventToSiblings(element, DROP_EVENT);
    element.style.cssText = style.value;
  }, duration);
};

const setDraggingStyles = (element: HTMLElement) => {
  fixSizeStyle(element);
  element.style.position = "absolute";
  element.style.zIndex = "5000";
  element.style.transition = "";
};

const computedCursor = computed(() => (dragging.value ? "grabbing" : "grab"));

watch(childRef, (element) => {
  setSlotRefElementParams(element);
});
watch(
  position,
  (newPosition) => {
    if (childRef.value) {
      childRef.value.style.top = `${newPosition.top}px`;
      childRef.value.style.left = `${newPosition.left}px`;
    }
  },
  { deep: true }
);
watch(
  translate,
  (newTranslate) => {
    if (childRef.value) {
      childRef.value.style.transform = `translate( ${newTranslate.x}px, ${newTranslate.y}px)`;
    }
  },
  { deep: true }
);
</script>
<style>
.draggable {
  cursor: v-bind("computedCursor");
}
</style>
<!-- TODO: create swap animation while dragging -->
<!-- TODO: refactor -->
