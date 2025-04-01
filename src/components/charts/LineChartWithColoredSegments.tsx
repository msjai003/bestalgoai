
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
  activeDot?: any; // Changed from CSSProperties to any to match recharts typing
}

const LineChartWithColoredSegments: React.FC<ColoredSegmentsLineChartProps> = ({
  data,
  positiveColor,
  negativeColor,
  dataKey,
  dot = false,
  activeDot
}) => {
  // Group data points into segments with the same color
  const getColoredSegments = () => {
    if (!data || data.length <= 1) return [];
    
    const segments = [];
    let segmentStart = 0;
    
    for (let i = 1; i < data.length; i++) {
      const currentValue = data[i-1].value;
      const nextValue = data[i].value;
      const isRising = nextValue >= currentValue;
      
      // If this is the last point or if direction changes, create a segment
      if (i === data.length - 1 || (isRising !== (data[i+1].value >= nextValue))) {
        segments.push({
          data: data.slice(segmentStart, i + 1),
          color: isRising ? positiveColor : negativeColor
        });
        segmentStart = i;
      }
    }
    
    return segments;
  };

  const segments = getColoredSegments();

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
        {segments.map((segment, index) => (
          <Line
            key={index}
            data={segment.data}
            type="monotone"
            dataKey={dataKey}
            stroke={segment.color}
            dot={dot}
            activeDot={activeDot || { r: 6, stroke: segment.color, strokeWidth: 2 }}
            strokeWidth={1.5}
            connectNulls
          />
        ))}
        {segments.length === 0 && data.length > 0 && (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={positiveColor}
            dot={dot}
            activeDot={activeDot || { r: 6, stroke: positiveColor, strokeWidth: 2 }}
            strokeWidth={1.5}
            connectNulls
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartWithColoredSegments;
