import { getConfig } from "./utils/config";
import { ListCondig } from ".";
import { Config } from ".";
import useDroppable from "./useDroppable";
import HandlerPublisher from "@/core/HandlerPublisher";
import ConfigHandler from "./configHandler";
import { observeMutation } from "./utils/observer";

export default function dragAndDrop<T>(listCondig:ListCondig<T>,handlerPublisher: HandlerPublisher, config?: Config<T>) {
    let removeAtFromElements = [] as ((index: number) => void)[];
    let insertAtFromElements = [] as ((index: number, value: T) => void)[];

    const coreConfig = getConfig(listCondig, config)
      
    function removeAt(index: number) {
    for (const removeAtFromElement of removeAtFromElements) {
        removeAtFromElement(index);
    }
    }
    function insertAt(index: number,  value: T) {
        const listLegth = coreConfig.onGetLegth()
        if (listLegth === 0) {
            listCondig.insertToListEmpty(coreConfig, index, value)
        }
        else{
            for (const insertAtFromElement of insertAtFromElements) {
                insertAtFromElement(index, value);
            }
        }
    }
    const makeChildrensDraggable = (parent: HTMLElement|undefined) => {
        const [ removeAtFromElementList, insertAtFromElementList ] = useDroppable(coreConfig, handlerPublisher, parent)
        removeAtFromElements = removeAtFromElementList;
        insertAtFromElements = insertAtFromElementList;
    };
    function observeChildrens (parent: HTMLElement) {
        observeMutation(
          () => {
            makeChildrensDraggable(parent)
          },
          parent,
          { childList: true }
        );
      };
      function makeDroppable (parent: HTMLElement) {
        parent.classList.add("droppable");
      };
      function addConfigHandler  (parent: HTMLElement) {
        ConfigHandler.addConfig(
          parent,
          coreConfig
        );
      };
      function onChangeParent (parent: HTMLElement | undefined) {
        if (!parent) {
          return;
        }
        makeDroppable(parent);
        addConfigHandler(parent);
        observeChildrens(parent);
        makeChildrensDraggable(parent)
        ConfigHandler.removeObsoleteConfigs();
      }
    return [removeAt, insertAt, onChangeParent] as const
}