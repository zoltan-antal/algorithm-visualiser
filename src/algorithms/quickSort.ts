import AlgorithmState from '../types/AlgorithmState';

const quickSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const steps: AlgorithmState[] = [{ array: [...unsorted], highlights: [] }];

  // Partition sub-routine for rearranging elements around a random pivot
  const partition = (arr: number[], start: number, end: number) => {
    // Randomly choose pivot and move it to the beginning of the section
    let p = Math.floor(Math.random() * (end - start + 1)) + start;
    steps.push({ array: [...arr], highlights: [p, start, end] });
    [arr[p], arr[start]] = [arr[start], arr[p]];
    p = start;

    // i tracks the boundary between the part with elements less than the pivot
    // and the part with elements greater than the pivot
    let i = start + 1;
    for (let j = start + 1; j <= end; j++) {
      steps.push({ array: [...arr], highlights: [i, j, p, end] });
      // If an element is less than the pivot move it to the first part
      if (arr[j] < arr[p]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    steps.push({ array: [...arr], highlights: [i - 1, p, end] });
    // Insert the pivot to its correct position
    [arr[p], arr[i - 1]] = [arr[i - 1], arr[p]];
    return i - 1;
  };

  // Recursive in-place sorting function
  const quickSortInPlace = (
    arr: number[],
    start: number = 0,
    end: number = arr.length - 1
  ) => {
    // Base case: if the partition size is 1 or less, no sorting is required
    if (end <= start) {
      steps.push({ array: [...arr], highlights: [start] });
      return;
    }
    // Partition the array and get the index of the pivot
    const partitionIndex = partition(arr, start, end);
    // Recusively sort the sub-array on the left and right side of the pivot
    quickSortInPlace(arr, start, partitionIndex - 1);
    quickSortInPlace(arr, partitionIndex + 1, end);
  };

  quickSortInPlace(sorted);

  return steps.slice(1);
};

quickSort.algorithmName = 'quickSort';
quickSort.displayName = 'Quicksort';

export default quickSort;
