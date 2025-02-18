import {
  Config,
  CoreConfig,
  OnGetLength,
  OnInsertEvent,
  OnRemoveAtEvent,
  VERTICAL,
} from "../composables";

export const getConfig = <T>(
  onRemoveAtEvent: OnRemoveAtEvent<T>,
  onInsertEvent: OnInsertEvent<T>,
  onGetLegth: OnGetLength,
  config?: Config
): CoreConfig<T> => {
  const DEFAULT_CONFIG = {
    direction: VERTICAL,
    handlerSelector: "draggable",
    draggingClass: "dragging",
    removingClass: "removing",
    insertingFromClass: 'from-inserting',
    isDraggable: () => true,
    onRemoveAtEvent,
    onInsertEvent,
    onGetLegth,
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
    onGetLegth,
    animationDuration: DEFAULT_CONFIG.animationDuration,
    removingClass: config.removingClass ?? DEFAULT_CONFIG.removingClass,
    insertingFromClass: config.insertingFromClass ?? DEFAULT_CONFIG.insertingFromClass,
    delayBeforeRemove:
      config.delayBeforeRemove ?? DEFAULT_CONFIG.delayBeforeRemove,
  };
};
