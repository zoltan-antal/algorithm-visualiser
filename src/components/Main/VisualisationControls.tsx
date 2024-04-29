import './VisualisationControls.css';

import { useState, useRef } from 'react';

import StepAlgorithmsMode from '../../types/StepAlgorithmsMode.ts';
import AlgorithmStates from '../../types/AlgorithmStates.ts';
import AlgorithmSteps from '../../types/AlgorithmSteps.ts';

import controlButtonImages from '../../assets/images/controlButtons';

import ANIMATION_SPEED from '../../constants/animationSpeed.ts';

import {
  runAlgorithms,
  stopAlgorithms,
  stepAlgorithms,
} from '../../utils/algorithmsController.ts';

import Slider from '../Slider';

interface VisualisationControlsProps {
  processing: boolean;
  currentStep: React.MutableRefObject<number>;
  algorithmSteps: React.MutableRefObject<AlgorithmSteps>;
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setAlgorithmStates: React.Dispatch<React.SetStateAction<AlgorithmStates>>;
  calculateAlgorithms: () => void;
}

const VisualisationControls = ({
  processing,
  currentStep,
  algorithmSteps,
  setProcessing,
  setAlgorithmStates,
  calculateAlgorithms,
}: VisualisationControlsProps) => {
  const [speed, setSpeed] = useState(ANIMATION_SPEED.default);
  const speedRef = useRef(ANIMATION_SPEED.default);
  const [paused, setPaused] = useState<boolean>(true);

  const removeHighlights = () => {
    setAlgorithmStates((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.keys(updatedStates).forEach(
        (key) => (updatedStates[key].highlights = [])
      );
      return updatedStates;
    });
  };

  const n = Math.max(
    ...Object.values(algorithmSteps.current).map((steps) => steps.length)
  );

  const callRunAlgorithms = async () => {
    await runAlgorithms(
      algorithmSteps.current,
      currentStep,
      setAlgorithmStates,
      speedRef,
      setProcessing
    );
  };

  const callStepAlgorithms = (mode: StepAlgorithmsMode) => {
    stepAlgorithms(
      algorithmSteps.current,
      currentStep,
      setAlgorithmStates,
      setProcessing,
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
    setProcessing(false);
    callStepAlgorithms('firstStep');
  };

  return (
    <div id="visualisation-controls">
      <div className="controls">
        <div className="buttons">
          <button
            id="skipBackwardButton"
            onClick={handleGoToFirstStep}
            disabled={!paused || currentStep.current <= 0}
          >
            <img src={controlButtonImages.skipBackward} />
          </button>
          <button
            id="stepBackwardButton"
            onClick={handleRewind}
            disabled={!paused || currentStep.current <= 0}
          >
            <img src={controlButtonImages.stepBackward} />
          </button>
          <button
            id="stopButton"
            onClick={handleAbort}
            disabled={!processing && currentStep.current !== n - 1}
          >
            <img src={controlButtonImages.stop} />
          </button>
          <button
            id="playButton"
            onClick={handlePlay}
            disabled={
              (processing && !paused) || (n > 0 && currentStep.current >= n - 1)
            }
            className={processing && !paused ? 'hidden' : ''}
          >
            <img src={controlButtonImages.play} />
          </button>
          <button
            id="pauseButton"
            onClick={handlePause}
            disabled={!processing || paused}
            className={!processing || paused ? 'hidden' : ''}
          >
            <img src={controlButtonImages.pause} />
          </button>
          <button
            id="stepForwardButton"
            onClick={handleAdvance}
            disabled={!paused || (n > 0 && currentStep.current >= n - 1)}
          >
            <img src={controlButtonImages.stepForward} />
          </button>
          <button
            id="skipForwardButton"
            onClick={handleGoToLastStep}
            disabled={!paused || (n > 0 && currentStep.current >= n - 1)}
          >
            <img src={controlButtonImages.skipForward} />
          </button>
        </div>
        <Slider
          label={`Animation speed${
            !/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
              ? ' '
              : '\n'
          }(steps/s)`}
          value={speed}
          units=""
          min={ANIMATION_SPEED.min}
          max={
            !/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
              ? ANIMATION_SPEED.max
              : Math.min(40, ANIMATION_SPEED.max)
          }
          step={ANIMATION_SPEED.step}
          handleChange={(value: number) => {
            setSpeed(value);
            speedRef.current = value;
          }}
          disabled={false}
        ></Slider>
      </div>
      <div className="info">
        <p>
          Completion:{' '}
          {n >= 0
            ? Math.floor((currentStep.current / (n - 1)) * 100) + '%'
            : '-'}
        </p>
        <p>Total steps: {n >= 0 ? `${currentStep.current} / ${n - 1}` : '-'}</p>
        <p>
          Estimated finish:{' '}
          {n >= 0
            ? (() => {
                const t = Math.ceil((n - (currentStep.current + 1)) / speed);
                if (t >= 60) {
                  const minutes = Math.floor(t / 60);
                  const seconds = t - 60 * minutes;
                  return `${minutes}m ${seconds}s`;
                } else {
                  return `${t}s`;
                }
              })()
            : '-'}
        </p>
      </div>
    </div>
  );
};

export default VisualisationControls;
