import { derived } from "svelte/store";
import { Config } from "../core";
import HandlerPublisher from "../core/HandlerPublisher";
// import { VueListCondig } from "./utils/VueListCondig";
import dragAndDrop from "../core/dragAndDrop";
import { SvelteListCondig } from "./utils/SvelteListCondig";
/**
 * Create the parent element of the draggable children and all the drag and drop events and styles.
 *
 * @template T - Type of the items.
 * @param items - List of data to drag and drop.
 * @param config - Configuration of drag and drop tool.
 * @returns The reference of the parent element and function to remove an element.
 */

const handlerPublisher = new HandlerPublisher()
export default function useDragAndDrop<T>( items: T[], config?: Config<T>) {
  const listCondig = new SvelteListCondig(items);
  const [removeAt, insertAt, onChangeParent] = dragAndDrop(listCondig, handlerPublisher, config, 'data-index')
  // watch(parent, () => {
  //   onChangeParent(parent.value);
  // });
  const dragAndDropAction = (parent: HTMLElement) => {
    listCondig.setParent(parent);
    onChangeParent(parent);
    return {
      destroy() {

      }
    }
  }
  return [dragAndDropAction, removeAt, insertAt] as const;
}
