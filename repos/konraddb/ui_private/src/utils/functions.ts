export const noop = () => {
  // This is intentionally empty
};

export const throttle = (
  callback: (...args: unknown[]) => void,
  delay: number
) => {
  let lastCall = 0;
  return (...args: unknown[]) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }

    lastCall = now;
    return callback(...args);
  };
};

export const debounce = (
  callback: (...args: unknown[]) => void,
  timeout: number
) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
