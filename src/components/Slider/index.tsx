import './index.css';

interface SliderProps {
  label: string;
  value: number;
  units: string;
  min: number;
  max: number;
  step: number;
  handleChange: (value: number) => void;
  disabled: boolean;
  tooltip?: string;
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
  tooltip,
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
          data-tooltip={tooltip ? tooltip : ''}
        />
        <p className="value">
          {value} {units} / {max} {units}
        </p>
      </div>
    </label>
  );
};

export default Slider;
