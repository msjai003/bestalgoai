
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: string;
  value: number;
}

interface ColoredSegmentsLineChartProps {
  data: DataPoint[];
  positiveColor: string;
  negativeColor: string;
  dataKey: string;
  dot?: boolean;
  activeDot?: { r?: number };  // Changed from CSSProperties to valid prop type
}

const LineChartWithColoredSegments: React.FC<ColoredSegmentsLineChartProps> = ({
  data,
  positiveColor,
  negativeColor,
  dataKey,
  dot = false,
  activeDot = { r: 5 }  // Set a default value with valid prop
}) => {
  const renderLine = () => {
    const segments = [];
    let currentSegment = [];

    for (let i = 0; i < data.length - 1; i++) {
      const currentPoint = data[i];
      const nextPoint = data[i + 1];

      const color = nextPoint.value >= currentPoint.value ? positiveColor : negativeColor;

      currentSegment.push({
        ...currentPoint,
        color,
      });

      segments.push(
        <Line 
          key={i}  // Added key to avoid React warnings
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          dot={dot}
          activeDot={activeDot}
          strokeWidth={1.5}
          connectNulls
        />
      );
      currentSegment = [];
    }

    return <>{segments}</>;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="time" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        {renderLine()}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartWithColoredSegments;
