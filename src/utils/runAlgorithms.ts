import selectionSort from '../algorithms/selectionSort.ts';
import bubbleSort from '../algorithms/bubbleSort.ts';
import mergeSort from '../algorithms/mergeSort.ts';

import AlgorithmStates from '../types/AlgorithmStates.ts';
import Arrays from '../types/Arrays.ts';

const algorithms = [selectionSort, bubbleSort, mergeSort];
const algorithmNames = algorithms.map((algorithm) => algorithm.algorithmName);

const runAlgorithms = async (
  arrays: Arrays,
  setArrays: React.Dispatch<React.SetStateAction<Arrays>>,
  timeout: number
) => {
  const algorithmStates: AlgorithmStates = {
    selectionSort: {
      processing: true,
      arr: [...arrays.selectionSort],
      n: arrays.selectionSort.length,
      i: 0,
      j: 1,
      minIndex: 0,
    },
    bubbleSort: {
      processing: true,
      arr: [...arrays.bubbleSort],
      n: arrays.bubbleSort.length,
      i: 0,
      j: 0,
      swap: true,
    },
    mergeSort: {
      processing: true,
      arr: [...arrays.mergeSort],
      root: {
        start: 0,
        end: arrays.mergeSort.length - 1,
        sorted: false,
      },
      path: ['root'],
    },
  };

  while (Object.values(algorithmStates).some((state) => state.processing)) {
    for (const algorithm of algorithms) {
      const algorithmName =
        algorithm.algorithmName as keyof typeof algorithmStates;
      const newState = algorithm(algorithmStates[algorithmName]);
      if (!newState.processing) {
        console.log(algorithmName + ' DONE');
      }
      algorithmStates[algorithmName] = newState as any;
    }
    await new Promise((resolve) => setTimeout(resolve, timeout));

    setArrays((prevArrays) => {
      const updatedArrays: Arrays = structuredClone(prevArrays);
      Object.entries(algorithmStates).forEach(([key, value]) => {
        updatedArrays[key as keyof Arrays] = value.arr;
      });
      return updatedArrays;
    });
  }
  console.log('Done');
};

export default runAlgorithms;
export { algorithmNames };
