import mitt, { Emitter } from "mitt";
import { onUnmounted } from "vue";
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

type EventHandlers<T extends Record<string, unknown>> = {
  [K in keyof T]: (event: T[K]) => void;
};

function useMittEvents<T extends Record<string, unknown>>(
  mitt: Emitter<T>,
  handlers: EventHandlers<T>
) {
  for (const key of Object.keys(handlers)) {
    mitt.on(key, handlers[key]);
  }
  function cleanup() {
    for (const key of Object.keys(handlers)) {
      mitt.off(key, handlers[key]);
    }
  }
  onUnmounted(cleanup);
  return cleanup;
}

function wrapEventBus<T extends Record<string, unknown>>(mitt: Emitter<T>) {
  return (ev: EventHandlers<T>) => useMittEvents(mitt, ev);
}

export const eventBus = mitt<Events>();
export const useMyEvents = wrapEventBus(eventBus);
