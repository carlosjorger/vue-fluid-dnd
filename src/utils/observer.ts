export const observeMutation = (
  callback: (observer: MutationObserver) => void,
  element: Element,
  options?: MutationObserverInit
) => {
  const observe = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      callback(observe);
    });
  });
  observe.observe(element, options);
};
