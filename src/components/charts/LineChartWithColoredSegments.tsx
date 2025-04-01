
import React from 'react';
import { Line } from 'recharts';
import type { LineProps } from 'recharts';

interface ColoredLineSegmentProps {
  points: { x: number; y: number; payload: { trend: string } }[];
  strokeWidth?: number;
}

// Component to draw colored line segments based on trend
export const ColoredLineSegments = ({ points, strokeWidth = 2 }: ColoredLineSegmentProps) => {
  return (
    <g>
      {points.map((point, index) => {
        if (index === points.length - 1) return null;
        
        const nextPoint = points[index + 1];
        const trend = point.payload.trend;
        const color = trend === 'up' ? '#4CAF50' : '#F44336';
        
        return (
          <line
            key={`line-${index}`}
            x1={point.x}
            y1={point.y}
            x2={nextPoint.x}
            y2={nextPoint.y}
            stroke={color}
            strokeWidth={strokeWidth}
            className="recharts-curve recharts-line-curve"
          />
        );
      })}
    </g>
  );
};

// A wrapper for the Line component that adds colored segments
const ColoredSegmentLine = (props: LineProps) => {
  // Return the Line component with spread props
  return <Line {...props} />;
};

export default ColoredSegmentLine;
