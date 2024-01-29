import { BarChart, Bar } from 'recharts';

const BarChartComponent = ({ data }: any) => {
  const renderCustomBar = (props: any) => {
    const { index } = props;

    return (
      <g>
        <rect
          {...props}
          fill={data.highlights.includes(index) ? 'red' : '#8884d8'}
        />
      </g>
    );
  };

  return (
    <BarChart
      width={300}
      height={300}
      data={data.array.map((value: any, index: any) => ({
        index: index + 1,
        value,
      }))}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <Bar dataKey="value" shape={renderCustomBar} />
    </BarChart>
  );
};

export default BarChartComponent;
