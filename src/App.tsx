import './styles/App.css';

import { useState, useEffect, useRef } from 'react';

import AlgorithmChart from './components/AlgorithmChart.tsx';
import Slider from './components/Slider.tsx';

import generateArray from './utils/generateArray.ts';

import ARRAY_SIZE from './constants/arraySize.ts';
import VALUE_RANGE from './constants/valueRange.ts';
import DELAY from './constants/delay.ts';
import ARRAY_ORDER_OPTIONS from './constants/arrayOrderOptions.ts';

import algorithms, { algorithmNames } from './algorithms';

import {
  runAlgorithms,
  stopAlgorithms,
  stepAlgorithms,
} from './utils/algorithmsController.ts';

import ArrayOrder from './types/ArrayOrder.ts';
import AlgorithmStates from './types/AlgorithmStates.ts';
import AlgorithmSteps from './types/AlgorithmSteps.ts';
import StepAlgorithmsMode from './types/StepAlgorithmsMode.ts';

import controlButtonImages from './assets/images/controlButtons';

function App() {
  const [arraySize, setArraySize] = useState(ARRAY_SIZE.default);
  const [maxValue, setMaxValue] = useState(VALUE_RANGE.default);
  const [delay, setDelay] = useState(DELAY.default);

  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmStates>({});
  const [processing, setProcessing] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(true);

  const [selectedArrayOrder, setSelectedArrayOrder] =
    useState<ArrayOrder>('unsorted');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(
    new Set(algorithmNames)
  );

  const generateArrays = () => {
    const array = generateArray(arraySize, 1, maxValue, selectedArrayOrder);
    setAlgorithmStates(
      Object.fromEntries(
        algorithmNames.map((algorithmName) => [
          algorithmName,
          { array, highlights: [] },
        ])
      )
    );
    algorithmSteps.current = {};
  };

  useEffect(() => {
    generateArrays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize, maxValue, selectedArrayOrder]);

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

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <div className="sliders">
        <Slider
          label="Array size"
          value={arraySize}
          min={ARRAY_SIZE.min}
          max={ARRAY_SIZE.max}
          step={ARRAY_SIZE.step}
          handleChange={setArraySize}
          disabled={processing}
        ></Slider>
        <Slider
          label="Value range"
          value={maxValue}
          min={VALUE_RANGE.min}
          max={VALUE_RANGE.max}
          step={VALUE_RANGE.step}
          handleChange={setMaxValue}
          disabled={processing}
        ></Slider>
        <Slider
          label="Timeout"
          value={delay}
          min={DELAY.min}
          max={DELAY.max}
          step={DELAY.step}
          handleChange={setDelay}
          disabled={processing}
        ></Slider>
        <button
          onClick={() => {
            setArraySize(ARRAY_SIZE.default);
            setMaxValue(VALUE_RANGE.default);
            setDelay(DELAY.default);
          }}
          disabled={processing}
        >
          Reset defaults
        </button>
      </div>
      <div>
        Data:{' '}
        {ARRAY_ORDER_OPTIONS.map((arrayOrderOption) => (
          <label>
            <input
              type="radio"
              onChange={() => setSelectedArrayOrder(arrayOrderOption.name)}
              checked={selectedArrayOrder === arrayOrderOption.name}
              disabled={processing}
            />
            {arrayOrderOption.displayName}
          </label>
        ))}
      </div>
      <button onClick={generateArrays} disabled={processing}>
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
          <img src={controlButtonImages.skipBackward} />
        </button>
        <button
          onClick={handleRewind}
          disabled={!paused || currentStep.current <= 0}
        >
          <img src={controlButtonImages.stepBackward} />
        </button>
        <button onClick={handleAbort} disabled={!processing}>
          <img src={controlButtonImages.stop} />
        </button>
        <button
          onClick={handlePlay}
          disabled={
            (processing && !paused) || (n > 0 && currentStep.current >= n)
          }
          className={processing && !paused ? 'hidden' : ''}
        >
          <img src={controlButtonImages.play} />
        </button>
        <button
          onClick={handlePause}
          disabled={!processing || paused}
          className={!processing || paused ? 'hidden' : ''}
        >
          <img src={controlButtonImages.pause} />
        </button>
        <button
          onClick={handleAdvance}
          disabled={!paused || (n > 0 && currentStep.current >= n - 1)}
        >
          <img src={controlButtonImages.stepForward} />
        </button>
        <button
          onClick={handleGoToLastStep}
          disabled={!paused || (n > 0 && currentStep.current >= n - 1)}
        >
          <img src={controlButtonImages.skipForward} />
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
