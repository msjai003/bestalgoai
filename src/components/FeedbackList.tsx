
import React from 'react';

// Mock feedback data
const mockFeedback = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Great application! I really enjoy using the trading algorithms.',
    created_at: '2025-03-05T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    message: 'The UI is intuitive and the backtesting feature is amazing!',
    created_at: '2025-03-04T15:45:00Z'
  },
  {
    id: '3',
    name: 'Michael Smith',
    email: 'michael@example.com',
    message: 'Would love to see more educational resources about trading strategies.',
    created_at: '2025-03-03T09:15:00Z'
  }
];

const FeedbackList: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg mb-4">
        <p className="text-yellow-300 text-sm mb-2">⚠️ Demo Mode</p>
        <p className="text-gray-400 text-sm">Database connection has been removed. Showing mock feedback data.</p>
      </div>
      
      {mockFeedback.map((feedback) => (
        <div 
          key={feedback.id} 
          className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-white">{feedback.name}</h3>
            <span className="text-xs text-gray-400">
              {new Date(feedback.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-2">{feedback.message}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
