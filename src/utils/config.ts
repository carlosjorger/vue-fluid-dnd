import { Config, CoreConfig, VERTICAL } from "../composables";

export const getConfig = (config?: Config): CoreConfig => {
  const DEFAULT_CONFIG = {
    direction: VERTICAL,
    handlerSelector: "draggable",
    isDraggable: () => true,
  } as CoreConfig;
  if (!config) {
    return DEFAULT_CONFIG;
  }

  return {
    direction: config.direction ?? DEFAULT_CONFIG.direction,
    handlerSelector: config.handlerSelector ?? DEFAULT_CONFIG.handlerSelector,
    isDraggable: config.isDraggable ?? DEFAULT_CONFIG.isDraggable,
  };
};
