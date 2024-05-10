import { CoreConfig } from ".";
// TODO: add droppableScroll
export type DroppableConfig = {
  droppable: HTMLElement;
  config: CoreConfig;
};
export default class ConfigHandler {
  static configs = [] as DroppableConfig[];
  static addConfig(droppable: HTMLElement, config: CoreConfig) {
    const configs = ConfigHandler.configs.filter(
      (configHandler) => !configHandler.droppable.isSameNode(droppable)
    );
    configs.push({
      droppable,
      config,
    });
    ConfigHandler.configs = configs;
  }
  static getConfig(curerntDroppable: Element) {
    const config = ConfigHandler.configs.find(({ droppable }) =>
      droppable.isSameNode(curerntDroppable)
    );
    return config;
  }
}
