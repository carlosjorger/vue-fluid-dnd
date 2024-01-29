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
  };
  drop: {
    height: number;
    width: number;
    draggableIdEvent: string;
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
