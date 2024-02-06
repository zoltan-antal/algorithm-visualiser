import './styles/App.css';

import { useState, useEffect, useRef } from 'react';

import AlgorithmChart from './components/AlgorithmChart.tsx';
import Slider from './components/Slider.tsx';

import generateArrays from './utils/generateArrays.ts';

import CONSTANTS from './utils/constants.ts';

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
  const [arraySize, setArraySize] = useState(CONSTANTS.ARRAY_SIZE.DEFAULT);
  const [maxValue, setMaxValue] = useState(CONSTANTS.VALUE_RANGE.DEFAULT);
  const [delay, setDelay] = useState(CONSTANTS.DELAY.DEFAULT);

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
  const [paused, setPaused] = useState<boolean>(true);

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

  const regenerateArrays = (arrayOrder = selectedArrayOrder) => {
    let array: number[];
    switch (arrayOrder) {
      case 'unsorted':
        array = generateArrays(arraySize, 1, maxValue, 'unsorted');
        break;

      case 'sorted':
        array = generateArrays(arraySize, 1, maxValue, 'sorted');
        break;

      case 'reversed':
        array = generateArrays(arraySize, 1, maxValue, 'reversed');
        break;

      case 'equal':
        array = generateArrays(arraySize, 1, maxValue, 'equal');
        break;

      case 'nearlySorted':
        array = generateArrays(arraySize, 1, maxValue, 'nearlySorted');
        break;
    }
    updateAlgorithmStates(array);
    algorithmSteps.current = {};
  };

  useEffect(() => {
    regenerateArrays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize, maxValue]);

  const algorithmSteps = useRef<AlgorithmSteps>({});
  const currentStep = useRef<number>(0);

  const calculateAlgorithms = () => {
    algorithmSteps.current = Object.fromEntries(
      algorithms.map((algorithm) => {
        const arr = algorithm(algorithmStates[algorithm.algorithmName].array);
        arr.unshift({ ...arr[0], highlights: [] });
        arr.push({ ...arr[arr.length - 1], highlights: [] });
        return [algorithm.algorithmName, arr];
      })
    );
  };

  const n = Math.max(
    ...Object.values(algorithmSteps.current).map((steps) => steps.length)
  );

  const callRunAlgorithms = async () => {
    await runAlgorithms(
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

  const handlePlay = async () => {
    if (Object.entries(algorithmSteps.current).length === 0) {
      calculateAlgorithms();
    }
    setPaused(false);
    setProcessing(true);
    await callRunAlgorithms();
    setPaused(true);
  };

  const handleAbort = () => {
    currentStep.current = 0;
    setProcessing(false);
    setPaused(true);
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
    if (Object.entries(algorithmSteps.current).length === 0) {
      calculateAlgorithms();
    }
    setProcessing(true);
    callStepAlgorithms('advance');
  };

  const handleRewind = () => {
    setProcessing(true);
    callStepAlgorithms('rewind');
  };

  const handleGoToLastStep = () => {
    if (Object.entries(algorithmSteps.current).length === 0) {
      calculateAlgorithms();
    }
    setProcessing(true);
    callStepAlgorithms('lastStep');
  };

  const handleGoToFirstStep = () => {
    setProcessing(true);
    callStepAlgorithms('firstStep');
  };

  const arrayOrderOptions: ArrayOrderOption[] = [
    { name: 'unsorted', displayName: 'Unsorted' },
    { name: 'sorted', displayName: 'Sorted' },
    { name: 'nearlySorted', displayName: 'Nearly sorted' },
    { name: 'reversed', displayName: 'Reversed' },
    { name: 'equal', displayName: 'Equal elements' },
  ];

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <div className="sliders">
        <Slider
          label="Array size"
          value={arraySize}
          min={CONSTANTS.ARRAY_SIZE.MIN}
          max={CONSTANTS.ARRAY_SIZE.MAX}
          step={CONSTANTS.ARRAY_SIZE.STEP}
          handleChange={setArraySize}
          disabled={processing}
        ></Slider>
        <Slider
          label="Value range"
          value={maxValue}
          min={CONSTANTS.VALUE_RANGE.MIN}
          max={CONSTANTS.VALUE_RANGE.MAX}
          step={CONSTANTS.VALUE_RANGE.STEP}
          handleChange={setMaxValue}
          disabled={processing}
        ></Slider>
        <Slider
          label="Timeout"
          value={delay}
          min={CONSTANTS.DELAY.MIN}
          max={CONSTANTS.DELAY.MAX}
          step={CONSTANTS.DELAY.STEP}
          handleChange={setDelay}
          disabled={processing}
        ></Slider>
        <button
          onClick={() => {
            setArraySize(CONSTANTS.ARRAY_SIZE.DEFAULT);
            setMaxValue(CONSTANTS.VALUE_RANGE.DEFAULT);
            setDelay(CONSTANTS.DELAY.DEFAULT);
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
                regenerateArrays(arrayOrderOption.name);
              }}
              checked={selectedArrayOrder === arrayOrderOption.name}
              disabled={processing}
            />
            {arrayOrderOption.displayName}
          </label>
        ))}
      </div>
      <button onClick={() => regenerateArrays()} disabled={processing}>
        Regenerate data
      </button>
      <div className="checkboxes">
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
      <div className="controlButtons">
        <button
          onClick={handleGoToFirstStep}
          disabled={!paused || currentStep.current <= 0}
        >
          <img src={skipBackwardImage} />
        </button>
        <button
          onClick={handleRewind}
          disabled={!paused || currentStep.current <= 0}
        >
          <img src={stepBackwardImage} />
        </button>
        <button onClick={handleAbort} disabled={!processing}>
          <img src={stopImage} />
        </button>
        <button
          onClick={handlePlay}
          disabled={
            (processing && !paused) || (n > 0 && currentStep.current >= n)
          }
          className={processing && !paused ? 'hidden' : ''}
        >
          <img src={playImage} />
        </button>
        <button
          onClick={handlePause}
          disabled={!processing || paused}
          className={!processing || paused ? 'hidden' : ''}
        >
          <img src={pauseImage} />
        </button>
        <button
          onClick={handleAdvance}
          disabled={!paused || (n > 0 && currentStep.current >= n - 1)}
        >
          <img src={stepForwardImage} />
        </button>
        <button
          onClick={handleGoToLastStep}
          disabled={!paused || (n > 0 && currentStep.current >= n - 1)}
        >
          <img src={skipForwardImage} />
        </button>
      </div>
      <div className="charts">
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
