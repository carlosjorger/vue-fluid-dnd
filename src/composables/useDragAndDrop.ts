import { dropDraggingElementsBetween } from "../utils/DropMethods";
import { Direction, DraggableElement } from "index";
import { Ref, ref, watch } from "vue";
import { useDraggable } from "./useDraggable";

export const useDragAndDrop = <T>(
  direction: Direction,
  onDrop?: (source: DraggableElement, destination: DraggableElement) => void,
  items?: Ref<T[]>
) => {
  const DRAGGABLE_ID_ATTR = "draggable-id";
  const INDEX_ATTR = "index";
  console.log(onDrop, items, direction);
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
      const draggableId = child.getAttribute(DRAGGABLE_ID_ATTR);
      const updateDraggableId = (
        element: HTMLElement | undefined,
        index: number
      ) => {
        // if (element) {
        //   element.setAttribute(DRAGGABLE_ID_ATTR, props.draggableId);
        //   element.setAttribute(INDEX_ATTR, index.toString());
        // }
      };
      const childHTMLElement = child as HTMLElement;
      const numberIndex = parseInt(index ?? "-1");
      if (childHTMLElement && numberIndex >= 0) {
        console.log(child, index);

        useDraggable(
          childHTMLElement,
          numberIndex,
          updateDraggableId,
          getOnDrop(items?.value ?? []),
          direction
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
  watch(parent, () => {
    observeChildrens();
    makeChildrensDraggable();
  });
  return { parent };
};

const createObserverWithCallBack = (callback: () => void) => {
  return new MutationObserver((mutations) => {
    mutations.forEach(() => {
      callback();
    });
  });
};
// TODO: refactor useDragAndDrop
// TODO: test useDragAndDrop with all the cases
