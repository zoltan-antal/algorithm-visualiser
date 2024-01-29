const insertionSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps = [];

  for (let i = 1; i < n; i++) {
    const key = sorted[i];
    let j = i - 1;
    while (j >= 0 && sorted[j] > key) {
      sorted[j + 1] = sorted[j];
      steps.push([...sorted]);
      j--;
    }
    sorted[j + 1] = key;
    steps.push([...sorted]);
  }

  return steps;
};

insertionSort.algorithmName = 'insertionSort';

export default insertionSort;
