// STANDARD ALGORITHM

const insertionSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;

  for (let i = 1; i < n; i++) {
    const key = sorted[i];
    let j = i - 1;
    while (j >= 0 && sorted[j] > key) {
      sorted[j + 1] = sorted[j];
      j--;
    }
    sorted[j + 1] = key;
  }

  return sorted;
};

export default insertionSort;
