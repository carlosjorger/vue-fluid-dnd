export type Direction = "horizontal" | "vertical";
export type DraggableElement =
  | { index: number; draggableId: string }
  | { index: number };
