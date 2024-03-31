import { dropDraggingElementsBetween } from "../utils/DropMethods";
import { DraggableElement } from "index";
import { Ref, ref, watch } from "vue";
import useDraggable from "./useDraggable";
import { parseIntEmpty } from "../utils/GetStyles";
import { Config, VERTICAL } from ".";

const DEFAULT_CONFIG = { direction: VERTICAL } as Config;
export default function useDragAndDrop<T>(items: Ref<T[]>, config?: Config) {
  const { direction = VERTICAL } = config ?? DEFAULT_CONFIG;
  const INDEX_ATTR = "index";
  const parent = ref<HTMLElement | undefined>();

  const getOnDrop = (items: T[]) => {
    return (source: DraggableElement, destination: DraggableElement) => {
      if (items) {
        dropDraggingElementsBetween(ref(items), source, destination);
      }
    };
  };
  const makeChildrensDraggable = () => {
    if (!parent.value) {
      return;
    }
    for (const child of parent.value!.children) {
      const index = child.getAttribute(INDEX_ATTR);
      const numberIndex = parseIntEmpty(index);
      const childHTMLElement = child as HTMLElement;
      const onDrop = getOnDrop(items.value);

      if (childHTMLElement && numberIndex >= 0) {
        useDraggable(
          childHTMLElement,
          numberIndex,
          direction,
          onDrop,
          parent.value
        );
      }
    }
  };
  const observeChildrens = () => {
    if (!parent.value) {
      return;
    }
    const observer = createObserverWithCallBack(() => {
      makeChildrensDraggable();
      observer.disconnect();
    });
    observer.observe(parent.value, { childList: true });
  };
  const makeDroppable = () => {
    if (parent.value) {
      parent.value.classList.add("droppable");
    }
  };
  watch(parent, () => {
    makeDroppable();
    observeChildrens();
    makeChildrensDraggable();
  });
  return { parent };
}

const createObserverWithCallBack = (callback: () => void) => {
  return new MutationObserver((mutations) => {
    mutations.forEach(() => {
      callback();
    });
  });
};
