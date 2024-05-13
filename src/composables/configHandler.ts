import { ElementScroll } from "../../index";
import { CoreConfig } from ".";
import { getScrollElement } from "../utils/GetStyles";

export type DroppableConfig = {
  droppable: HTMLElement;
  config: CoreConfig;
  droppableScroll: ElementScroll;
};
export default class ConfigHandler {
  static configs = [] as DroppableConfig[];
  static addConfig(droppable: HTMLElement, config: CoreConfig) {
    const configs = ConfigHandler.configs.filter(
      (configHandler) => !configHandler.droppable.isSameNode(droppable)
    );
    const droppableScroll = getScrollElement(droppable);
    configs.push({
      droppable,
      config,
      droppableScroll,
    });
    ConfigHandler.configs = configs;
  }
  static updateScrolls(
    currentDroppable: Element,
    droppableGroupClass: string | null
  ) {
    for (const configHandler of ConfigHandler.configs) {
      const { droppable } = configHandler;
      if (
        (droppableGroupClass &&
          droppable.classList.contains(droppableGroupClass)) ||
        droppable.isSameNode(currentDroppable)
      ) {
        configHandler.droppableScroll = getScrollElement(droppable);
      }
    }
  }
  static getConfig(curerntDroppable: Element) {
    const config = ConfigHandler.configs.find(({ droppable }) =>
      droppable.isSameNode(curerntDroppable)
    );
    return config;
  }
}
