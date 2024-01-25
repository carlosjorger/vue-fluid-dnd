export const setBorderBoxStyle = (element: HTMLElement) => {
  element.style.boxSizing = "border-box";
};
export const fixSizeStyle = (element: HTMLElement | undefined | null) => {
  if (!element) {
    return;
  }
  const { height, width } = element.getBoundingClientRect();

  element.style.height = `${height}px`;
  element.style.width = `${width}px`;
};
export const moveTranslate = (
  element: HTMLElement | undefined | null,
  height: number,
  width: number
) => {
  if (!element) {
    return;
  }
  element.style.transform = `translate(${width}px,${height}px)`;
};

export const assignOnmouseup = (
  element: HTMLElement,
  onmouseupFunc: ((event: MouseEvent) => void) | null
) => {
  element.onmouseup = onmouseupFunc;
};
