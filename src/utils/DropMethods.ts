import { Ref } from "vue";
// TODO: use an interface instead an concrate class
export const removeAtEventOnList = <T>(list: Ref<T[]>, index: number) => {
  const listValue = list.value;
  if (listValue.length <= 0) {
    return;
  }
  const [deletedItem] = listValue.splice(index, 1);
  return deletedItem;
};
export const onInsertEventOnList = <T>(
  list: Ref<T[]>,
  index: number,
  value: T
) => {
  const listValue = list.value;
  listValue.splice(index, 0, value);
};
export function getLength <T> (list: Ref<T[]>) {
  const listValue = list.value;
  return listValue.length
}
export function getValue <T> (list: Ref<T[]>, index: number) {
  return list.value[index];
}