import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface CustomDotProps {
  cx: number;
  cy: number;
  payload: any;
  value: number;
  index: number;
  dataKey: string;
  stroke?: string;
}

const CustomizedDot = (props: CustomDotProps) => {
  const { cx, cy, stroke, payload, value, index, dataKey } = props;
  const animationDelay = index * 0.2;
  const dotColor = payload.trend === "up" ? "#4CAF50" : "#F44336";
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      stroke={dotColor}
      strokeWidth={1.5}
      fill="#121212"
      style={{
        animation: `pulseDot 2s infinite ${animationDelay}s`
      }}
      className="animated-dot"
    />
  );
};

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  
  if (!active || !payload || !payload.length) {
    return null;
  }

  const value = payload[0].value;
  const trend = payload[0].payload.trend;
  const color = trend === 'up' ? '#4CAF50' : '#F44336';

  return (
    <div className="bg-charcoalSecondary p-2 border border-gray-800 rounded-lg shadow-lg">
      <p className="text-gray-300 mb-1">{label}</p>
      <p style={{ color }}>₹{new Intl.NumberFormat('en-IN').format(value)}</p>
    </div>
  );
};

interface PortfolioChartProps {
  performanceData: any[];
}

const generateEnhancedData = (baseData: any[]) => {
  return baseData.map(item => ({
    ...item,
    animatedValue: item.value + (Math.random() * 20000 - 10000),
  }));
};

const PortfolioChart = ({ performanceData }: PortfolioChartProps) => {
  const [animatedData, setAnimatedData] = useState(performanceData);
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimatedData(generateEnhancedData(performanceData));
      setAnimationKey(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [performanceData]);

  return (
    <div className="h-48 my-6 relative">
      <div className="absolute inset-0 bg-cyan/5 animate-pulse rounded-lg opacity-30"></div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={animatedData} 
          key={animationKey}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#888" 
            axisLine={{ strokeWidth: 1, stroke: '#444' }}
            tickLine={{ stroke: '#444' }}
          />
          <YAxis 
            stroke="#888" 
            tickFormatter={(value: number) => `₹${(value/100000).toFixed(1)}L`}
            axisLine={{ strokeWidth: 1, stroke: '#444' }}
            tickLine={{ stroke: '#444' }}
            domain={['dataMin - 50000', 'dataMax + 50000']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#777" 
            strokeWidth={1.5} 
            dot={(props) => <CustomizedDot 
              cx={props.cx} 
              cy={props.cy} 
              payload={props.payload} 
              value={props.value} 
              index={props.index} 
              dataKey={props.dataKey} 
            />}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-in-out"
            activeDot={{ 
              stroke: '#00BCD4', 
              strokeWidth: 2, 
              r: 5, 
              fill: '#00BCD4',
              className: "animate-ping-slow"
            }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <g className="recharts-layer recharts-line-dots">
          {animatedData.map((entry, index) => {
            if (index === animatedData.length - 1) return null;
            
            if (index === 0) return null;
            
            const prevEntry = animatedData[index - 1];
            const color = entry.trend === 'up' ? '#4CAF50' : '#F44336';
            
            return (
              <line
                key={`line-${index}`}
                className="animate-draw"
                style={{ 
                  animation: `drawLine 1.5s ease-in-out ${index * 0.1}s forwards`,
                  strokeDasharray: "40",
                  strokeDashoffset: "40"
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default PortfolioChart;
