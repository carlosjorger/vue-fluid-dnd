export type Direction = "horizontal" | "vertical";
export type DraggableElement =
  | { index: number; draggableId: string }
  | { index: number };
export type BeforeMargin = "marginTop" | "marginLeft";
export type AfterMargin = "marginBottom" | "marginRight";
export type GapStyle = "columnGap" | "rowGap";
export type BorderWidth = "borderTopWidth" | "borderLeftWidth";
export type Distance = "width" | "height";
export type Before = "left" | "top";
export type Axis = "x" | "y";
export type Offset = "offsetX" | "offsetY";
export type Scroll = "scrollX" | "scrollY";
export type InnerDistance = "innerWidth" | "innerHeight";
export type Page = "pageX" | "pageY";
