import './styles/App.css';

import { useState, useEffect, useRef, useCallback } from 'react';

import ArrayOrder from './types/ArrayOrder.ts';
import AlgorithmStates from './types/AlgorithmStates.ts';
import AlgorithmSteps from './types/AlgorithmSteps.ts';
import StepAlgorithmsMode from './types/StepAlgorithmsMode.ts';

import ARRAY_SIZE from './constants/arraySize.ts';
import VALUE_RANGE from './constants/valueRange.ts';
import DELAY from './constants/delay.ts';
import ARRAY_ORDER_OPTIONS from './constants/arrayOrderOptions.ts';

import controlButtonImages from './assets/images/controlButtons';

import AlgorithmChart from './components/AlgorithmChart.tsx';
import Slider from './components/Slider.tsx';

import algorithms, { algorithmNames } from './algorithms';
import generateArray from './utils/generateArray.ts';
import {
  runAlgorithms,
  stopAlgorithms,
  stepAlgorithms,
} from './utils/algorithmsController.ts';

function App() {
  const [arraySize, setArraySize] = useState(ARRAY_SIZE.default);
  const [maxValue, setMaxValue] = useState(VALUE_RANGE.default);
  const [delay, setDelay] = useState(DELAY.default);

  const [selectedArrayOrder, setSelectedArrayOrder] =
    useState<ArrayOrder>('unsorted');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(
    new Set(algorithmNames)
  );

  const [numColumns, setNumColumns] = useState(3);
  const [numRows, setNumRows] = useState(2);

  const algorithmSteps = useRef<AlgorithmSteps>({});
  const [algorithmPlacings, setAlgorithmPlacings] = useState<string[]>([]);
  const currentStep = useRef<number>(0);
  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmStates>({});
  const [processing, setProcessing] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(true);

  const generateArrays = useCallback(() => {
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
    currentStep.current = 0;
  }, [arraySize, maxValue, selectedArrayOrder]);

  useEffect(() => {
    generateArrays();
  }, [generateArrays]);

  useEffect(() => {
    const algorithmCount = selectedAlgorithms.size;
    if (algorithmCount <= 2) {
      setNumColumns(1);
      setNumRows(2);
    } else if (algorithmCount <= 4) {
      setNumColumns(2);
      setNumRows(2);
    } else if (algorithmCount <= 6) {
      setNumColumns(3);
      setNumRows(2);
    }
  }, [selectedAlgorithms.size]);

  const removeHighlights = () => {
    setAlgorithmStates((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.keys(updatedStates).forEach(
        (key) => (updatedStates[key].highlights = [])
      );
      return updatedStates;
    });
  };

  const calculateAlgorithms = () => {
    if (
      Object.keys(algorithmSteps.current).toSorted().toString() ===
      Array.from(selectedAlgorithms).toSorted().toString()
    ) {
      return;
    }

    algorithmSteps.current = Object.fromEntries(
      algorithms
        .filter((algorithm) =>
          Array.from(selectedAlgorithms).includes(algorithm.algorithmName)
        )
        .map((algorithm) => {
          const arr = algorithm(algorithmStates[algorithm.algorithmName].array);
          arr.unshift({ ...arr[0], highlights: [] });
          arr.push({ ...arr[arr.length - 1], highlights: [] });
          return [algorithm.algorithmName, arr];
        })
    );
    setAlgorithmPlacings(
      Object.entries(algorithmSteps.current)
        .sort((a, b) => a[1].length - b[1].length)
        .map(([key]) => key)
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
    calculateAlgorithms();
    setPaused(false);
    setProcessing(true);
    await callRunAlgorithms();
    setPaused(true);
  };

  const handleAbort = () => {
    stopAlgorithms();
    setPaused(true);
    setProcessing(false);
    removeHighlights();
    currentStep.current = 0;
    algorithmSteps.current = {};
  };

  const handlePause = () => {
    stopAlgorithms();
    setPaused(true);
  };

  const handleAdvance = () => {
    calculateAlgorithms();
    setProcessing(true);
    callStepAlgorithms('advance');
  };

  const handleRewind = () => {
    setProcessing(true);
    callStepAlgorithms('rewind');
  };

  const handleGoToLastStep = () => {
    calculateAlgorithms();
    setProcessing(true);
    callStepAlgorithms('lastStep');
  };

  const handleGoToFirstStep = () => {
    // setProcessing(true);
    setProcessing(false);
    callStepAlgorithms('firstStep');
  };

  return (
    <>
      <header>
        <h1>Algorithm Visualiser</h1>
        <nav></nav>
      </header>
      <aside>
        <h2>Settings</h2>
        <div className="section" id="algorithms-displayed">
          <div className="header">
            <h3 className="title">Algorithms displayed</h3>
          </div>
          <div className="items">
            {algorithmNames.map((algorithmName) => (
              <label key={algorithmName}>
                <input
                  type="checkbox"
                  checked={Array.from(selectedAlgorithms).includes(
                    algorithmName
                  )}
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
                      // setNumColumns(calculateNumColumns(updated.size));
                      // setNumRows(calculateNumRows(updated.size));
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
            ))}
          </div>
        </div>
        <div className="section" id="input-ordering">
          <div className="header">
            <h3 className="title">Input ordering</h3>
            <button onClick={generateArrays} disabled={processing}>
              Regenerate data
            </button>
          </div>
          <div className="items">
            {ARRAY_ORDER_OPTIONS.map((arrayOrderOption) => (
              <label key={arrayOrderOption.name}>
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
        </div>
        <div className="section" id="input-parameters">
          <div className="header">
            <h3>Input parameters</h3>
            <button
              onClick={() => {
                setArraySize(ARRAY_SIZE.default);
                setMaxValue(VALUE_RANGE.default);
              }}
              disabled={processing}
            >
              Reset defaults
            </button>
          </div>
          <div className="items">
            <Slider
              label="Input size"
              value={arraySize}
              units=""
              min={ARRAY_SIZE.min}
              max={ARRAY_SIZE.max}
              step={ARRAY_SIZE.step}
              handleChange={setArraySize}
              disabled={processing}
            ></Slider>
            <Slider
              label="Value range"
              value={maxValue}
              units=""
              min={VALUE_RANGE.min}
              max={VALUE_RANGE.max}
              step={VALUE_RANGE.step}
              handleChange={setMaxValue}
              disabled={processing}
            ></Slider>
          </div>
        </div>
      </aside>
      <main>
        <div id="visualisation-controls">
          <div className="items">
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
            <button
              onClick={handleAbort}
              disabled={!processing && currentStep.current !== n - 1}
            >
              <img src={controlButtonImages.stop} />
            </button>
            <button
              onClick={handlePlay}
              disabled={
                (processing && !paused) ||
                (n > 0 && currentStep.current >= n - 1)
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
          <Slider
            label="Step delay"
            value={delay}
            units="ms"
            min={DELAY.min}
            max={DELAY.max}
            step={DELAY.step}
            handleChange={setDelay}
            disabled={!paused}
          ></Slider>
        </div>
        <div
          id="visualisation-display"
          style={{
            gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
            gridTemplateRows: `repeat(${numRows}, 1fr)`,
          }}
        >
          {algorithms
            .filter((algorithm) =>
              Array.from(selectedAlgorithms).includes(algorithm.algorithmName)
            )
            .map((algorithm) => (
              <div key={algorithm.algorithmName} className="item">
                <div className="header">
                  <h2 className="title">{algorithm.displayName}</h2>
                  {algorithmSteps.current[algorithm.algorithmName] &&
                    currentStep.current >=
                      algorithmSteps.current[algorithm.algorithmName].length -
                        1 && (
                      <div className="placing">
                        {algorithmPlacings.indexOf(algorithm.algorithmName) + 1}
                      </div>
                    )}
                </div>
                <AlgorithmChart
                  data={algorithmStates[algorithm.algorithmName]}
                  maxValue={maxValue}
                />
              </div>
            ))}
        </div>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
