interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  handleChange: (value: React.SetStateAction<number>) => void;
  disabled: boolean;
}

const Slider = ({
  label,
  value,
  min,
  max,
  step,
  handleChange,
  disabled,
}: SliderProps) => {
  return (
    <div className="slider">
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
        {label}: {value}
      </p>
    </div>
  );
};

export default Slider;
