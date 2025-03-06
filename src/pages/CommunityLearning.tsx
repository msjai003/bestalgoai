
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  GraduationCap, 
  PlusCircle,
  Image
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

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
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />
      <main className="pt-16 pb-20 px-4">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-[#FF00D4]/10 to-purple-900/20 rounded-2xl p-6 border border-[#FF00D4]/20">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-[#FF00D4]" />
              <h1 className="text-xl font-bold">Community & Learning</h1>
            </div>
            <p className="text-gray-400 mb-4">Connect with traders and master algo trading</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:bg-gradient-to-r hover:from-pink-700 hover:to-purple-700 w-full sm:w-auto"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Join Discussion
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-700 text-white hover:bg-gray-800 w-full sm:w-auto"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          </div>
        </section>

        {/* Create Post Button */}
        <section className="mb-8">
          <Button 
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:bg-gradient-to-r hover:from-pink-700 hover:to-purple-700 flex items-center justify-center gap-2 py-6 rounded-xl shadow-lg"
            onClick={() => navigate("/create-post")}
          >
            <PlusCircle className="w-5 h-5" />
            Create New Post
          </Button>
        </section>

        {/* Learning Paths */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Learning Paths</h2>
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <div key={path.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <path.icon className="w-5 h-5 text-[#FF00D4]" />
                  <h3 className="font-semibold">{path.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">{path.description}</p>
                <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#FF00D4] rounded-full"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{path.progress}% completed</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Community Highlights</h2>
          <div className="space-y-4">
            {communityHighlights.map((group) => (
              <div key={group.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">{group.title}</h3>
                    <p className="text-sm text-gray-400">{group.members}</p>
                  </div>
                  {group.isLive && (
                    <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-4">{group.description}</p>
                <Button 
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:bg-gradient-to-r hover:from-pink-700 hover:to-purple-700"
                >
                  Join Group
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default CommunityLearning;
