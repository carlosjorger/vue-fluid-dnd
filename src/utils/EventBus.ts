import mitt from "mitt";
type Events = {
  drag: {
    height: number;
    width: number;
    draggableIdEvent: string;
    droppableId: string | undefined;
  };
  startDrop: {
    height: number;
    width: number;
    draggableIdEvent: string;
    droppableId: string | undefined;
    sourceIndex: number;
    targetIndex: number;
    element: HTMLElement;
    sourceElementTranlation: {
      height: number;
      width: number;
    };
  };
  drop: {
    droppableId: string | undefined;
  };
  startDrag: {
    height: number;
    width: number;
    draggableIdEvent: string;
    droppableId: string | undefined;
  };
};
export default mitt<Events>();
