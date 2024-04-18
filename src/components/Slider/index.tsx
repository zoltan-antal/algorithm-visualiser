import './index.css';

interface SliderProps {
  label: string;
  value: number;
  units: string;
  min: number;
  max: number;
  step: number;
  handleChange: (value: React.SetStateAction<number>) => void;
  disabled: boolean;
}

const Slider = ({
  label,
  value,
  units,
  min,
  max,
  step,
  handleChange,
  disabled,
}: SliderProps) => {
  return (
    <label className="slider">
      {label}
      <div className="display">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          disabled={disabled}
        />
        <p>
          {value} {units} / {max} {units}
        </p>
      </div>
    </label>
  );
};

export default Slider;