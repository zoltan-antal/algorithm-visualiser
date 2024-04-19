import { BarChart, Bar, YAxis, ResponsiveContainer } from 'recharts';
import AlgorithmState from '../../types/AlgorithmState';
import CHART_COLOURS from '../../constants/chartColours';

interface AlgorithmChartProps {
  data: AlgorithmState;
  maxValue: number;
  finished: boolean;
  darkMode: boolean;
  highContrastMode: boolean;
}

const AlgorithmChart = ({
  data = { array: [], highlights: [] },
  maxValue,
  finished,
  darkMode,
  highContrastMode,
}: AlgorithmChartProps) => {
  const renderCustomBar = (props: any) => {
    const { index } = props;
    const fillColour = (() => {
      if (!darkMode && !highContrastMode) {
        if (finished) {
          return CHART_COLOURS.light.normal.finished;
        } else if (data.highlights.includes(index)) {
          return CHART_COLOURS.light.normal.highlight;
        } else {
          return CHART_COLOURS.light.normal.default;
        }
      } else if (!darkMode && highContrastMode) {
        if (finished) {
          return CHART_COLOURS.light.highContrast.finished;
        } else if (data.highlights.includes(index)) {
          return CHART_COLOURS.light.highContrast.highlight;
        } else {
          return CHART_COLOURS.light.highContrast.default;
        }
      } else if (darkMode && !highContrastMode) {
        if (finished) {
          return CHART_COLOURS.dark.normal.finished;
        } else if (data.highlights.includes(index)) {
          return CHART_COLOURS.dark.normal.highlight;
        } else {
          return CHART_COLOURS.dark.normal.default;
        }
      } else if (darkMode && highContrastMode) {
        if (finished) {
          return CHART_COLOURS.dark.highContrast.finished;
        } else if (data.highlights.includes(index)) {
          return CHART_COLOURS.dark.highContrast.highlight;
        } else {
          return CHART_COLOURS.dark.highContrast.default;
        }
      }
    })();

    return (
      <g>
        <rect
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          fill={fillColour}
        />
      </g>
    );
  };

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          data={data.array.map((value: number, index: number) => ({
            index,
            value,
          }))}
        >
          <YAxis domain={[0, maxValue]} hide />
          <Bar dataKey="value" shape={renderCustomBar} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlgorithmChart;
