import { Config } from ".";
type droppableConfig = {
  droppable: HTMLElement;
  config: Config;
};
export default class ConfigHandler {
  static configs = [] as droppableConfig[];
  static addConfig(droppable: HTMLElement, config: Config) {
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
    return config?.config;
  }
}
