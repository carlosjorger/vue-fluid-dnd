import { ListCondig } from "../core";
import {
  Config,
  CoreConfig,
  VERTICAL,
} from "../composables";

export const getConfig = <T>(listCondig: ListCondig<T>,
  config?: Config<T>
): CoreConfig<T> => {
  
  const onRemoveAtEvent =(index: number) =>{
    return listCondig.removeAtEvent(index)
  };
  
  const onInsertEvent = (index: number, value: T) =>{
    return listCondig.insertEvent(index, value)
  };
  
  const onGetLegth =()=>{
    return listCondig.getLength()
  };
  
  const onGetValue = (index: number)=> {
    return listCondig.getValue(index)
  };

  const DEFAULT_CONFIG = {
    direction: VERTICAL,
    handlerSelector: "draggable",
    draggingClass: "dragging",
    removingClass: "removing",
    insertingFromClass: 'from-inserting',
    isDraggable: () => true,
    onDragStart: () => {},
    onDragEnd: () => {},
    onRemoveAtEvent,
    onInsertEvent,
    onGetLegth,
    onGetValue,
    animationDuration: 200,
    delayBeforeRemove: 200,
    delayBeforeInsert: 200,
    droppableClass:'droppable-hover'
  } as CoreConfig<T>;
  if (!config) {
    return DEFAULT_CONFIG;
  }

  return {
    direction: config.direction ?? DEFAULT_CONFIG.direction,
    handlerSelector: config.handlerSelector ?? DEFAULT_CONFIG.handlerSelector,
    draggingClass: config.draggingClass ?? DEFAULT_CONFIG.draggingClass,
    droppableClass: config.droppableClass ?? DEFAULT_CONFIG.droppableClass,
    isDraggable: config.isDraggable ?? DEFAULT_CONFIG.isDraggable,
    onDragStart: config.onDragStart ?? DEFAULT_CONFIG.onDragStart,
    onDragEnd: config.onDragEnd ?? DEFAULT_CONFIG.onDragEnd,
    droppableGroup: config.droppableGroup,
    onRemoveAtEvent,
    onInsertEvent,
    onGetLegth,
    onGetValue,
    animationDuration: config.animationDuration ?? DEFAULT_CONFIG.animationDuration,
    removingClass: config.removingClass ?? DEFAULT_CONFIG.removingClass,
    insertingFromClass: config.insertingFromClass ?? DEFAULT_CONFIG.insertingFromClass,
    delayBeforeRemove:
      config.delayBeforeRemove ?? DEFAULT_CONFIG.delayBeforeRemove,
    delayBeforeInsert: 
      config.delayBeforeInsert ?? DEFAULT_CONFIG. delayBeforeInsert
  };
};
