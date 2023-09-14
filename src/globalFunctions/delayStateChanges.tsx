export const delayStateChange = (cb: () => void) => {
  setTimeout(cb, 2000);
};
