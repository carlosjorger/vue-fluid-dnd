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
export type After = "right" | "down";
export type Axis = "x" | "y";
export type Offset = "offsetX" | "offsetY";
export type Scroll = "scrollX" | "scrollY";
export type InnerDistance = "innerWidth" | "innerHeight";
export type Page = "pageX" | "pageY";
export type DragMouseTouchEvent = {
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly target: EventTarget | null;
  readonly offsetX: number;
  readonly offsetY: number;
};
