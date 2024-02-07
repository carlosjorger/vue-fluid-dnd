export type Direction = "horizontal" | "vertical";
export type DraggableElement =
  | { index: number; draggableId: string }
  | { index: number };
export type BeforeMargin = "marginTop" | "marginLeft";
export type AfterMargin = "marginBottom" | "marginRight";
export type GapStyle = "columnGap" | "rowGap";
export type BorderWidth = "borderTopWidth" | "borderLeftWidth";
