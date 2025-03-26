
import React from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, GraduationCap, Trophy, ArrowRight, Clock } from 'lucide-react';

const Education = () => {
  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      
      <main className="container mx-auto px-4 pb-20">
        {/* Hero section */}
        <section className="relative py-10 md:py-16 mb-8">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/5"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="text-cyan mr-2 h-8 w-8" />
              <h2 className="text-cyan text-2xl font-bold">Learn Trading</h2>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              <span className="text-cyan">Educational Resources</span> for Algorithmic Trading
            </h1>
            
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              Enhance your trading skills with our comprehensive library of courses, guides, and resources designed for traders of all experience levels.
            </p>
            
            <Button variant="gradient" className="px-6 py-5 rounded-xl font-semibold shadow-lg hover:animate-micro-glow">
              Browse All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
        
        {/* Featured courses section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold">Featured Courses</h2>
            <Button variant="outline" className="border-cyan/40 text-cyan hover:bg-cyan/10">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Algorithmic Trading Fundamentals",
                description: "Learn the core concepts of algorithmic trading and how to implement your first strategy.",
                level: "Beginner",
                duration: "4 hours",
                badge: "Popular"
              },
              {
                title: "Python for Financial Analysis",
                description: "Master Python programming language for data analysis and building trading algorithms.",
                level: "Intermediate",
                duration: "6 hours",
                badge: "New"
              },
              {
                title: "Advanced Strategy Optimization",
                description: "Fine-tune your trading algorithms for maximum performance and risk management.",
                level: "Advanced",
                duration: "8 hours",
                badge: null
              }
            ].map((course, index) => (
              <Card key={index} className="premium-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg mb-1">{course.title}</CardTitle>
                      <CardDescription className="text-gray-300 text-sm">{course.description}</CardDescription>
                    </div>
                    {course.badge && (
                      <Badge variant={course.badge === "New" ? "default" : "secondary"} className="ml-2">
                        {course.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-300">
                    <div className="flex items-center">
                      <GraduationCap className="mr-1 h-4 w-4 text-cyan" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-cyan" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full mt-4">View Course</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Learning paths section */}
        <section className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-8">Learning Paths</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="premium-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 flex items-center">
                <div className="p-3 rounded-lg bg-cyan/10 mr-4">
                  <BookOpen className="h-6 w-6 text-cyan" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Beginner to Pro</h3>
                  <p className="text-gray-300 text-sm">6 courses • 20+ hours</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">Start from the basics of market analysis and progress to creating your own trading algorithms.</p>
              <Button variant="outline" className="w-full border-cyan/40 text-cyan hover:bg-cyan/10">
                Explore Path
              </Button>
            </div>
            
            <div className="premium-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 flex items-center">
                <div className="p-3 rounded-lg bg-cyan/10 mr-4">
                  <Trophy className="h-6 w-6 text-cyan" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Advanced Strategies</h3>
                  <p className="text-gray-300 text-sm">5 courses • 18+ hours</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">Master complex trading strategies and optimization techniques for experienced traders.</p>
              <Button variant="outline" className="w-full border-cyan/40 text-cyan hover:bg-cyan/10">
                Explore Path
              </Button>
            </div>
          </div>
        </section>
        
        {/* Resources section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-8">Free Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Trading Glossary",
                description: "Comprehensive glossary of trading terms and concepts",
                icon: <BookOpen className="h-5 w-5 text-cyan" />
              },
              {
                title: "Strategy Templates",
                description: "Download ready-to-use algorithmic trading templates",
                icon: <GraduationCap className="h-5 w-5 text-cyan" />
              },
              {
                title: "Market Analysis",
                description: "Weekly market analysis and trading opportunities",
                icon: <Trophy className="h-5 w-5 text-cyan" />
              }
            ].map((resource, index) => (
              <div key={index} className="premium-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  {resource.icon}
                  <h3 className="ml-2 font-bold text-lg text-white">{resource.title}</h3>
                </div>
                <p className="text-gray-300 mb-4">{resource.description}</p>
                <Button variant="secondary" className="w-full">Access Resource</Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Education;
