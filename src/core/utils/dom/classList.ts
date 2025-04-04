export function containstClasses(element: HTMLElement, classes: string) {
  return getClassesList(classes).every((cssClass) =>
    element.classList.contains(cssClass)
  );
}
export function getClassesSelector(classes: string | null) {
  if (!classes) {
    return "";
  }
  const classesSelector = getClassesList(classes).join(".");
  return `.${classesSelector}`;
}
export function addMultipleClasses(
  element: HTMLElement,
  classes: string | null
) {
  if (!classes) {
    return;
  }
  const classesList = getClassesList(classes);
  element.classList.add(...classesList);
}
export function getClassesList(classes: string | null | undefined) {
  if (!classes) {
    return [];
  }
  return classes.split(" ").filter((cssClass) => cssClass);
}
