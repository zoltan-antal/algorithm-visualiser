import './index.css';

import { useState } from 'react';

import AlgorithmStates from '../../types/AlgorithmStates.ts';
import AlgorithmSteps from '../../types/AlgorithmSteps.ts';

import VisualisationControls from './VisualisationControls.tsx';
import VisualisationDisplay from './VisualisationDisplay.tsx';

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
  const [algorithmPlacings, setAlgorithmPlacings] = useState<string[]>([]);

  return (
    <main>
      <VisualisationControls
        selectedAlgorithms={selectedAlgorithms}
        currentStep={currentStep}
        algorithmSteps={algorithmSteps}
        processing={processing}
        setProcessing={setProcessing}
        algorithmStates={algorithmStates}
        setAlgorithmStates={setAlgorithmStates}
        setAlgorithmPlacings={setAlgorithmPlacings}
      ></VisualisationControls>
      <VisualisationDisplay
        maxValue={maxValue}
        currentStep={currentStep}
        algorithmPlacings={algorithmPlacings}
        selectedAlgorithms={selectedAlgorithms}
        algorithmSteps={algorithmSteps}
        algorithmStates={algorithmStates}
      ></VisualisationDisplay>
    </main>
  );
};

export default Main;
