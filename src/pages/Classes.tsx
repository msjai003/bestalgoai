
import React, { useState } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Trophy, ArrowRight, Lock, X } from 'lucide-react';
import BasicQuestionsSection from '@/components/classes/BasicQuestionsSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

const Classes = () => {
  const [showBasicQuestions, setShowBasicQuestions] = useState(false);

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <section className="py-8">
          <h1 className="text-2xl font-bold mb-4">
            <span className="text-cyan">Trading</span> Masterclasses
          </h1>
          <p className="text-gray-300 mb-8">
            Enhance your trading skills with our structured learning programs designed for all experience levels.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Module */}
            <Card className="bg-black/40 border border-gray-800 hover:border-cyan/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-500/10 rounded-md">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/20">
                    Beginners
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">Basic Trading</CardTitle>
                <CardDescription className="text-gray-400">
                  Perfect for newcomers to trading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="module-1" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Introduction to Markets
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Learn the fundamentals of financial markets, types of tradable assets, and basic market structure.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="module-2" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Trading Terminology
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Master essential trading terms, order types, and trading concepts every beginner should know.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="module-3" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Basic Chart Analysis
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Understand price charts, timeframes, and fundamental technical analysis patterns.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full group" 
                  variant="outline"
                  onClick={() => setShowBasicQuestions(true)}
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>

            {/* Intermediate Module */}
            <Card className="bg-black/40 border border-gray-800 hover:border-cyan/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-purple-500/10 rounded-md">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400/20">
                    Intermediate
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">Intermediate Strategies</CardTitle>
                <CardDescription className="text-gray-400">
                  For traders with basic market knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="module-1" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Advanced Technical Analysis
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Explore advanced chart patterns, indicators, and multi-timeframe analysis techniques.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="module-2" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Risk Management
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Learn position sizing, stop loss strategies, and portfolio risk management techniques.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="module-3" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Trading Psychology
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Understand the psychological aspects of trading and develop emotional discipline.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full group" variant="outline">
                  Explore Strategies
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Module */}
            <Card className="bg-black/40 border border-gray-800 hover:border-cyan/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-amber-500/10 rounded-md">
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-400/20">
                    Advanced
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">Pro Trading Mastery</CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced techniques for experienced traders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="module-1" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Algorithmic Trading
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Learn to build, test, and deploy automated trading strategies and algorithms.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="module-2" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Advanced Market Dynamics
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Master order flow analysis, market microstructure, and institutional trading techniques.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="module-3" className="border-gray-800">
                      <AccordionTrigger className="text-sm hover:text-cyan">
                        Professional Portfolio Management
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Learn sophisticated portfolio construction, hedging techniques, and advanced risk management.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full group" variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Premium Access
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        
        {/* Dialog for Basic Questions */}
        <Dialog open={showBasicQuestions} onOpenChange={setShowBasicQuestions}>
          <DialogContent className="bg-charcoalPrimary text-white border border-gray-800 max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">
                  <span className="text-cyan">Basic Trading</span> Learning Module
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
              <DialogDescription className="text-gray-400">
                Flip through these questions to test your trading knowledge. Click on a question to reveal its answer.
              </DialogDescription>
            </DialogHeader>
            
            <BasicQuestionsSection />
            
            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Classes;
