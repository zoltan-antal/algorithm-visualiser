import { useState, useEffect, useRef } from 'react';
import AlgorithmChart from './components/AlgorithmChart.tsx';

import generateArray from './utils/generateArray.ts';
import runAlgorithms, { stopAlgorithms } from './utils/runAlgorithms.ts';

import selectionSort from './algorithms/selectionSort.ts';
import bubbleSort from './algorithms/bubbleSort.ts';
import insertionSort from './algorithms/insertionSort.ts';
import mergeSort from './algorithms/mergeSort.ts';
import quickSort from './algorithms/quickSort.ts';
import heapSort from './algorithms/heapSort.ts';

import AlgorithmStates from './types/AlgorithmStates.ts';
import AlgorithmSteps from './types/AlgorithmSteps.ts';

function App() {
  const DEFAULT_ARRAY_SIZE = 20;
  const MIN_ARRAY_SIZE = 10;
  const MAX_ARRAY_SIZE = 100;
  const ARRAY_SIZE_STEP = 10;

  const DEFAULT_MAX_VALUE = 50;
  const MIN_MAX_VALUE = 5;
  const MAX_MAX_VALUE = 100;
  const MAX_VALUE_STEP = 5;

  const DEFAULT_DELAY = 100;
  const MIN_DELAY = 25;
  const MAX_DELAY = 1000;
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
    heapSort,
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
  const [paused, setPaused] = useState<boolean>(false);

  const [selectedAlgorithms, setSelectedAlgorithms] = useState(
    new Set(algorithmNames)
  );

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

  const algorithmSteps = useRef<AlgorithmSteps>({});
  const currentStep = useRef<number>(0);

  const calculateAlgorithms = () => {
    algorithmSteps.current = Object.fromEntries(
      algorithms
        .filter((algorithm) =>
          Array.from(selectedAlgorithms).includes(algorithm.algorithmName)
        )
        .map((algorithm) => [
          algorithm.algorithmName,
          algorithm(algorithmStates[algorithm.algorithmName].array),
        ])
    );
  };

  const callRunAlgorithms = () => {
    runAlgorithms(
      algorithmSteps.current,
      currentStep,
      setAlgorithmStates,
      delay,
      setProcessing
    );
  };

  const handleRun = () => {
    calculateAlgorithms();
    currentStep.current = 0;
    setProcessing(true);
    callRunAlgorithms();
  };

  const handleAbort = () => {
    currentStep.current = 0;
    setProcessing(false);
    setPaused(false);
    stopAlgorithms();
    // Remove highlights
    setAlgorithmStates((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.keys(updatedStates).forEach(
        (key) => (updatedStates[key].highlights = [])
      );
      return updatedStates;
    });
  };

  const handlePause = () => {
    setPaused(true);
    stopAlgorithms();
  };

  const handleContinue = () => {
    setProcessing(true);
    setPaused(false);
    callRunAlgorithms();
  };

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
          Reset defaults
        </button>
      </div>
      <button onClick={generateArrays} disabled={processing}>
        Regenerate
      </button>
      <div style={{ display: 'flex' }}>
        {algorithmNames.map((algorithmName) => (
          <div key={algorithmName}>
            <label>
              <input
                type="checkbox"
                checked={Array.from(selectedAlgorithms).includes(algorithmName)}
                disabled={processing}
                onChange={() => {
                  setSelectedAlgorithms((prev) => {
                    const updated = new Set(prev);
                    switch (
                      Array.from(selectedAlgorithms).includes(algorithmName)
                    ) {
                      case true:
                        updated.delete(algorithmName);
                        break;

                      case false:
                        updated.add(algorithmName);
                        break;
                    }
                    return updated;
                  });
                }}
              />
              {
                algorithms.find(
                  (algorithm) => algorithm.algorithmName === algorithmName
                )!.displayName
              }
            </label>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleRun} disabled={processing || paused}>
          Run
        </button>
        <button onClick={handleAbort} disabled={!processing && !paused}>
          Abort
        </button>
      </div>
      <div>
        <button onClick={handlePause} disabled={!processing || paused}>
          Pause
        </button>
        <button onClick={handleContinue} disabled={!paused}>
          Continue
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 50 }}>
        {algorithms
          .filter((algorithm) =>
            Array.from(selectedAlgorithms).includes(algorithm.algorithmName)
          )
          .map((algorithm) => (
            <div>
              <h2>{algorithm.displayName}</h2>
              <AlgorithmChart
                data={algorithmStates[algorithm.algorithmName]}
                maxValue={maxValue}
              />
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
