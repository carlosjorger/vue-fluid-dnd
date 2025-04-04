import { getConfig } from "../utils/config";
import { ListCondig } from ".";
import { Config } from "../composables";
import useDroppable from "../composables/useDroppable";
import HandlerPublisher from "@/composables/HandlerPublisher";

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
    const makeChildrensDraggableByParent = (parent: HTMLElement|undefined) => {
        const [ removeAtFromElementList, insertAtFromElementList ] = useDroppable(coreConfig, handlerPublisher, parent)
        removeAtFromElements = removeAtFromElementList;
        insertAtFromElements = insertAtFromElementList;
    };
    return [removeAt, insertAt, makeChildrensDraggableByParent ,coreConfig] as const
}