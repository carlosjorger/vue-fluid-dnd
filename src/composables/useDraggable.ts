import { getScroll } from "../utils/GetStyles";
import {
  AddCssStylesToElement,
  assignDraggingEvent,
  convetEventToDragMouseTouchEvent,
  moveTranslate,
  setEventWithInterval,
  setTranistion,
} from "../utils/SetStyles";
import { useTransform } from "../utils/SetTransform";
import { DragMouseTouchEvent, MoveEvent, OnLeaveEvent } from "../../index";
import { Ref, ref, watch } from "vue";
import { CoreConfig, DragStartEventData } from ".";
import useEmitEvents from "../utils/events/emitEvents";
import { DRAG_EVENT, draggableTargetTimingFunction, DraggingState, START_DRAG_EVENT, START_DROP_EVENT } from "../utils";
import ConfigHandler, { DroppableConfig } from "./configHandler";
import { isTouchEvent } from "../utils/touchDevice";
import { addTempChild, addTempChildOnInsert, removeTempChildrens } from "../utils/tempChildren";
import { useConfig } from "../utils/useConfig";
import {
  getClassesList,
  getClassesSelector,
} from "../utils/dom/classList";
import { DRAGGABLE_CLASS, DRAGGING_CLASS, DRAGGING_HANDLER_CLASS, DROPPING_CLASS, GRAB_CLASS, GRABBING_CLASS, HANDLER_CLASS } from "../utils/classes";
import HandlerPublisher from "./HandlerPublisher";

const DROPPABLE_CLASS = "droppable";

