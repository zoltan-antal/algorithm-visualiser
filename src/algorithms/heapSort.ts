import AlgorithmState from '../types/AlgorithmState';

const heapSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps: AlgorithmState[] = [];

  // Initialise variables for the heap building phase
  let start = Math.floor(n / 2);
  let end = n;

  while (end > 1) {
    // Heap construction
    if (start > 0) {
      start--;
    } /* Heap extraction */ else {
      end--;
      [sorted[0], sorted[end]] = [sorted[end], sorted[0]];
      steps.push({ array: [...sorted], highlights: [start, end] });
    }

    // Heapify
    let root = start;
    while (root * 2 + 1 < end) {
      // Select the child with the larger value
      let child = root * 2 + 1;
      if (child + 1 < end && sorted[child + 1] > sorted[child]) {
        child++;
      }
      steps.push({
        array: [...sorted],
        highlights: [start, end - 1, root, child],
      });
      // Swap root with the larger child if necessary
      if (sorted[root] < sorted[child]) {
        [sorted[root], sorted[child]] = [sorted[child], sorted[root]];
        root = child;
      } else {
        // Break if the heap property is satisfied
        break;
      }
    }
  }

  return steps;
};

heapSort.algorithmName = 'heapSort';
heapSort.displayName = 'Heap sort';

export default heapSort;
