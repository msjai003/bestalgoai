
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BottomNav } from '@/components/BottomNav';
import Header from '@/components/Header';

const Learn2Earn = () => {
  return (
    <div className="bg-charcoalPrimary min-h-screen flex flex-col">
      <Header />
      <TooltipProvider>
        <main className="flex-1 pt-16 pb-20 px-4 max-w-4xl mx-auto w-full">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-white mb-2">Learn & Earn</h1>
            <p className="text-gray-400">Master trading and earn rewards while learning</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-cyan/20 to-cyan/5 border-cyan/30">
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-white mb-2">Trading Academy</h2>
                <p className="text-gray-300 mb-4">
                  Learn through interactive modules, quizzes, and personalized study paths.
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <span className="block">✓ 30+ Lessons</span>
                    <span className="block">✓ Earn certificates</span>
                  </div>
                  <Link to="/trading-academy">
                    <Button variant="default" className="bg-cyan text-charcoalPrimary hover:bg-cyan/90">
                      Start Learning
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30">
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-white mb-2">Trading Challenges</h2>
                <p className="text-gray-300 mb-4">
                  Put your skills to the test with real market simulations and competitions.
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <span className="block">✓ Win prizes</span>
                    <span className="block">✓ Leaderboards</span>
                  </div>
                  <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Featured Courses</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="bg-charcoalSecondary border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-white">{course.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 mb-2">{course.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-400">{course.modules} modules</span>
                      <Link to="/trading-academy">
                        <Button variant="outline" size="sm" className="text-xs h-8 text-cyan border-cyan/20 hover:bg-cyan/10">
                          View Course
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <Card className="bg-charcoalSecondary border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold text-white">Join our Learning Community</h2>
                    <p className="text-gray-400 mt-1">Connect with other traders, share insights, and grow together</p>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan to-blue-500 text-charcoalPrimary hover:from-cyan/90 hover:to-blue-500/90">
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </TooltipProvider>
      <BottomNav />
    </div>
  );
};

const featuredCourses = [
  {
    id: 1,
    title: "Trading Fundamentals",
    description: "Learn the basics of market structure and order types",
    modules: 8
  },
  {
    id: 2,
    title: "Technical Analysis",
    description: "Master chart patterns and technical indicators",
    modules: 12
  },
  {
    id: 3,
    title: "Risk Management",
    description: "Protect your capital with proper risk strategies",
    modules: 6
  }
];

export default Learn2Earn;
