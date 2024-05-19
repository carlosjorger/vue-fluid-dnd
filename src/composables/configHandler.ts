import { ElementScroll } from "../../index";
import { CoreConfig } from ".";
import { getScrollElement } from "../utils/GetStyles";

export type DroppableConfig<T> = {
  droppable: HTMLElement;
  config: CoreConfig<T>;
  droppableScroll: ElementScroll;
};
export default class ConfigHandler {
  static configs = [] as DroppableConfig<any>[];
  static addConfig<T>(droppable: HTMLElement, config: CoreConfig<T>) {
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