export default function useDraggable<T>(
  child: HTMLElement | undefined,
  index: number,
  config: CoreConfig<T>,
  parent: HTMLElement,
  handlerPublisher: HandlerPublisher
) {
  const {
    handlerSelector,
    isDraggable,
    droppableGroup,
    animationDuration,
    delayBeforeRemove,
    draggingClass,
    removingClass,
    onRemoveAtEvent,
    droppableClass,
    onDragStart,
  } = config;

  const droppableGroupClass = getClassesList(droppableGroup)
    .map((classGroup) => `droppable-group-${classGroup}`)
    .join(" ");
  const draggingState = ref<DraggingState>(DraggingState.NOT_DRAGGING);
  const childRef = ref(child);
  const scroll = ref({ scrollLeft: 0, scrollTop: 0 });
  const windowScroll = ref({
    scrollX: 0,
    scrollY: 0,
  });
  const pagePosition = ref({ pageX: 0, pageY: 0 });

  const fixedWidth = ref("");
  const fixedHeight = ref("");

  const delayTimeout = ref<NodeJS.Timeout>();
  const { setTransform, updateTransformState } = useTransform(
    childRef
  );
  const {
    emitEventToSiblings,
    emitRemoveEventToSiblings,
    emitInsertEventToSiblings,
    emitFinishRemoveEventToSiblings,
    toggleDraggingClass,
  } = useEmitEvents<T>(
    config,
    draggingState,
    fixedHeight,
    fixedWidth,
    index,
    parent,
    droppableGroupClass,
    handlerPublisher
  );
  const setDraggable = () => {
    if (childRef.value) {
      childRef.value.classList.add(DRAGGABLE_CLASS);
    }
  };
  function addHandlerClass(handlerElement:Element| HTMLElement){
    handlerElement.classList.add(HANDLER_CLASS)
    handlerPublisher.addSubscriber(handlerElement)
  }
  const setHandlerStyles = () => {
    if (childRef.value && isDraggable(childRef.value)) {
      const handlerElement = childRef.value.querySelector(handlerSelector);
      if (handlerElement) {
        addHandlerClass(handlerElement)
      } else {
        addHandlerClass(childRef.value)
      }
    }
  };
  
  const setCssStyles = () => {
    AddCssStylesToElement(document.body, [
      `.${DRAGGABLE_CLASS} { touch-action: manipulation; user-select: none; box-sizing: border-box !important; -webkit-user-select: none; }`,
      `.${HANDLER_CLASS} { pointer-events: auto !important; }`,
      `.${GRAB_CLASS} { cursor: grab; }`,
      ".temp-child { touch-action: none; pointer-events: none; box-sizing: border-box !important; }",
      `.droppable { box-sizing: border-box !important; }`,
      `.${DRAGGING_CLASS} { position: fixed; z-index: 5000; width: var(--fixedWidth) !important; height: var(--fixedHeight) !important; }`,
      `.${DRAGGING_HANDLER_CLASS} { pointer-events: none !important; }`,
      `.${DROPPING_CLASS} { pointer-events: none !important; }`,
      `.${GRABBING_CLASS} { cursor: grabbing; }`,
      `.disable-transition { transition: none !important; }`,
    ]);
    setHandlerStyles();
    setDraggable();
  };
  function getHandler(element: HTMLElement | undefined){
    const handler = element?.querySelector(`.${HANDLER_CLASS}`)
    const handlerParent = handler?.parentElement
    if (handler && handlerParent 
        && handlerParent.classList.contains(DROPPABLE_CLASS) 
        && !handlerParent.isSameNode(parent)) {
      return null
    }
    return handler
  }
  const setSlotRefElementParams = (element: HTMLElement | undefined) => {
    const handlerElement = (getHandler(element) ?? element) as HTMLElement;
    if (handlerElement && element && isDraggable(element)) {
      assignDraggingEvent(
        handlerElement,
        "onmousedown",
        onmousedown("mousemove", "mouseup")
      );
      assignDraggingEvent(
        handlerElement,
        "ontouchstart",
        onmousedown("touchmove", "touchend")
      );
      disableMousedownEventFromImages(handlerElement);
    }
    if (element && !element?.isSameNode(handlerElement)) {
      assignDraggingEvent(element, "onmousedown", mousedownOnDraggablefunction);
    }
    parent.classList.add(DROPPABLE_CLASS);
  };
  function disableMousedownEventFromImages(handlerElement: Element) {
    // Avoid dragging inner images
    const images = handlerElement.querySelectorAll("img");
    Array.from(images).forEach((image) => {
      image.onmousedown = () => false;
    });
  }
  const setTransformDragEvent = () => {
    const element = childRef.value as HTMLElement;
    if (pagePosition.value.pageX == 0 && pagePosition.value.pageY == 0) {
      return;
    }
    if (!currentDroppableConfig.value) {
      return;
    }
    const { droppable, config } = currentDroppableConfig.value;
    setTransform(element, droppable, pagePosition, config.direction);
    emitEventToSiblings(
      element,
      DRAG_EVENT,
      windowScroll.value,
      currentDroppableConfig.value
    );
  };
  const { updateConfig, currentDroppableConfig, initialDroppableConfig ,getCurrentConfig, isOutsideOfDroppable } =
    useConfig<T>(childRef, droppableGroupClass, parent, setTransformDragEvent);
  function toggleDroppableClass(isOutside:boolean){
    if (!currentDroppableConfig.value) {
      return
    }
    const droppables = droppableGroupClass? Array.from(
      document.querySelectorAll(getClassesSelector(droppableGroupClass))
    ):[parent];
    for (const droppable of droppables) {
        droppable
          .classList
            .toggle(droppableClass, 
                    !isOutside && droppable.isSameNode(currentDroppableConfig.value.droppable))
    }
  }
  const onmousemove = function (event: DragMouseTouchEvent) {
    updateConfig(event);
    const currentElement = childRef.value;
    if (!currentElement) {
      return;
    }
    const isOutside = isOutsideOfDroppable(event)
    toggleDroppableClass(isOutside)
    if (draggingState.value === DraggingState.START_DRAGGING) {
      startDragging(event);
    } else if (draggingState.value === DraggingState.DRAGING) {
      updateTempChildren(isOutside);
      setTransformEvent(event);
    }
  };
  const updateTempChildren = (isOutside: boolean = true) => {
    if (!currentDroppableConfig.value) {
      return;
    }
    const { droppable } = currentDroppableConfig.value;
    removeTempChildrens(
      droppable,
      parent,
      droppableGroupClass,
      animationDuration,
      isOutside
    );
    if (isOutside) {
      return
    }
    addTempChild(
      childRef.value,
      parent,
      draggingState.value,
      currentDroppableConfig.value
    );
  };
  const handlerMousemove = (event: MouseEvent | TouchEvent) => {
    if (isTouchEvent(event) && event.cancelable) {
      event.preventDefault();
    } else if (isTouchEvent(event)) {
      return;
    }
    const eventToDragMouse = convetEventToDragMouseTouchEvent(event);
    onmousemove(eventToDragMouse);
  };
  const addTouchDeviceDelay = (event: MoveEvent, callback: () => void) => {
    if (event == "touchmove") {
      delayTimeout.value = setTimeout(() => {
        callback();
      }, 200);
    } else {
      callback();
    }
  };
  function clickOnChildDraggable(event: DragMouseTouchEvent, element: HTMLElement | undefined){
    const {clientX, clientY} = event
    const elementBelow = document.elementFromPoint(clientX, clientY)
    const draggableAncestor = elementBelow?.closest(`.${DRAGGABLE_CLASS}`)
    
    if (!elementBelow|| !element) {
      return false
    }
    if (!draggableAncestor) {
      return false
    }
    if (element.isSameNode(draggableAncestor)) {
      return false
    }
    return true
  }
  function getDragStartEventData(element?: Element) : DragStartEventData<T>|undefined{
    if (!element) {
      return;
    }
    const value = config.onGetValue(index)
    return ({ index, element, value})
  }
  const onmousedown = (moveEvent: MoveEvent, onLeaveEvent: OnLeaveEvent) => {
    return (event: DragMouseTouchEvent) => {
      const element = childRef.value;
      if(clickOnChildDraggable(event, element)){
        return
      }
      ConfigHandler.updateScrolls(parent, droppableGroupClass);
      const { scrollX, scrollY } = window;
      windowScroll.value = { scrollX, scrollY };
      if (draggingState.value === DraggingState.NOT_DRAGGING) {
        draggingState.value = DraggingState.START_DRAGGING;
        const data = getDragStartEventData(element)
        data && onDragStart(data)
        addTouchDeviceDelay(moveEvent, () => {
          if (moveEvent == 'touchmove') {
            updateConfig(event);
            toggleDroppableClass(isOutsideOfDroppable(event))
            startDragging(event)
          }
          document.addEventListener(moveEvent, handlerMousemove, {
            passive: false,
          });
        });
        makeScrollEventOnDroppable(parent);
        if (element) {
          document.addEventListener(onLeaveEvent, onLeave(moveEvent), {
            once: true,
          });
        }
      }
    };
  };
  function mousedownOnDraggablefunction(event: DragMouseTouchEvent) {
    updateConfig(event);
  }
  const onLeave = (moveEvent: MoveEvent) => {
    return (event: MouseEvent | TouchEvent) => {
      toggleDroppableClass(true);
      const convertedEvent = convetEventToDragMouseTouchEvent(event);
      clearTimeout(delayTimeout.value);
      onDropDraggingEvent(isOutsideOfDroppable(convertedEvent, false));
      document.removeEventListener(moveEvent, handlerMousemove);
      updateConfig(convertedEvent);
      const currentConfig = getCurrentConfig(convertedEvent);
      if (currentConfig) {
        const { droppable } = currentConfig;
        removeOnScrollEvents(droppable);
      }
      parent.onscroll = null;
    };
  };
  const removeOnScrollEvents = (droppable: HTMLElement) => {
    droppable.onscroll = null;
    if (!droppableGroupClass) {
      return;
    }
    const droppables = Array.from(
      document.querySelectorAll(getClassesSelector(droppableGroupClass))
    );
    for (const droppable of droppables) {
      if (droppable instanceof HTMLElement) {
        droppable.onscroll = null;
      }
    }
  };
  const startDragging = (event: DragMouseTouchEvent) => {
    addTempChild(
      childRef.value,
      parent,
      draggingState.value,
      currentDroppableConfig.value
    );
    const element = childRef.value;
    if (!element) {
      return;
    }
    updateDraggingStateBeforeDragging();
    emitEventToSiblings(
      element,
      START_DRAG_EVENT,
      windowScroll.value,
      currentDroppableConfig.value
    );
    updateTransformState(event, element);
    setDraggingStyles(element);
  };
  const updateDraggingStateBeforeDragging = () => {
    scroll.value = getScroll(parent);
    draggingState.value = DraggingState.DRAGING;
  };
  const setTransformEvent = (event: DragMouseTouchEvent) => {
    const { pageX, pageY } = event;
    pagePosition.value = { pageX, pageY };
    setTransformDragEvent();
  };
  const makeScrollEventOnDroppable = (droppable: Element) => {
    setEventWithInterval(droppable, "onscroll", onScrollEvent);
  };
  const onScrollEvent = () => {
    setTransformDragEvent();
  };
  const onDropDraggingEvent = (isOutsideAllDroppables: boolean) => {
    if (draggingState.value !== DraggingState.DRAGING) {
      draggingState.value = DraggingState.NOT_DRAGGING;
      return;
    }
    draggingState.value = DraggingState.END_DRAGGING;
    const element = childRef.value as HTMLElement;
    if (!element) {
      return;
    }
    removeDraggingStyles(element);
    
    emitEventToSiblings(
      element,
      START_DROP_EVENT,
      windowScroll.value,
      isOutsideAllDroppables? initialDroppableConfig.value: currentDroppableConfig.value,
      index
    );
  };
  const removeDraggingStyles = (element: Element) => {
    setTranistion(element, animationDuration, draggableTargetTimingFunction);
    moveTranslate(element, 0, 0);
  };
  const setDraggingStyles = (element: HTMLElement) => {
    const { height, width } = element.getBoundingClientRect();
    fixedHeight.value = `${height}px`;
    fixedWidth.value = `${width}px`;
    toggleDraggingClass(element, true);
    element.classList.toggle(draggingClass,true);
    element.style.transition = "";
  };

  const createWatchOfStyle = (fixedSize: Ref<string>, fixedProp: string) => {
    watch(fixedSize, (newFixedSize: string) => {
      const childElement = childRef.value;
      if (childElement) {
        childElement.style.setProperty(fixedProp, newFixedSize);
      }
    });
  };
  const changeDroppable = (
    newdDroppableConfig: DroppableConfig<T> | undefined,
    oldDroppableConfig: DroppableConfig<T> | undefined
  ) => {
    if (
      childRef.value &&
      oldDroppableConfig &&
      draggingState.value == DraggingState.DRAGING &&
      !newdDroppableConfig?.droppable.isSameNode(oldDroppableConfig.droppable)
    ) {
      emitEventToSiblings(
        childRef.value,
        DRAG_EVENT,
        windowScroll.value,
        oldDroppableConfig
      );
    }
  };

  function removeAtFromElement(targetIndex: number) {
    const element = childRef.value as HTMLElement;
    if (!currentDroppableConfig.value) {
      return;
    }
    const config = currentDroppableConfig.value as DroppableConfig<T>;

    if (targetIndex == index && child) {
      element.classList.add(removingClass);
      setTimeout(() => {
        onRemoveAtEvent(index);
        element.classList.remove(removingClass);
        addTempChild(
          element,
          parent,
          draggingState.value,
          currentDroppableConfig.value
        );
        emitRemoveEventToSiblings(
          targetIndex,
          element,
          config,
          (sibling: HTMLElement) => {
            removeDraggingStyles(sibling);
            emitFinishRemoveEventToSiblings(element);
          }
        );
      }, delayBeforeRemove);
    }
  }
  function insertAtFromElement(targetIndex: number, value: T) {
    const element = childRef.value as HTMLElement;
    if (targetIndex === index || targetIndex === config.onGetLegth() && index === targetIndex-1) {
      emitInsertEventToSiblings(targetIndex, element, parent, value,
         () => {
          addTempChildOnInsert(
            element,
            draggingState.value,
            initialDroppableConfig.value
          );
        }
      )
    }
  }
  watch(currentDroppableConfig, changeDroppable, { deep: true });
  createWatchOfStyle(fixedWidth, "--fixedWidth");
  createWatchOfStyle(fixedHeight, "--fixedHeight");
  setCssStyles();
  setSlotRefElementParams(childRef.value);
  return { removeAtFromElement, insertAtFromElement };
}

// TODO: use semantic-realese https://medium.comr/@davidkelley87/using-semantic-release-for-npm-libraries-with-github-actions-234461235fa7
//https://github.com/iamstevendao/vue-tel-input/blob/main/.github/workflows/deploy.yml
// TODO: add warning on docs with tranform animation