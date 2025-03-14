import { parseIntEmpty } from "../utils/GetStyles";
import { CoreConfig } from ".";
import { addMultipleClasses, getClassesList } from "../utils/dom/classList";
import HandlerPublisher from "./HandlerPublisher";
import useDraggable from "./useDraggable";

function setDroppableGroupClass (droppableGroupClass: string, droppable: HTMLElement) {
    if (droppableGroupClass) {
        addMultipleClasses(droppable, droppableGroupClass);
    }
};
export default function useDroppable<T>(coreConfig: CoreConfig<T>, handlerPublisher: HandlerPublisher, droppable?:HTMLElement){
    const INDEX_ATTR = "index";
    let removeAtFromElementList = [] as  ((targetIndex: number) => void)[];
    let insertAtFromElementList = [] as  ((targetIndex: number, value: T) => void)[];
    const {droppableGroup } = coreConfig
    if (!droppable) {
        return {
            removeAtFromElementList,
            insertAtFromElementList
        }
    }
    const droppableGroupClass = getClassesList(droppableGroup)
        .map((classGroup) => `droppable-group-${classGroup}`)
        .join(" ");
    setDroppableGroupClass(droppableGroupClass, droppable);
    for (const child of droppable.children) {
          const index = child.getAttribute(INDEX_ATTR);
          const numberIndex = parseIntEmpty(index);
          const childHTMLElement = child as HTMLElement;
    
          if (childHTMLElement && numberIndex >= 0) {
            const { removeAtFromElement, insertAtFromElement } = useDraggable(
              childHTMLElement,
              numberIndex,
              coreConfig,
              droppable,
              handlerPublisher
            );
            removeAtFromElementList.push(removeAtFromElement);
            insertAtFromElementList.push(insertAtFromElement);
          }
    }
    return {
        removeAtFromElementList,
        insertAtFromElementList
    }
}