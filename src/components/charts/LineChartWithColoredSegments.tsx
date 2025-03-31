
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
const ColoredSegmentLine: React.FC<LineProps> = (props) => {
  // Instead of directly returning a Line component with modified props,
  // create a proper React functional component that returns the Line
  return React.createElement(Line, {
    ...props,
    stroke: "#777", // Default connecting line color
  });
};

export default ColoredSegmentLine;
