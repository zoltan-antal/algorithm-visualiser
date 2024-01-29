import AlgorithmState from '../types/AlgorithmState';

const insertionSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps: AlgorithmState[] = [];

  for (let i = 1; i < n; i++) {
    const key = sorted[i];
    let j = i - 1;
    while (j >= 0 && sorted[j] > key) {
      sorted[j + 1] = sorted[j];
      steps.push({ array: [...sorted], highlights: [j, j + 1] });
      j--;
    }
    sorted[j + 1] = key;
    steps.push({ array: [...sorted], highlights: [j + 1] });
  }

  steps.push({ array: [...sorted], highlights: [] });
  return steps;
};

insertionSort.algorithmName = 'insertionSort';

export default insertionSort;
