import './VisualisationDisplay.css';

import { useState, useEffect } from 'react';

import AlgorithmStates from '../../types/AlgorithmStates.ts';
import AlgorithmSteps from '../../types/AlgorithmSteps.ts';

import algorithms from '../../algorithms';

import AlgorithmChart from './AlgorithmChart';

interface VisualisationDisplayProps {
  maxValue: number;
  currentStep: React.MutableRefObject<number>;
  algorithmPlacings: string[];
  selectedAlgorithms: Set<string>;
  algorithmSteps: React.MutableRefObject<AlgorithmSteps>;
  algorithmStates: AlgorithmStates;
}

const VisualisationDisplay = ({
  maxValue,
  currentStep,
  algorithmPlacings,
  selectedAlgorithms,
  algorithmSteps,
  algorithmStates,
}: VisualisationDisplayProps) => {
  const [numColumns, setNumColumns] = useState(3);
  const [numRows, setNumRows] = useState(2);

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

  return (
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
  );
};

export default VisualisationDisplay;
