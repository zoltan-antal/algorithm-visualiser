// STANDARD ALGORITHM

const quickSort = (unsorted: number[]) => {
  const sorted = [...unsorted];

  const partition = (arr: number[], start: number, end: number) => {
    let p = Math.floor(Math.random() * (end - start + 1)) + start;
    [arr[p], arr[start]] = [arr[start], arr[p]];
    p = start;

    let i = start + 1;
    for (let j = start + 1; j <= end; j++) {
      if (arr[j] < arr[p]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    [arr[p], arr[i - 1]] = [arr[i - 1], arr[p]];
    return i - 1;
  };

  const quickSortInPlace = (
    arr: number[],
    start: number = 0,
    end: number = arr.length - 1
  ) => {
    if (start >= end) {
      return;
    }
    const partitionIndex = partition(arr, start, end);
    quickSortInPlace(arr, start, partitionIndex - 1);
    quickSortInPlace(arr, partitionIndex + 1, end);
  };

  quickSortInPlace(sorted);
  return sorted;
};

export default quickSort;
