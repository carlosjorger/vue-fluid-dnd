import {
  dropDraggingElementsBetween,
  onInsertEventOnList,
  removeAtEventOnList,
} from "../utils/DropMethods";
import { DraggableElement } from "../../index";
import { Ref, ref, watch } from "vue";
import useDraggable from "./useDraggable";
import { parseIntEmpty } from "../utils/GetStyles";
import { Config } from ".";
import { createObserverWithCallBack } from "../utils/observer";
import ConfigHandler from "./configHandler";
import { getConfig } from "../utils/config";

/**
 * Create the parent element of the draggable children and all the drag and drop events and styles.
 *
 * @template T - Type of the items.
 * @param items - List of data to drag and drop.
 * @param config - Configuration of drag and drop tool.
 * @returns The reference of the parent element.
 */
export default function useDragAndDrop<T>(items: Ref<T[]>, config?: Config) {
  const INDEX_ATTR = "index";
  const parent = ref<HTMLElement | undefined>();

  const getOnDrop = (items: T[]) => {
    return (source: DraggableElement, destination: DraggableElement) => {
      if (items) {
        dropDraggingElementsBetween(ref(items), source, destination);
      }
    };
  };
  const getOnRemoveAtEvent = (items: T[]) => {
    return (index: number) => {
      return removeAtEventOnList(ref(items) as Ref<T[]>, index);
    };
  };
  const getOnInsertEventOnList = (items: T[]) => {
    return (index: number, value: T) => {
      return onInsertEventOnList(ref(items) as Ref<T[]>, index, value);
    };
  };
  const onDrop = getOnDrop(items.value);
  const onRemoveAtEvent = getOnRemoveAtEvent(items.value);
  const onInsertEvent = getOnInsertEventOnList(items.value);

  const makeChildrensDraggable = () => {
    if (!parent.value) {
      return;
    }
    for (const child of parent.value!.children) {
      const index = child.getAttribute(INDEX_ATTR);
      const numberIndex = parseIntEmpty(index);
      const childHTMLElement = child as HTMLElement;

      if (childHTMLElement && numberIndex >= 0) {
        useDraggable(
          childHTMLElement,
          numberIndex,
          getConfig(onDrop, onRemoveAtEvent, onInsertEvent, config),
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
    });
    observer.observe(parent.value, { childList: true });
  };
  const makeDroppable = () => {
    if (parent.value) {
      parent.value.classList.add("droppable");
    }
  };
  const addConfigHandler = () => {
    if (parent.value) {
      ConfigHandler.addConfig(
        parent.value,
        getConfig(onDrop, onRemoveAtEvent, onInsertEvent, config)
      );
    }
  };
  watch(parent, () => {
    makeDroppable();
    addConfigHandler();
    observeChildrens();
    makeChildrensDraggable();
  });
  return { parent };
}
