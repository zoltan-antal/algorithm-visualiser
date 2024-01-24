const generateArray = (length: number, min: number, max: number) => {
  const arr: number[] = [];
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return arr;
};

export default generateArray;
