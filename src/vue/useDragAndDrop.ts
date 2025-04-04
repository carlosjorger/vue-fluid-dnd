import { Ref, ref, watch } from "vue";
import { Config } from "../core";
import { observeMutation } from "../core/utils/observer";
import ConfigHandler from "../core/configHandler";
import HandlerPublisher from "../core/HandlerPublisher";
import { VueListCondig } from "./utils/VueListCondig";
import dragAndDrop from "../core/dragAndDrop";

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
  var listCondig = new VueListCondig(items, parent)

  const [removeAt, insertAt, makeChildrensDraggable, coreConfig] = dragAndDrop(listCondig, handlerPublisher ,config)
  // TODO: refactor the following code, covert parent.vue to parameter
  const observeChildrens = () => {
    if (!parent.value) {
      return;
    }
    observeMutation(
      () => {
        makeChildrensDraggable(parent.value)
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
    makeChildrensDraggable(parent.value)
    ConfigHandler.removeObsoleteConfigs();
  });
  //#endregion
  return { parent, removeAt, insertAt };
}
