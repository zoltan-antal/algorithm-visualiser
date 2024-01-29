import { useState, useEffect } from 'react';
import AlgorithmChart from './components/AlgorithmChart.tsx';

import generateArray from './utils/generateArray.ts';
import runAlgorithms from './utils/runAlgorithms.ts';

import selectionSort from './algorithms/selectionSort.ts';
import bubbleSort from './algorithms/bubbleSort.ts';
import insertionSort from './algorithms/insertionSort.ts';
import mergeSort from './algorithms/mergeSort.ts';
import quickSort from './algorithms/quickSort.ts';

import AlgorithmStates from './types/AlgorithmStates.ts';

function App() {
  const DEFAULT_ARRAY_SIZE = 40;
  const MIN_ARRAY_SIZE = 10;
  const MAX_ARRAY_SIZE = 100;
  const ARRAY_SIZE_STEP = 10;

  const DEFAULT_MAX_VALUE = 50;
  const MIN_MAX_VALUE = 5;
  const MAX_MAX_VALUE = 100;
  const MAX_VALUE_STEP = 5;

  const DEFAULT_DELAY = 50;
  const MIN_DELAY = 25;
  const MAX_DELAY = 500;
  const DELAY_STEP = 25;

  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [maxValue, setMaxValue] = useState(DEFAULT_MAX_VALUE);
  const [delay, setDelay] = useState(DEFAULT_DELAY);

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
  const [processing, setProcessing] = useState<boolean>(false);

  const generateArrays = () => {
    const randomArray: number[] = generateArray(arraySize, 1, maxValue);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize, maxValue]);

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div>
          <input
            type="range"
            min={MIN_ARRAY_SIZE}
            max={MAX_ARRAY_SIZE}
            step={ARRAY_SIZE_STEP}
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={processing}
          />
          <p>Array size: {arraySize}</p>
        </div>
        <div>
          <input
            type="range"
            min={MIN_MAX_VALUE}
            max={MAX_MAX_VALUE}
            step={MAX_VALUE_STEP}
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
            disabled={processing}
          />
          <p>Value range: {maxValue}</p>
        </div>
        <div>
          <input
            type="range"
            min={MIN_DELAY}
            max={MAX_DELAY}
            step={DELAY_STEP}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            disabled={processing}
          />
          <p>Timeout: {delay}ms</p>
        </div>
        <button
          onClick={() => {
            setArraySize(DEFAULT_ARRAY_SIZE);
            setMaxValue(DEFAULT_MAX_VALUE);
            setDelay(DEFAULT_DELAY);
          }}
          disabled={processing}
        >
          Reset
        </button>
      </div>
      <div>
        <button
          onClick={() =>
            runAlgorithms(
              algorithms,
              algorithmStates,
              setAlgorithmStates,
              delay,
              setProcessing
            )
          }
          disabled={processing}
        >
          Run
        </button>
        <button onClick={() => generateArrays()} disabled={processing}>
          Regenerate
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 50 }}>
        <div>
          <h2>Selection sort</h2>
          <AlgorithmChart
            data={algorithmStates.selectionSort}
            maxValue={maxValue}
          />
        </div>
        <div>
          <h2>Bubble sort</h2>
          <AlgorithmChart
            data={algorithmStates.bubbleSort}
            maxValue={maxValue}
          />
        </div>
        <div>
          <h2>Insertion sort</h2>
          <AlgorithmChart
            data={algorithmStates.insertionSort}
            maxValue={maxValue}
          />
        </div>
        <div>
          <h2>Merge sort</h2>
          <AlgorithmChart
            data={algorithmStates.mergeSort}
            maxValue={maxValue}
          />
        </div>
        <div>
          <h2>Quicksort</h2>
          <AlgorithmChart
            data={algorithmStates.quickSort}
            maxValue={maxValue}
          />
        </div>
      </div>
    </>
  );
}

export default App;
