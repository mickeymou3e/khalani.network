// PieChart.tsx
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { usePieChart } from './usePieChart';
import { PieChartProps } from './PieChart.types';

const PieChart: React.FC<PieChartProps & { isDataUploaded: boolean }> = (props) => {
  const {
    data,
    currentColors,
    dimensions,
    strokeWidth,
    innerRadius,
    handleMouseEnter,
    handleMouseLeave,
  } = usePieChart({ ...props, isDataUploaded: props.isDataUploaded });

  return (
    <ResponsiveContainer width={dimensions} height={dimensions}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + strokeWidth}
          paddingAngle={5}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={currentColors[index % currentColors.length]}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
