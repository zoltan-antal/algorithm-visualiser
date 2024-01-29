import { useState, useEffect } from 'react';
import BarChart from './components/BarChart.tsx';

import generateArray from './utils/generateArray.ts';
import runAlgorithms from './utils/runAlgorithms.ts';

import selectionSort from './algorithms/selectionSort.ts';
import bubbleSort from './algorithms/bubbleSort.ts';
import insertionSort from './algorithms/insertionSort.ts';
import mergeSort from './algorithms/mergeSort.ts';
import quickSort from './algorithms/quickSort.ts';

import AlgorithmStates from './types/AlgorithmStates.ts';

function App() {
  const TIMEOUT = 10;
  const MAX_VALUE = 100;
  const ARRAY_SIZE = 50;

  const algorithms = [
    selectionSort,
    bubbleSort,
    insertionSort,
    mergeSort,
    quickSort,
  ];
  const algorithmNames = algorithms.map((algorithm) => algorithm.algorithmName);
  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmStates>(
    Object.fromEntries(
      algorithmNames.map((algorithmName) => [
        algorithmName,
        { array: [], highlights: [] },
      ])
    ) as AlgorithmStates
  );

  const generateArrays = () => {
    const randomArray: number[] = generateArray(ARRAY_SIZE, 1, MAX_VALUE);
    setAlgorithmStates((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.keys(updatedStates).forEach(
        (key) =>
          (updatedStates[key as keyof AlgorithmStates] = {
            array: randomArray,
            highlights: [],
          })
      );
      return updatedStates;
    });
  };
  useEffect(() => {
    generateArrays();
  }, []);

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <button
        onClick={() =>
          runAlgorithms(
            algorithms,
            algorithmStates,
            setAlgorithmStates,
            TIMEOUT
          )
        }
      >
        Run
      </button>
      <button onClick={() => generateArrays()}>Regenerate arrays</button>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div>
          <h2>Selection sort</h2>
          <BarChart data={algorithmStates.selectionSort} />
        </div>
        <div>
          <h2>Bubble sort</h2>
          <BarChart data={algorithmStates.bubbleSort} />
        </div>
        <div>
          <h2>Insertion sort</h2>
          <BarChart data={algorithmStates.insertionSort} />
        </div>
        <div>
          <h2>Merge sort</h2>
          <BarChart data={algorithmStates.mergeSort} />
        </div>
        <div>
          <h2>Quicksort</h2>
          <BarChart data={algorithmStates.quickSort} />
        </div>
      </div>
    </>
  );
}

export default App;
