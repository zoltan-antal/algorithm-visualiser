import { useState } from 'react';

import generateArray from './utils/generateArray.ts';

import AlgorithmStates from './types/AlgorithmStates.ts';
import Arrays from './types/Arrays.ts';

import selectionSort from './algorithms/selectionSort.ts';
import bubbleSort from './algorithms/bubbleSort.ts';

function App() {
  const randomArray = generateArray(5, 1, 50);
  const arrayLength = randomArray.length;
  const [arrays, setArrays] = useState<Arrays>({
    selectionSort: [...randomArray],
    bubbleSort: [...randomArray],
  });

  const runAlgorithms = async () => {
    const algorithms = [selectionSort, bubbleSort];

    const algorithmStates: AlgorithmStates = {
      selectionSort: {
        processing: true,
        arr: [...randomArray],
        n: arrayLength,
        i: 0,
        j: 1,
        min_index: 0,
      },
      bubbleSort: {
        processing: true,
        arr: [...randomArray],
        n: arrayLength,
        i: 0,
        j: 0,
        swap: true,
      },
    };

    while (Object.values(algorithmStates).some((state) => state.processing)) {
      for (const algorithm of algorithms) {
        const algorithmName = algorithm.name as keyof typeof algorithmStates;
        const newState = algorithm(algorithmStates[algorithmName]);
        if (!newState.processing) {
          console.log(algorithmName + ' DONE');
        }
        algorithmStates[algorithmName] = newState as any;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));

      setArrays((prevArrays) => {
        const updatedArrays: Arrays = { ...prevArrays };
        Object.entries(algorithmStates).forEach(([key, value]) => {
          updatedArrays[key as keyof Arrays] = value.arr;
        });
        return updatedArrays;
      });
    }
    console.log('Done');
  };

  console.log('Selection sort: ' + arrays.selectionSort);
  console.log('Bubble sort: ' + arrays.bubbleSort);

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <button onClick={() => runAlgorithms()}>Run</button>
    </>
  );
}

export default App;
