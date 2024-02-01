import AlgorithmStates from '../types/AlgorithmStates.ts';
import AlgorithmSteps from '../types/AlgorithmSteps.ts';

let stopped = false;

const runAlgorithms = async (
  algorithmSteps: AlgorithmSteps,
  currentStep: React.MutableRefObject<number>,
  setAlgorithmStates: React.Dispatch<React.SetStateAction<AlgorithmStates>>,
  timeout: number,
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  stopped = false;

  const n = Math.max(
    ...Object.values(algorithmSteps).map((steps) => steps.length)
  );

  for (let i = currentStep.current; i < n; i++) {
    currentStep.current = i;

    if (stopped) {
      return;
    }

    setAlgorithmStates((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.entries(algorithmSteps).forEach(([key, steps]) => {
        if (steps[i]) {
          updatedStates[key] = steps[i];
        }
      });
      return updatedStates;
    });
    await new Promise((resolve) => setTimeout(resolve, timeout));
  }

  setProcessing(false);
};

const stopAlgorithms = () => {
  stopped = true;
};

export default runAlgorithms;
export { stopAlgorithms };
