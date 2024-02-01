import AlgorithmState from '../types/AlgorithmState';

const heapSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps: AlgorithmState[] = [];

  let start = Math.floor(n / 2);
  let end = n;

  while (end > 1) {
    if (start > 0) {
      start--;
    } else {
      end--;
      [sorted[0], sorted[end]] = [sorted[end], sorted[0]];
      steps.push({ array: [...sorted], highlights: [start, end] });
    }

    let root = start;
    while (root * 2 + 1 < end) {
      let child = root * 2 + 1;
      if (child + 1 < end && sorted[child + 1] > sorted[child]) {
        child++;
      }
      steps.push({
        array: [...sorted],
        highlights: [start, end - 1, root, child],
      });
      if (sorted[root] < sorted[child]) {
        [sorted[root], sorted[child]] = [sorted[child], sorted[root]];
        root = child;
      } else {
        break;
      }
    }
  }

  steps.push({ array: [...sorted], highlights: [] });
  return steps;
};

heapSort.algorithmName = 'heapSort';
heapSort.displayName = 'Heap sort';

export default heapSort;
