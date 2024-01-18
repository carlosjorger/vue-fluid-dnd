import { ref } from "vue";
export function useDrag(
  typeOfDrag: string,
  save: () => void,
  onDropChange: (id: string) => void
) {
  const markedSection = ref("");
  const IdAttr = `${typeOfDrag}ID`;
  const dragging = ref(false);
  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    console.log(event);
  };
  const onDragEnter = (
    event: DragEvent,
    draggableId: string,
    enableDrag: boolean
  ) => {
    event.preventDefault();
    if (!enableDrag) {
      return;
    }
    const eventDataTransfer = event.dataTransfer;
    if (eventDataTransfer) {
      eventDataTransfer.dropEffect = "move";
      eventDataTransfer.effectAllowed = "move";
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
    dragging.value = true;
    event.stopPropagation();
    const eventDataTransfer = event.dataTransfer;
    if (eventDataTransfer) {
      eventDataTransfer.dropEffect = "move";
      eventDataTransfer.effectAllowed = "move";
      eventDataTransfer.setData(IdAttr, draggableId);
    }
    (event.target as HTMLElement).style.opacity = "1";
    (event.target as HTMLElement).classList.add("dragging");
  };
  const dragEnd = (event: DragEvent) => {
    dragging.value = false;
    (event.target as HTMLElement).classList.remove("dragging");
  };
  return {
    onDragEnter,
    onDragOver,
    onDrop,
    startDrag,
    dragEnd,
    markedSection,
    dragging,
  };
}
