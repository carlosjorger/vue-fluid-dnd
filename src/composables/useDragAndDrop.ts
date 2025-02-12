import { onInsertEventOnList, removeAtEventOnList } from "../utils/DropMethods";
import { Ref, ref, watch } from "vue";
import useDraggable from "./useDraggable";
import { parseIntEmpty } from "../utils/GetStyles";
import { Config } from ".";
import { observeMutation } from "../utils/observer";
import ConfigHandler from "./configHandler";
import { getConfig } from "../utils/config";
import HandlerPublisher from "./HandlerPublisher";

/**
 * Create the parent element of the draggable children and all the drag and drop events and styles.
 *
 * @template T - Type of the items.
 * @param items - List of data to drag and drop.
 * @param config - Configuration of drag and drop tool.
 * @returns The reference of the parent element and function to remove an element.
 */
const handlerPublisher = new HandlerPublisher()
export default function useDragAndDrop<T>(items: Ref<T[]>, config?: Config) {
  const INDEX_ATTR = "index";
  const parent = ref<HTMLElement | undefined>();
  let removeAtFromElements = [] as ((index: number) => void)[];
  function removeAt(index: number) {
    for (const removeAtFromElement of removeAtFromElements) {
      removeAtFromElement(index);
    }
  }
  const getOnRemoveAtEvent = (items: Ref<T[]>) => {
    return (index: number) => {
      return removeAtEventOnList(items, index);
    };
  };
  const getOnInsertEventOnList = (items: Ref<T[]>) => {
    return (index: number, value: T) => {
      return onInsertEventOnList(items, index, value);
    };
  };
  const onRemoveAtEvent = getOnRemoveAtEvent(items);
  const onInsertEvent = getOnInsertEventOnList(items);

  const makeChildrensDraggable = () => {
    if (!parent.value) {
      return;
    }

    removeAtFromElements = [];

    for (const child of parent.value!.children) {
      const index = child.getAttribute(INDEX_ATTR);
      const numberIndex = parseIntEmpty(index);
      const childHTMLElement = child as HTMLElement;

      if (childHTMLElement && numberIndex >= 0) {
        const { removeAtFromElement } = useDraggable(
          childHTMLElement,
          numberIndex,
          getConfig(onRemoveAtEvent, onInsertEvent, config),
          parent.value,
          handlerPublisher
        );
        removeAtFromElements.push(removeAtFromElement);
      }
    }
  };
  const observeChildrens = () => {
    if (!parent.value) {
      return;
    }
    observeMutation(
      () => {
        makeChildrensDraggable();
      },
      parent.value,
      { childList: true }
    );
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
        getConfig(onRemoveAtEvent, onInsertEvent, config)
      );
    }
  };
  watch(parent, () => {
    makeDroppable();
    addConfigHandler();
    observeChildrens();
    makeChildrensDraggable();
    ConfigHandler.removeObsoleteConfigs();
  });
  return { parent, removeAt };
}
