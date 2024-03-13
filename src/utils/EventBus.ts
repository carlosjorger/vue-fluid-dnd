import mitt, { Emitter } from "mitt";
import { InjectionKey, onUnmounted } from "vue";
type Events = {
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
    draggableIdEvent?: string;
    element: HTMLElement;
  };
};

type EventHandlers<T extends Record<string, unknown>> = {
  [K in keyof T]: (event: T[K]) => void;
};

export function useMittEvents<T extends Record<string, unknown>>(
  mitt: Emitter<T> | undefined,
  handlers: EventHandlers<T>
) {
  if (mitt === undefined) {
    throw new Error("No event bus found within this context");
  }
  for (const key of Object.keys(handlers)) {
    mitt.on(key, handlers[key]);
  }
  function cleanup() {
    for (const key of Object.keys(handlers)) {
      mitt?.off(key, handlers[key]);
    }
  }
  onUnmounted(cleanup);
  return cleanup;
}

export const LocalEventBus: InjectionKey<Emitter<Events>> =
  Symbol("myEventBus");
export const createEventBus = () => {
  return mitt<Events>();
};
