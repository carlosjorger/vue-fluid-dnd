import mitt from "mitt";
type Events = {
  drag: {
    height: number;
    width: number;
    draggableIdEvent: string;
    droppableId?: string;
  };
  startDrop: {
    height: number;
    width: number;
    draggableIdEvent: string;
    droppableId?: string;
    sourceIndex: number;
    targetIndex: number;
    element: HTMLElement;
    sourceElementTranlation: {
      height: number;
      width: number;
    };
  };
  drop: {
    droppableId?: string;
  };
  startDrag: {
    height: number;
    width: number;
    draggableIdEvent: string;
    droppableId?: string;
  };
};
export default mitt<Events>();
