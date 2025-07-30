export const delay = async (delayInMS: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delayInMS);
  });
};
