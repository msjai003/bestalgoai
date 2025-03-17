
import React from 'react';

type Trader = {
  id: number;
  rank: number;
  name: string;
  avatarUrl: string;
  performance: string;
};

export const LeaderboardSection = () => {
  const traders: Trader[] = [
    {
      id: 1,
      rank: 1,
      name: 'Mike Chen',
      avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      performance: '+234.5%'
    },
    {
      id: 2,
      rank: 2,
      name: 'Sarah Lee',
      avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      performance: '+187.2%'
    }
  ];

  return (
    <section className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Top Traders</h2>
        <button className="text-xs text-purple-400">View All</button>
      </div>
      <div className="space-y-3">
        {traders.map((trader) => (
          <div key={trader.id} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-purple-400">{trader.rank}</span>
              <img src={trader.avatarUrl} className="w-8 h-8 rounded-full" alt={trader.name} />
              <div className="text-sm">{trader.name}</div>
            </div>
            <div className="text-green-400">{trader.performance}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
