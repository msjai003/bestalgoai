
import React from 'react';

interface SignupRecord {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  message: string;
  created_at: string;
}

// Sample static data to display instead of fetching from database
const sampleSignups: SignupRecord[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    mobileNumber: '+1 123-456-7890',
    message: 'Excited to try out this platform!',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    mobileNumber: '+1 234-567-8901',
    message: 'Looking forward to seeing the features.',
    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    mobileNumber: '+1 345-678-9012',
    message: 'Great concept! Can\'t wait to get started.',
    created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

const FeedbackList: React.FC = () => {
  const signups = sampleSignups;

  if (signups.length === 0) {
    return (
      <div className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg">
        <p className="text-gray-400 text-sm">No sign ups yet. Be the first to sign up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">      
      {signups.map((signup) => (
        <div 
          key={signup.id} 
          className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-white">{signup.name}</h3>
            <span className="text-xs text-gray-400">
              {new Date(signup.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-2">{signup.message}</p>
          <div className="text-gray-400 text-xs flex flex-col sm:flex-row sm:gap-4">
            <span>{signup.email}</span>
            {signup.mobileNumber && <span>{signup.mobileNumber}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
