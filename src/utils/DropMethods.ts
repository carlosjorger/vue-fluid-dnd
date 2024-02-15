import { Ref } from "vue";

export const dropDraggingElementsBetween = <T>(
  list: Ref<T[]>,
  source: { index: number },
  destination: { index: number }
) => {
  if (source.index === destination.index) {
    return;
  }
  const listValue = list.value;
  const [reorderedItem] = listValue.splice(source.index, 1);
  listValue.splice(destination.index, 0, reorderedItem);
};
