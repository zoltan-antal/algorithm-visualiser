import selectionSort from './selectionSort.ts';
import bubbleSort from './bubbleSort.ts';
import insertionSort from './insertionSort.ts';
import mergeSort from './mergeSort.ts';
import quickSort from './quickSort.ts';
import heapSort from './heapSort.ts';

const algorithms = [
  selectionSort,
  bubbleSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
];

const algorithmNames = algorithms.map((algorithm) => algorithm.algorithmName);

export default algorithms;
export { algorithmNames };
