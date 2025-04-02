import { getLength, getValue, onInsertEventOnList, removeAtEventOnList } from "../utils/DropMethods";
import { Ref, ref, watch } from "vue";
import { Config } from ".";
import { observeMutation } from "../utils/observer";
import ConfigHandler from "./configHandler";
import { getConfig } from "../utils/config";
import HandlerPublisher from "./HandlerPublisher";
import { insertToListEmpty } from "../utils/events/emitEvents";
import useDroppable from "./useDroppable";

/**
 * Create the parent element of the draggable children and all the drag and drop events and styles.
 *
 * @template T - Type of the items.
 * @param items - List of data to drag and drop.
 * @param config - Configuration of drag and drop tool.
 * @returns The reference of the parent element and function to remove an element.
 */
const handlerPublisher = new HandlerPublisher()
export default function useDragAndDrop<T>(items: Ref<T[]>, config?: Config<T>) {
  const parent = ref<HTMLElement | undefined>();
  let removeAtFromElements = [] as ((index: number) => void)[];
  let insertAtFromElements = [] as ((index: number, value: T) => void)[];

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
  const getOnLegth = (items: Ref<T[]>) => {
    return () => {
      return getLength(items);
    };
  };
  function getOnValue(items: Ref<T[]>){
    return (index:number) =>{
      return getValue(items, index)
    }
  }
  const onRemoveAtEvent = getOnRemoveAtEvent(items);
  const onInsertEvent = getOnInsertEventOnList(items);
  const onGetLegth = getOnLegth(items);
  const onGetValue = getOnValue(items);
  const coreConfig = getConfig(onRemoveAtEvent, onInsertEvent, onGetLegth, onGetValue, config)
  
  function removeAt(index: number) {
    for (const removeAtFromElement of removeAtFromElements) {
      removeAtFromElement(index);
    }
  }
  function insertAt(index: number,  value: T) {
    const listLegth = coreConfig.onGetLegth()
    if (listLegth === 0) {
      insertToListEmpty(coreConfig, parent.value ,index, value)
    }
    else{
      for (const insertAtFromElement of insertAtFromElements) {
        insertAtFromElement(index, value);
      }
    }
  }
  const makeChildrensDraggable = () => {
    const [ removeAtFromElementList, insertAtFromElementList ] = useDroppable(coreConfig, handlerPublisher, parent.value)
    removeAtFromElements = removeAtFromElementList;
    insertAtFromElements = insertAtFromElementList;
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
        coreConfig
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
  return { parent, removeAt, insertAt };
}
