export function containstClasses(element: HTMLElement, classes: string) {
  return classes
    .split(" ")
    .filter((cssClass) => cssClass)
    .every((cssClass) => element.classList.contains(cssClass));
}
export function getClassesSelector(classes: string | null) {
  if (!classes) {
    return "";
  }
  const classesSelector = classes
    .split(" ")
    .filter((cssClass) => cssClass)
    .join(".");
  return `.${classesSelector}`;
}
