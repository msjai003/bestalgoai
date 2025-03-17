
import React from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PerformanceMetricsSection } from '@/components/performance/PerformanceMetricsSection';
import { AchievementsSection } from '@/components/performance/AchievementsSection';
import { LeaderboardSection } from '@/components/performance/LeaderboardSection';
import { UserProfileHeader } from '@/components/performance/UserProfileHeader';

const PerformanceMetrics = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <UserProfileHeader />
      
      <main className="p-4 space-y-6">
        <PerformanceMetricsSection />
        <AchievementsSection />
        <LeaderboardSection />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PerformanceMetrics;
