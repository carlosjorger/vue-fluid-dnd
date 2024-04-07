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
export type Config = {
  direction?: Direction;
};
