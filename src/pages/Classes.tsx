
import React, { useState } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Infinity } from 'lucide-react';
import BasicQuestionsSection from '@/components/classes/BasicQuestionsSection';
import IntermediateQuestionsSection from '@/components/classes/IntermediateQuestionsSection';
import ProQuestionsSection from '@/components/classes/ProQuestionsSection';

const Classes = () => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="my-6">
          <h1 className="text-2xl font-bold mb-4">Trading Classes</h1>
          <p className="text-gray-300">Explore our trading questions and answers to boost your knowledge</p>
        </div>
        
        <Tabs defaultValue="basic" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-charcoalSecondary border border-gray-800/40">
            <TabsTrigger value="basic" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
              <BookOpen className="h-4 w-4" />
              <span>Basic</span>
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
              <Brain className="h-4 w-4" />
              <span>Intermediate</span>
            </TabsTrigger>
            <TabsTrigger value="pro" className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary">
              <Infinity className="h-4 w-4" />
              <span>Pro</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicQuestionsSection />
          </TabsContent>
          
          <TabsContent value="intermediate">
            <IntermediateQuestionsSection />
          </TabsContent>
          
          <TabsContent value="pro">
            <ProQuestionsSection />
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Classes;
