import './index.css';

import { useState, useEffect } from 'react';

import AlgorithmStates from '../../types/AlgorithmStates.ts';
import AlgorithmSteps from '../../types/AlgorithmSteps.ts';
import StepAlgorithmsMode from '../../types/StepAlgorithmsMode.ts';

import controlButtonImages from '../../assets/images/controlButtons';

import DELAY from '../../constants/delay.ts';

import algorithms from '../../algorithms';
import {
  runAlgorithms,
  stopAlgorithms,
  stepAlgorithms,
} from '../../utils/algorithmsController.ts';

import Slider from '../Slider';
import AlgorithmChart from '../AlgorithmChart';

interface MainProps {
  maxValue: number;
  selectedAlgorithms: Set<string>;
  currentStep: React.MutableRefObject<number>;
  algorithmSteps: React.MutableRefObject<AlgorithmSteps>;
  processing: boolean;
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  algorithmStates: AlgorithmStates;
  setAlgorithmStates: React.Dispatch<React.SetStateAction<AlgorithmStates>>;
}

const Main = ({
  maxValue,
  selectedAlgorithms,
  currentStep,
  algorithmSteps,
  processing,
  setProcessing,
  algorithmStates,
  setAlgorithmStates,
}: MainProps) => {
  const [delay, setDelay] = useState(DELAY.default);
  const [paused, setPaused] = useState<boolean>(true);
  const [numColumns, setNumColumns] = useState(3);
  const [numRows, setNumRows] = useState(2);
  const [algorithmPlacings, setAlgorithmPlacings] = useState<string[]>([]);

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
              (processing && !paused) || (n > 0 && currentStep.current >= n - 1)
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
  );
};

export default Main;
