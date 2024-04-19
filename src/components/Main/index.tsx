import './index.css';

import { useState, useEffect, useCallback } from 'react';

import AlgorithmStates from '../../types/AlgorithmStates.ts';
import AlgorithmSteps from '../../types/AlgorithmSteps.ts';

import algorithms from '../../algorithms';

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
  darkMode: boolean;
  highContrastMode: boolean;
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
  darkMode,
  highContrastMode,
}: MainProps) => {
  const [algorithmPlacings, setAlgorithmPlacings] = useState<string[]>([]);

  const calculateAlgorithms = useCallback(() => {
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
  }, [algorithmStates, algorithmSteps, selectedAlgorithms]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      calculateAlgorithms();
    }, 1000);

    return () => clearTimeout(debounce);
  }, [calculateAlgorithms]);

  return (
    <main>
      <VisualisationControls
        currentStep={currentStep}
        algorithmSteps={algorithmSteps}
        processing={processing}
        setProcessing={setProcessing}
        setAlgorithmStates={setAlgorithmStates}
        calculateAlgorithms={calculateAlgorithms}
      ></VisualisationControls>
      <VisualisationDisplay
        maxValue={maxValue}
        currentStep={currentStep}
        algorithmPlacings={algorithmPlacings}
        selectedAlgorithms={selectedAlgorithms}
        algorithmSteps={algorithmSteps}
        algorithmStates={algorithmStates}
        darkMode={darkMode}
        highContrastMode={highContrastMode}
      ></VisualisationDisplay>
    </main>
  );
};

export default Main;
