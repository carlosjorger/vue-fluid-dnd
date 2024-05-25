import {
  Config,
  CoreConfig,
  OnDropEvent,
  OnInsertEvent,
  OnRemoveAtEvent,
  VERTICAL,
} from "../composables";

export const getConfig = <T>(
  onDrop: OnDropEvent,
  onRemoveAtEvent: OnRemoveAtEvent<T>,
  onInsertEvent: OnInsertEvent<T>,
  config?: Config
): CoreConfig<T> => {
  const DEFAULT_CONFIG = {
    direction: VERTICAL,
    handlerSelector: "draggable",
    isDraggable: () => true,
    onDrop,
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
    isDraggable: config.isDraggable ?? DEFAULT_CONFIG.isDraggable,
    droppableGroup: config.droppableGroup,
    onDrop: DEFAULT_CONFIG.onDrop,
    onRemoveAtEvent,
    onInsertEvent,
    animationDuration: DEFAULT_CONFIG.animationDuration,
  };
};
