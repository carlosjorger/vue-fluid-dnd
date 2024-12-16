import {
  Config,
  CoreConfig,
  OnInsertEvent,
  OnRemoveAtEvent,
  VERTICAL,
} from "../composables";

export const getConfig = <T>(
  onRemoveAtEvent: OnRemoveAtEvent<T>,
  onInsertEvent: OnInsertEvent<T>,
  config?: Config
): CoreConfig<T> => {
  const DEFAULT_CONFIG = {
    direction: VERTICAL,
    handlerSelector: "draggable",
    draggingClass: "dragging",
    removingClass: "removing",
    isDraggable: () => true,
    onRemoveAtEvent,
    onInsertEvent,
    animationDuration: 200,
    delayBeforeRemove: 200,
    droppableClass:'droppable-hover'
  } as CoreConfig<T>;
  if (!config) {
    return DEFAULT_CONFIG;
  }

  return {
    direction: config.direction ?? DEFAULT_CONFIG.direction,
    handlerSelector: config.handlerSelector ?? DEFAULT_CONFIG.handlerSelector,
    draggingClass: config.draggingClass ?? DEFAULT_CONFIG.draggingClass,
    droppableClass: config.droppableClass ?? DEFAULT_CONFIG.droppableClass,
    isDraggable: config.isDraggable ?? DEFAULT_CONFIG.isDraggable,
    droppableGroup: config.droppableGroup,
    onRemoveAtEvent,
    onInsertEvent,
    animationDuration: DEFAULT_CONFIG.animationDuration,
    removingClass: config.removingClass ?? DEFAULT_CONFIG.removingClass,
    delayBeforeRemove:
      config.delayBeforeRemove ?? DEFAULT_CONFIG.delayBeforeRemove,
  };
};
