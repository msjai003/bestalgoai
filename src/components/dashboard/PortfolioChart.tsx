import React from 'react';
import LineChartWithColoredSegments from '@/components/charts/LineChartWithColoredSegments';

// Fix the import error by using the correct default import

const PortfolioChart = ({ data }) => {
  return (
    <div className="portfolio-chart">
      <LineChartWithColoredSegments 
        data={data}
        dataKey="value"
        positiveColor="#00ff00"
        negativeColor="#ff0000"
        dot={false}
        activeDot={{ r: 6 }}
      />
    </div>
  );
};

export default PortfolioChart;
