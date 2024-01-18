import { ref } from "vue";
export function useDrag(
  typeOfDrag: string,
  save: () => void,
  onDropChange: (id: string) => void
) {
  const markedSection = ref("");
  const IdAttr = `${typeOfDrag}ID`;

  const onDragEnter = (draggableId: string, enableDrag: boolean) => {
    if (!enableDrag) {
      return;
    }
    markedSection.value = draggableId;
  };
  const onDrop = (event: DragEvent, enableDrag: boolean) => {
    if (!enableDrag) {
      return;
    }
    const eventDataTransfer = event.dataTransfer;
    if (eventDataTransfer) {
      const draggedSectionName = eventDataTransfer.getData(IdAttr);
      onDropChange(draggedSectionName);
      markedSection.value = "";
      save();
    }
  };
  const startDrag = (event: DragEvent, draggableId: string) => {
    event.stopPropagation();
    const eventDataTransfer = event.dataTransfer;
    if (eventDataTransfer) {
      eventDataTransfer.dropEffect = "move";
      eventDataTransfer.effectAllowed = "move";
      eventDataTransfer.setData(IdAttr, draggableId);
    }
    (event.target as HTMLElement).style.opacity = "1";
  };
  return { onDragEnter, onDrop, startDrag, markedSection };
}
