import mitt from "mitt";
type Events = {
  drag: { element: HTMLElement; height: number; draggableIdEvent: string };
  drop: { element: HTMLElement; height: number; draggableIdEvent: string };
};
export default mitt<Events>();
