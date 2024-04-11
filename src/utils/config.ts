import { Config, CoreConfig, VERTICAL } from "../composables";

export const getConfig = (config?: Config): CoreConfig => {
  const DEFAULT_CONFIG = {
    direction: VERTICAL,
    handlerClass: "draggable",
    isDraggable: () => true,
  } as CoreConfig;
  if (!config) {
    return DEFAULT_CONFIG;
  }

  return {
    direction: config.direction ?? DEFAULT_CONFIG.direction,
    handlerClass: config.handlerClass ?? DEFAULT_CONFIG.handlerClass,
    isDraggable: config.isDraggable ?? DEFAULT_CONFIG.isDraggable,
  };
};
