
import React from 'react';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  GraduationCap, 
  PlusCircle
} from "lucide-react";

const learningPaths = [
  {
    id: 1,
    title: "Algo Trading Fundamentals",
    description: "Master the basics of algorithmic trading",
    progress: 60,
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Advanced Strategy Design",
    description: "Learn to create complex trading strategies",
    progress: 30,
    icon: GraduationCap,
  }
];

const communityHighlights = [
  {
    id: 1,
    title: "Trading Discussion",
    members: "2.4k members",
    description: "Join the conversation about market trends and strategies",
    isLive: true,
  },
  {
    id: 2,
    title: "Strategy Sharing",
    members: "1.8k members",
    description: "Share and discover winning trading strategies",
    isLive: false,
  }
];

const CommunityLearning = () => {
  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Header />
      <main className="pt-16 pb-20 px-4">
        {/* Categories Scroll */}
        <div className="py-3 overflow-x-auto whitespace-nowrap mb-4">
          <div className="inline-flex space-x-3">
            <button className="px-4 py-2 bg-[#00BCD4] rounded-full text-sm">All Posts</button>
            <button className="px-4 py-2 bg-[#1F1F1F] rounded-full text-sm text-[#B0B0B0]">Trading Strategies</button>
            <button className="px-4 py-2 bg-[#1F1F1F] rounded-full text-sm text-[#B0B0B0]">Market Analysis</button>
            <button className="px-4 py-2 bg-[#1F1F1F] rounded-full text-sm text-[#B0B0B0]">Risk Management</button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="mb-8">
          <div className="bg-[#1F1F1F] rounded-xl p-4">
            <div className="mb-3">
              <span className="text-[#00BCD4] text-xs">FEATURED</span>
            </div>
            <h2 className="text-lg font-bold mb-2">AI Trading Strategies: A Complete Guide for 2025</h2>
            <p className="text-[#B0B0B0] text-sm mb-4">Learn how to leverage AI for better trading decisions and automated strategy execution...</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" className="w-8 h-8 rounded-full" alt="author"/>
                <div>
                  <p className="text-sm">Rahul Sharma</p>
                  <p className="text-xs text-[#B0B0B0]">10 min read</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-[#B0B0B0]">
                <i className="fa-regular fa-heart"></i>
                <i className="fa-regular fa-bookmark"></i>
              </div>
            </div>
          </div>
        </section>

        {/* Create Post Button */}
        <section className="mb-8">
          <Link 
            to="/create-post"
            className="w-full bg-[#00BCD4] text-white flex items-center justify-center gap-2 py-6 rounded-xl shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Post
          </Link>
        </section>

        {/* Recent Posts */}
        <section>
          <h3 className="text-lg font-bold mb-3">Recent Posts</h3>
          
          <div className="bg-[#1F1F1F] rounded-xl p-4 mb-3">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <span className="text-xs text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-1 rounded">Trading Strategies</span>
                <h4 className="text-base font-bold my-2">Market Making Strategy Using ML Models</h4>
                <p className="text-sm text-[#B0B0B0] mb-3">Implementation of machine learning in market making...</p>
                <div className="flex items-center space-x-4 text-xs text-[#B0B0B0]">
                  <span>5 min read</span>
                  <span>•</span>
                  <span>42 likes</span>
                </div>
              </div>
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/24cfae832e-73acd5c0bef96eeb24cf.png" alt="trading chart" />
              </div>
            </div>
          </div>

          <div className="bg-[#1F1F1F] rounded-xl p-4 mb-3">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <span className="text-xs text-[#00BCD4] bg-[#00BCD4]/10 px-2 py-1 rounded">Market Analysis</span>
                <h4 className="text-base font-bold my-2">Nifty 50: Technical Analysis for Q2 2025</h4>
                <p className="text-sm text-[#B0B0B0] mb-3">In-depth analysis of market trends and predictions...</p>
                <div className="flex items-center space-x-4 text-xs text-[#B0B0B0]">
                  <span>8 min read</span>
                  <span>•</span>
                  <span>127 likes</span>
                </div>
              </div>
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/6187763f59-631a34e904b183b423d5.png" alt="stock chart" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default CommunityLearning;
