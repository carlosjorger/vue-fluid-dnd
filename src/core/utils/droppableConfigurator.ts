import ConfigHandler, { DroppableConfig } from "../configHandler";
import { DragMouseTouchEvent } from "../../../index";
import { draggableIsOutside } from "./GetStyles";
import { IsHTMLElement } from "./touchDevice";
import { setEventWithInterval } from "./SetStyles";
import { getClassesSelector } from "./dom/classList";

export class DroppableConfigurator<T>{
  initial: DroppableConfig<any> | undefined;
  current: DroppableConfig<T> | undefined;
  private parent: HTMLElement;
  private childRef: HTMLElement | undefined;
  private droppableGroupClass: string | null;
  private setTransformDragEvent: () => void;
  private changeDroppable: (newdDroppableConfig: DroppableConfig<T> | undefined, oldDroppableConfig: DroppableConfig<T> | undefined) => void

  constructor(
    childRef: HTMLElement | undefined,
    droppableGroupClass: string | null,
    parent: HTMLElement,
    setTransformDragEvent: () => void,
    changeDroppable: (newdDroppableConfig: DroppableConfig<T> | undefined, oldDroppableConfig: DroppableConfig<T> | undefined) => void) {
    this.parent = parent;
    this.childRef = childRef;
    this.droppableGroupClass = droppableGroupClass;
    this.setTransformDragEvent = setTransformDragEvent;
    this.initial = parent? ConfigHandler.getConfig(parent): undefined;
    this.changeDroppable = changeDroppable
  }
  private getDraggableAncestor(
    clientX: number,
    clientY: number,
    draggable: Element | null
  ) {
    return document
      .elementsFromPoint(clientX, clientY)
      .filter((element) => !element.isSameNode(draggable));
  }
  private getElementBelow(
    currentElement: HTMLElement,
    event: DragMouseTouchEvent,
    hiddenDraggable: boolean = true){
      function getElementBelow(config: DroppableConfigurator<T>){
        const [elementBelow] = config.getDraggableAncestor(
          event.clientX,
          event.clientY,
          currentElement
        );
        return elementBelow
      }
      let elementBelow = null
      if (hiddenDraggable) {
        currentElement.hidden = true;
        elementBelow = getElementBelow(this)
        currentElement.hidden = false;
      }
      else{
        elementBelow = getElementBelow(this)
      }
      return elementBelow
  }
  private getCurrentDroppable(
    currentElement: HTMLElement,
    event: DragMouseTouchEvent,
    hiddenDraggable: boolean = true
  ) {
    const elementBelow = this.getElementBelow(currentElement, event, hiddenDraggable)
    if (!this.droppableGroupClass || !elementBelow) {
      return;
    }
    const currentDroppable = elementBelow.closest(
      getClassesSelector(this.droppableGroupClass)
    );
    return currentDroppable;
  }
  private isOutsideOfAllDroppables(currentElement: HTMLElement) {
    const droppables = this.droppableGroupClass? Array.from(
      document.querySelectorAll(getClassesSelector(this.droppableGroupClass))
    ):[this.parent];
    return droppables.every((droppable) =>
      draggableIsOutside(currentElement, droppable)
    );
  }
  private isNotInsideAnotherDroppable(
    currentElement: HTMLElement,
    droppable: HTMLElement
  ) {
    const isOutside = draggableIsOutside(currentElement, droppable);
    return !isOutside || this.isOutsideOfAllDroppables(currentElement);
  }
  private onScrollEvent() {
    this.setTransformDragEvent();
  };
  private makeScrollEventOnDroppable(droppable: Element) {
    setEventWithInterval(droppable, "onscroll",()=> { this.onScrollEvent() });
  }
  getCurrentConfig(event: DragMouseTouchEvent) {
    const currentElement = this.childRef;
    if (!currentElement) {
      return;
    }
    if (
      this.current &&
      this.isNotInsideAnotherDroppable(
        currentElement,
        this.current?.droppable
      )
    ) {
      return this.current;
    }
    const currentDroppable = this.getCurrentDroppable(currentElement, event);
    if (!currentDroppable) {
      return ConfigHandler.getConfig(this.parent);
    }
    if (IsHTMLElement(currentDroppable) && !currentDroppable.onscroll) {
      this.makeScrollEventOnDroppable(currentDroppable);
    }
    return ConfigHandler.getConfig(currentDroppable);
  }
  updateConfig(event: DragMouseTouchEvent) {
    const oldDroppableConfig = this.current;
    this.current = this.getCurrentConfig(event);
    this.changeDroppable(this.current, oldDroppableConfig)
  }
  isOutsideOfDroppable(event: DragMouseTouchEvent, hiddenDraggable: boolean = true){
    const currentElement = this.childRef;
    if (!currentElement) {
      return true;
    }
    return !Boolean(this.getCurrentDroppable(currentElement, event, hiddenDraggable))
  }
}
