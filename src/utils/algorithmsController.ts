import AlgorithmStates from '../types/AlgorithmStates.ts';
import AlgorithmSteps from '../types/AlgorithmSteps.ts';
import StepAlgorithmsMode from '../types/StepAlgorithmsMode.ts';

let stopped = false;

const runAlgorithms = async (
  algorithmSteps: AlgorithmSteps,
  currentStep: React.MutableRefObject<number>,
  setAlgorithmStates: React.Dispatch<React.SetStateAction<AlgorithmStates>>,
  speedRef: React.MutableRefObject<number>,
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  stopped = false;

  const n = Math.max(
    ...Object.values(algorithmSteps).map((steps) => steps.length)
  );

  for (let i = currentStep.current; i < n; i++) {
    if (stopped) {
      return;
    }

    currentStep.current = i;

    setAlgorithmStates((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.entries(algorithmSteps).forEach(([key, steps]) => {
        if (steps[i]) {
          updatedStates[key] = steps[i];
        }
      });
      return updatedStates;
    });
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 / speedRef.current)
    );
  }

  setProcessing(false);
};

const stopAlgorithms = () => {
  stopped = true;
};

const stepAlgorithms = (
  algorithmSteps: AlgorithmSteps,
  currentStep: React.MutableRefObject<number>,
  setAlgorithmStates: React.Dispatch<React.SetStateAction<AlgorithmStates>>,
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  mode: StepAlgorithmsMode
) => {
  const n = Math.max(
    ...Object.values(algorithmSteps).map((steps) => steps.length)
  );

  switch (mode) {
    case 'advance':
      currentStep.current++;
      break;

    case 'rewind':
      currentStep.current--;
      break;

    case 'lastStep':
      currentStep.current = n - 1;
      break;

    case 'firstStep':
      currentStep.current = 0;
      break;
  }

  setAlgorithmStates((prevStates) => {
    const updatedStates: AlgorithmStates = structuredClone(prevStates);
    Object.entries(algorithmSteps).forEach(([key, steps]) => {
      const step = steps[currentStep.current]
        ? steps[currentStep.current]
        : steps[steps.length - 1];
      updatedStates[key] = step;
    });
    return updatedStates;
  });

  if (currentStep.current === n - 1) {
    setProcessing(false);
  }
};

export { runAlgorithms, stopAlgorithms, stepAlgorithms };
