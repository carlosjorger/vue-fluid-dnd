import mitt from "mitt";
type Events = {
  drag: {
    element: HTMLElement;
    height: number;
    width: number;
    draggableIdEvent: string;
  };
  drop: {
    element: HTMLElement;
    height: number;
    width: number;
    draggableIdEvent: string;
  };
  startDrag: {
    element: HTMLElement;
    height: number;
    width: number;
    draggableIdEvent: string;
  };
};
export default mitt<Events>();
