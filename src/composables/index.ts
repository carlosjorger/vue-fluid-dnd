export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical";
export type Direction = typeof HORIZONTAL | typeof VERTICAL;
export type Config = {
  direction?: Direction;
};
