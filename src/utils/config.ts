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
    isDraggable: () => true,
    onRemoveAtEvent,
    onInsertEvent,
    animationDuration: 200,
  } as CoreConfig<T>;
  if (!config) {
    return DEFAULT_CONFIG;
  }

  return {
    direction: config.direction ?? DEFAULT_CONFIG.direction,
    handlerSelector: config.handlerSelector ?? DEFAULT_CONFIG.handlerSelector,
    draggingClass: config.draggingClass ?? DEFAULT_CONFIG.draggingClass,
    isDraggable: config.isDraggable ?? DEFAULT_CONFIG.isDraggable,
    droppableGroup: config.droppableGroup,
    onRemoveAtEvent,
    onInsertEvent,
    animationDuration: DEFAULT_CONFIG.animationDuration,
  };
};
