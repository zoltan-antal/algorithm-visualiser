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
  currentStep: React.MutableRefObject<number>;
  algorithmSteps: React.MutableRefObject<AlgorithmSteps>;
  selectedAlgorithms: Set<string>;
  processing: boolean;
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setAlgorithmStates: React.Dispatch<React.SetStateAction<AlgorithmStates>>;
  calculateAlgorithms: () => void;
}

const VisualisationControls = ({
  currentStep,
  algorithmSteps,
  selectedAlgorithms,
  processing,
  setProcessing,
  setAlgorithmStates,
  calculateAlgorithms,
}: VisualisationControlsProps) => {
  const [speed, setSpeed] = useState(ANIMATION_SPEED.default);
  const speedRef = useRef(ANIMATION_SPEED.default);
  const paused = useRef(true);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_rerender, setRerender] = useState(false);

  // const removeHighlights = () => {
  //   setAlgorithmStates((prevStates) => {
  //     const updatedStates: AlgorithmStates = structuredClone(prevStates);
  //     Object.keys(updatedStates).forEach(
  //       (key) => (updatedStates[key].highlights = [])
  //     );
  //     return updatedStates;
  //   });
  // };

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
    paused.current = false;
    setProcessing(true);
    setButtonsDisabled(false);
    await callRunAlgorithms();
    paused.current = true;
  };

  const handleAbort = () => {
    stopAlgorithms();
    paused.current = true;
    setProcessing(false);
    callStepAlgorithms('firstStep');
  };

  const handlePause = () => {
    stopAlgorithms();
    setTimeout(() => (paused.current = true), 100);
    paused.current = true;
    setRerender((prev) => !prev);
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
    stopAlgorithms();
    paused.current = true;
    callStepAlgorithms('lastStep');
  };

  const handleGoToFirstStep = async () => {
    if (paused.current) {
      setProcessing(false);
      callStepAlgorithms('firstStep');
    } else {
      setButtonsDisabled(true);
      stopAlgorithms();
      callStepAlgorithms('firstStep');
      setTimeout(async () => await handlePlay(), Math.max(500, 1000 / speed));
    }
  };

  return (
    <div id="visualisation-controls">
      <div className="controls">
        <div className="buttons">
          <button
            id="skipBackwardButton"
            onClick={handleGoToFirstStep}
            disabled={
              currentStep.current <= 0 ||
              !selectedAlgorithms.size ||
              buttonsDisabled
            }
          >
            <img src={controlButtonImages.skipBackward} />
          </button>
          <button
            id="stepBackwardButton"
            onClick={handleRewind}
            disabled={
              !paused.current ||
              currentStep.current <= 0 ||
              !selectedAlgorithms.size ||
              buttonsDisabled
            }
          >
            <img src={controlButtonImages.stepBackward} />
          </button>
          <button
            id="stopButton"
            onClick={handleAbort}
            disabled={
              (!processing && currentStep.current !== n - 1) ||
              !selectedAlgorithms.size ||
              buttonsDisabled
            }
          >
            <img src={controlButtonImages.stop} />
          </button>
          <button
            id="playButton"
            onClick={handlePlay}
            disabled={
              (processing && !paused.current) ||
              (n > 0 && currentStep.current >= n - 1) ||
              !selectedAlgorithms.size ||
              buttonsDisabled
            }
            className={processing && !paused.current ? 'hidden' : ''}
          >
            <img src={controlButtonImages.play} />
          </button>
          <button
            id="pauseButton"
            onClick={handlePause}
            disabled={
              !processing ||
              paused.current ||
              !selectedAlgorithms.size ||
              buttonsDisabled
            }
            className={!processing || paused.current ? 'hidden' : ''}
          >
            <img src={controlButtonImages.pause} />
          </button>
          <button
            id="stepForwardButton"
            onClick={handleAdvance}
            disabled={
              !paused.current ||
              (n > 0 && currentStep.current >= n - 1) ||
              !selectedAlgorithms.size ||
              buttonsDisabled
            }
          >
            <img src={controlButtonImages.stepForward} />
          </button>
          <button
            id="skipForwardButton"
            onClick={handleGoToLastStep}
            disabled={
              (n > 0 && currentStep.current >= n - 1) ||
              !selectedAlgorithms.size ||
              buttonsDisabled
            }
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
