export const observeMutation = (
  callback: (observer: MutationObserver, mutation: MutationRecord) => void,
  element: Element,
  options?: MutationObserverInit
) => {
  const observe = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      callback(observe, mutation);
    });
  });
  observe.observe(element, options);
};
