import { ref } from "vue";
import ConfigHandler, { DroppableConfig } from "../composables/configHandler";
import { DragMouseTouchEvent } from "../../index";
import { draggableIsOutside } from "./GetStyles";
import { IsHTMLElement } from "./touchDevice";
import { setEventWithInterval } from "./SetStyles";
import { getClassesSelector } from "./dom/classList";

export function useConfig<T>(
  childRef: HTMLElement | undefined,
  droppableGroupClass: string | null,
  parent: HTMLElement,
  setTransformDragEvent: () => void
) {
  function getDraggableAncestor(
    clientX: number,
    clientY: number,
    draggable: Element | null
  ) {
    return document
      .elementsFromPoint(clientX, clientY)
      .filter((element) => !element.isSameNode(draggable));
  }
  const currentDroppableConfig = ref<DroppableConfig<T>>();
  const initialDroppableConfig = ref<DroppableConfig<T>|undefined>(parent?ConfigHandler.getConfig(parent):undefined);
   function getElementBelow(
    currentElement: HTMLElement,
    event: DragMouseTouchEvent,
    hiddenDraggable: boolean = true){
      function getElementBelow(){
        const [elementBelow] = getDraggableAncestor(
          event.clientX,
          event.clientY,
          currentElement
        );
        return elementBelow
      }
      let elementBelow = null
      if (hiddenDraggable) {
        currentElement.hidden = true;
        elementBelow = getElementBelow()
        currentElement.hidden = false;
      }
      else{
        elementBelow = getElementBelow()
      }
      return elementBelow
   }
  function getCurrentDroppable(
    currentElement: HTMLElement,
    event: DragMouseTouchEvent,
    hiddenDraggable: boolean = true
  ) {
    const elementBelow = getElementBelow(currentElement, event, hiddenDraggable)
    if (!droppableGroupClass || !elementBelow) {
      return;
    }
    const currentDroppable = elementBelow.closest(
      getClassesSelector(droppableGroupClass)
    );
    return currentDroppable;
  }
  function isOutsideOfAllDroppables(currentElement: HTMLElement) {
    const droppables = droppableGroupClass? Array.from(
      document.querySelectorAll(getClassesSelector(droppableGroupClass))
    ):[parent];
    return droppables.every((droppable) =>
      draggableIsOutside(currentElement, droppable)
    );
  }
  function isNotInsideAnotherDroppable(
    currentElement: HTMLElement,
    droppable: HTMLElement
  ) {
    const isOutside = draggableIsOutside(currentElement, droppable);
    return !isOutside || isOutsideOfAllDroppables(currentElement);
  }
  const onScrollEvent = () => {
    setTransformDragEvent();
  };
  function makeScrollEventOnDroppable(droppable: Element) {
    setEventWithInterval(droppable, "onscroll", onScrollEvent);
  }
  function getCurrentConfig(event: DragMouseTouchEvent) {
    const currentElement = childRef;
    if (!currentElement) {
      return;
    }
    if (
      currentDroppableConfig.value &&
      isNotInsideAnotherDroppable(
        currentElement,
        currentDroppableConfig.value?.droppable
      )
    ) {
      return currentDroppableConfig.value;
    }
    const currentDroppable = getCurrentDroppable(currentElement, event);
    if (!currentDroppable) {
      return ConfigHandler.getConfig(parent);
    }
    if (IsHTMLElement(currentDroppable) && !currentDroppable.onscroll) {
      makeScrollEventOnDroppable(currentDroppable);
    }
    return ConfigHandler.getConfig(currentDroppable);
  }
  function updateConfig(event: DragMouseTouchEvent) {
    currentDroppableConfig.value = getCurrentConfig(event);
  }
  function isOutsideOfDroppable(event: DragMouseTouchEvent, hiddenDraggable: boolean = true){
    const currentElement = childRef;
    if (!currentElement) {
      return true;
    }
    return !Boolean(getCurrentDroppable(currentElement, event, hiddenDraggable))
  }
  return { currentDroppableConfig, initialDroppableConfig, updateConfig, getCurrentConfig, isOutsideOfDroppable };
}
