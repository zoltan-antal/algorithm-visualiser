import './index.css';

import ArrayOrder from '../../types/ArrayOrder.ts';
import AlgorithmStates from '../../types/AlgorithmStates.ts';
import AlgorithmSteps from '../../types/AlgorithmSteps.ts';

import ARRAY_ORDER_OPTIONS from '../../constants/arrayOrderOptions.ts';
import ARRAY_SIZE from '../../constants/arraySize.ts';
import VALUE_RANGE from '../../constants/valueRange.ts';

import algorithms from '../../algorithms';
import { algorithmNames } from '../../algorithms';

import Slider from '../Slider';

interface AsideProps {
  processing: boolean;
  currentStep: React.MutableRefObject<number>;
  algorithmStates: AlgorithmStates;
  algorithmSteps: React.MutableRefObject<AlgorithmSteps>;
  arraySize: number;
  setArraySize: React.Dispatch<React.SetStateAction<number>>;
  maxValue: number;
  setMaxValue: React.Dispatch<React.SetStateAction<number>>;
  selectedAlgorithms: Set<string>;
  setSelectedAlgorithms: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedArrayOrder: ArrayOrder;
  setSelectedArrayOrder: React.Dispatch<React.SetStateAction<ArrayOrder>>;
  generateArrays: () => void;
}

const Aside = ({
  processing,
  currentStep,
  algorithmStates,
  algorithmSteps,
  arraySize,
  setArraySize,
  maxValue,
  setMaxValue,
  selectedAlgorithms,
  setSelectedAlgorithms,
  selectedArrayOrder,
  setSelectedArrayOrder,
  generateArrays,
}: AsideProps) => {
  return (
    <aside>
      <h2 className="title">Settings</h2>
      <div className="section" id="algorithms-displayed">
        <div className="header">
          <h3 className="title">Algorithms displayed</h3>
          <button
            onClick={() => setSelectedAlgorithms(new Set(algorithmNames))}
            disabled={processing}
          >
            Select all
          </button>
        </div>
        <div className="items">
          {algorithmNames.map((algorithmName) => (
            <label key={algorithmName} className="item">
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
                  Object.keys(algorithmSteps.current).forEach(
                    (algorithmName) => {
                      algorithmStates[algorithmName] =
                        algorithmSteps.current[algorithmName][0];
                    }
                  );
                  currentStep.current = 0;
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
          <h3 className="title">Input parameters</h3>
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
            max={
              !/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              )
                ? ARRAY_SIZE.max
                : Math.min(30, ARRAY_SIZE.max)
            }
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
  );
};

export default Aside;
