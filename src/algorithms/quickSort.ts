import AlgorithmState from '../types/AlgorithmState';

const quickSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const steps: AlgorithmState[] = [{ array: [...unsorted], highlights: [] }];

  const partition = (arr: number[], start: number, end: number) => {
    let p = Math.floor(Math.random() * (end - start + 1)) + start;
    steps.push({ array: [...arr], highlights: [p, start, end] });
    [arr[p], arr[start]] = [arr[start], arr[p]];
    p = start;

    let i = start + 1;
    for (let j = start + 1; j <= end; j++) {
      steps.push({ array: [...arr], highlights: [i, j, p, end] });
      if (arr[j] < arr[p]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    steps.push({ array: [...arr], highlights: [i - 1, p, end] });
    [arr[p], arr[i - 1]] = [arr[i - 1], arr[p]];
    return i - 1;
  };

  const quickSortInPlace = (
    arr: number[],
    start: number = 0,
    end: number = arr.length - 1
  ) => {
    if (end <= start) {
      steps.push({ array: [...arr], highlights: [start] });
      return;
    }
    const partitionIndex = partition(arr, start, end);
    quickSortInPlace(arr, start, partitionIndex - 1);
    quickSortInPlace(arr, partitionIndex + 1, end);
  };

  quickSortInPlace(sorted);

  steps.push({ array: [...sorted], highlights: [] });
  return steps.slice(1);
};

quickSort.algorithmName = 'quickSort';
quickSort.displayName = 'Quicksort';

export default quickSort;
