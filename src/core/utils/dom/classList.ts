export const containstClasses = (element: HTMLElement, classes: string) => {
  return getClassesList(classes).every((cssClass) =>
    element.classList.contains(cssClass)
  );
}
export const getClassesSelector = (classes: string | null) => {
  if (!classes) {
    return "";
  }
  const classesSelector = getClassesList(classes).join(".");
  return `.${classesSelector}`;
}
export const addMultipleClasses =(
  element: HTMLElement,
  classes: string | null
) => {
  if (!classes) {
    return;
  }
  const classesList = getClassesList(classes);
  element.classList.add(...classesList);
}
export const getClassesList = (classes: string | null | undefined) => {
  if (!classes) {
    return [];
  }
  return classes.split(" ").filter((cssClass) => cssClass);
}
