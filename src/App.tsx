import { useState, useEffect, useRef } from 'react';
import AlgorithmChart from './components/AlgorithmChart.tsx';

import generateRandomArray from './utils/generateRandomArray.ts';
import {
  runAlgorithms,
  stopAlgorithms,
  stepAlgorithms,
} from './utils/algorithmsController.ts';

import selectionSort from './algorithms/selectionSort.ts';
import bubbleSort from './algorithms/bubbleSort.ts';
import insertionSort from './algorithms/insertionSort.ts';
import mergeSort from './algorithms/mergeSort.ts';
import quickSort from './algorithms/quickSort.ts';
import heapSort from './algorithms/heapSort.ts';

import ArrayOrder from './types/ArrayOrder.ts';
import ArrayOrderOption from './types/ArrayOrderOption.ts';
import AlgorithmStates from './types/AlgorithmStates.ts';
import AlgorithmSteps from './types/AlgorithmSteps.ts';
import StepAlgorithmsMode from './types/StepAlgorithmsMode.ts';

import playImage from './assets/images/play.svg';
import stopImage from './assets/images/stop.svg';
import pauseImage from './assets/images/pause.svg';
import stepForwardImage from './assets/images/step-forward.svg';
import stepBackwardImage from './assets/images/step-backward.svg';
import skipForwardImage from './assets/images/skip-forward.svg';
import skipBackwardImage from './assets/images/skip-backward.svg';

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

  const [selectedArrayOrder, setSelectedArrayOrder] =
    useState<ArrayOrder>('unsorted');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(
    new Set(algorithmNames)
  );

  const updateAlgorithmStates = (array: number[]) => {
    setAlgorithmStates((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.keys(updatedStates).forEach(
        (key) =>
          (updatedStates[key as keyof AlgorithmStates] = {
            array,
            highlights: [],
          })
      );
      return updatedStates;
    });
  };

  const generateArrays = (arrayOrder = selectedArrayOrder) => {
    let array: number[];
    switch (arrayOrder) {
      case 'unsorted':
        array = generateUnsortedArrays();
        break;

      case 'sorted':
        array = generateSortedArrays();
        break;

      case 'reversed':
        array = generateReversedArrays();
        break;

      case 'equal':
        array = generateEqualArrays();
        break;

      case 'nearlySorted':
        array = generateNearlySortedArrays();
        break;
    }
    updateAlgorithmStates(array);
  };

  const generateUnsortedArrays = () => {
    const array = generateRandomArray(arraySize, 1, maxValue);
    return array;
  };

  const generateSortedArrays = () => {
    const array = generateRandomArray(arraySize, 1, maxValue);
    array.sort((a, b) => a - b);
    return array;
  };

  const generateReversedArrays = () => {
    const array = generateRandomArray(arraySize, 1, maxValue);
    array.sort((a, b) => b - a);
    return array;
  };

  const generateEqualArrays = () => {
    const array = new Array(arraySize).fill(
      Math.floor(Math.random() * (maxValue - 1 + 1)) + 1
    );
    return array;
  };

  const generateNearlySortedArrays = () => {
    const array = generateRandomArray(arraySize, 1, maxValue);
    array.sort((a, b) => a - b);
    const inversionCount = Math.round(Math.log(arraySize)) - 1;
    for (let i = 0; i < inversionCount; i++) {
      const a = Math.floor(Math.random() * arraySize);
      const b = Math.floor(Math.random() * arraySize);
      if (a === b) {
        i--;
        continue;
      }
      [array[a], array[b]] = [array[b], array[a]];
    }
    return array;
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

  const n = Math.max(
    ...Object.values(algorithmSteps.current).map((steps) => steps.length)
  );

  const callRunAlgorithms = () => {
    runAlgorithms(
      algorithmSteps.current,
      currentStep,
      setAlgorithmStates,
      delay,
      setProcessing
    );
  };

  const callStepAlgorithms = (mode: StepAlgorithmsMode) => {
    stepAlgorithms(
      algorithmSteps.current,
      currentStep,
      setAlgorithmStates,
      mode
    );
  };

  const handlePlay = () => {
    switch (paused) {
      case false:
        calculateAlgorithms();
        currentStep.current = 0;
        callRunAlgorithms();
        break;

      case true:
        setPaused(false);
        break;
    }
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

  const handleAdvance = () => {
    callStepAlgorithms('advance');
  };

  const handleRewind = () => {
    callStepAlgorithms('rewind');
  };

  const handleGoToLastStep = () => {
    callStepAlgorithms('lastStep');
  };

  const handleGoToFirstStep = () => {
    callStepAlgorithms('firstStep');
  };

  const buttonStyle = { height: 25 };
  const imageStyle = { width: '100%', height: '100%' };

  const arrayOrderOptions: ArrayOrderOption[] = [
    { name: 'unsorted', displayName: 'Unsorted' },
    { name: 'sorted', displayName: 'Sorted' },
    { name: 'reversed', displayName: 'Reversed' },
    { name: 'equal', displayName: 'Equal elements' },
    { name: 'nearlySorted', displayName: 'Nearly sorted' },
  ];

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
      <div>
        Data:{' '}
        {arrayOrderOptions.map((arrayOrderOption) => (
          <label>
            <input
              type="radio"
              onChange={() => {
                setSelectedArrayOrder(arrayOrderOption.name);
                generateArrays(arrayOrderOption.name);
              }}
              checked={selectedArrayOrder === arrayOrderOption.name}
              disabled={processing}
            />
            {arrayOrderOption.displayName}
          </label>
        ))}
      </div>
      <button onClick={() => generateArrays()} disabled={processing}>
        Regenerate data
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
        <button
          onClick={handleGoToFirstStep}
          disabled={!paused || currentStep.current <= 0}
          style={buttonStyle}
        >
          <img src={skipBackwardImage} style={imageStyle} />
        </button>
        <button
          onClick={handleRewind}
          disabled={!paused || currentStep.current <= 0}
          style={buttonStyle}
        >
          <img src={stepBackwardImage} style={imageStyle} />
        </button>
        <button
          onClick={handleAbort}
          disabled={!processing && !paused}
          style={buttonStyle}
        >
          <img src={stopImage} style={imageStyle} />
        </button>
        <button
          onClick={handlePlay}
          disabled={processing && !paused}
          style={{
            ...buttonStyle,
            display: processing && !paused ? 'none' : 'inline',
          }}
        >
          <img src={playImage} style={imageStyle} />
        </button>
        <button
          onClick={handlePause}
          disabled={!processing || paused}
          style={{
            ...buttonStyle,
            display: !processing || paused ? 'none' : 'inline',
          }}
        >
          <img src={pauseImage} style={imageStyle} />
        </button>
        <button
          onClick={handleAdvance}
          disabled={!paused || currentStep.current >= n - 1}
          style={buttonStyle}
        >
          <img src={stepForwardImage} style={imageStyle} />
        </button>
        <button
          onClick={handleGoToLastStep}
          disabled={!paused || currentStep.current >= n - 1}
          style={buttonStyle}
        >
          <img src={skipForwardImage} style={imageStyle} />
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
