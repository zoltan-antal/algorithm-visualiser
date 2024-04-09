import AlgorithmState from '../types/AlgorithmState';

const quickSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const steps: AlgorithmState[] = [{ array: [...unsorted], highlights: [] }];

  // Partition sub-routine for rearranging elements around a random pivot
  const partition = (arr: number[], start: number, end: number) => {
    // Randomly choose pivot
    let p = Math.floor(Math.random() * (end - start + 1)) + start;

    // Arranging elements around pivot using Dutch national flag partitioning
    let [left, right] = [start, end];
    let i = start;
    while (left < right && i <= right) {
      steps.push({
        array: [...arr],
        highlights: [left, right, i, p, start, end],
      });
      if (arr[i] < arr[p]) {
        [arr[i], arr[left]] = [arr[left], arr[i]];
        if (p === left) {
          p = i;
        }
        left++;
        i++;
      } else if (arr[i] > arr[p]) {
        [arr[i], arr[right]] = [arr[right], arr[i]];
        if (p === right) {
          p = i;
        }
        right--;
      } else {
        i++;
      }
    }
    return p;
  };

  // Recursive in-place sorting function
  const quickSortInPlace = (
    arr: number[],
    start: number = 0,
    end: number = arr.length - 1
  ) => {
    // Base case: if the partition size is 1 or less, no sorting is required
    if (end <= start) {
      if (start === end) {
        steps.push({ array: [...arr], highlights: [start] });
      }
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
