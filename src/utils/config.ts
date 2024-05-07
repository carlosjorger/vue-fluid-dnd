import { DraggableElement } from "index";
import { Config, CoreConfig, VERTICAL } from "../composables";

export const getConfig = (
  onDrop: (source: DraggableElement, destination: DraggableElement) => void,
  config?: Config
): CoreConfig => {
  const DEFAULT_CONFIG = {
    direction: VERTICAL,
    handlerSelector: "draggable",
    isDraggable: () => true,
    onDrop,
  } as CoreConfig;
  if (!config) {
    return DEFAULT_CONFIG;
  }

  return {
    direction: config.direction ?? DEFAULT_CONFIG.direction,
    handlerSelector: config.handlerSelector ?? DEFAULT_CONFIG.handlerSelector,
    isDraggable: config.isDraggable ?? DEFAULT_CONFIG.isDraggable,
    droppableGroup: config.droppableGroup,
    onDrop: DEFAULT_CONFIG.onDrop,
  };
};
