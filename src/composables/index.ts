export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical";
/**
 * The direction of the list to sort.
 * @public
 */
export type Direction = typeof HORIZONTAL | typeof VERTICAL;
/**
 * Configuration of the drag and drop.
 * @public
 */
export interface Config {
  /**
   * The direction of the list to sort.
   */
  direction?: Direction;
  /**
   * The CSS selector of the drag handler element inside of the draggable element.
   */
  handlerSelector?: string;
  /**
   * A function that returns whether a given element of the list is draggable
   */
  isDraggable?: (element: HTMLElement) => boolean;
  /**
   * Name of the group of the share droppables
   */
  droppableGroup?: string;
}

export type CoreConfig = {
  /**
   * The direction of the list to sort.
   */
  direction: Direction;
  /**
   * The CSS selector of the drag handler element inside of the draggable element.
   */
  handlerSelector: string;
  /**
   * A function that returns whether a given element of the list is draggable
   */
  isDraggable: (element: HTMLElement) => boolean;
  /**
   * Name of the group of the share droppables
   */
  droppableGroup?: string;
};
