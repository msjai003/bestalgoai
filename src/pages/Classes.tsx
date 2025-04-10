
import React, { useState } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Infinity } from 'lucide-react';
import BasicQuestionsSection from '@/components/classes/BasicQuestionsSection';
import IntermediateQuestionsSection from '@/components/classes/IntermediateQuestionsSection';
import ProQuestionsSection from '@/components/classes/ProQuestionsSection';
import BasicQuiz from '@/components/classes/BasicQuiz';
import IntermediateQuiz from '@/components/classes/IntermediateQuiz';
import ProQuiz from '@/components/classes/ProQuiz';
import '../styles/education.css';

const Classes = () => {
  const [level, setLevel] = useState<'basic' | 'intermediate' | 'pro'>('basic');
  const [mode, setMode] = useState<'flashcards' | 'quiz'>('flashcards');

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <section className="py-6">
          <h1 className="text-3xl font-bold mb-2">Trading Classes</h1>
          <p className="text-gray-400 mb-6">
            Explore our trading questions and answers to boost your knowledge
          </p>
          
          <Tabs 
            defaultValue={level} 
            onValueChange={(value) => setLevel(value as 'basic' | 'intermediate' | 'pro')}
            className="w-full mb-6"
          >
            <TabsList className="grid w-full grid-cols-3 bg-charcoalSecondary border border-gray-800/40">
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
          </Tabs>
          
          <h2 className="text-2xl font-bold mb-4">
            {level === 'basic' ? 'Basic Trading' : 
             level === 'intermediate' ? 'Intermediate Trading' : 
             'Professional Algo Trading'}
          </h2>
          
          <div className="flex mb-6">
            <Button
              variant={mode === 'flashcards' ? 'cyan' : 'outline'}
              className={`w-1/2 ${mode === 'flashcards' ? '' : 'border-gray-700 text-gray-300'}`}
              onClick={() => setMode('flashcards')}
            >
              Flashcards
            </Button>
            <Button
              variant={mode === 'quiz' ? 'cyan' : 'outline'}
              className={`w-1/2 ${mode === 'quiz' ? '' : 'border-gray-700 text-gray-300'}`}
              onClick={() => setMode('quiz')}
            >
              Quiz
            </Button>
          </div>
          
          {mode === 'flashcards' ? (
            <>
              {level === 'basic' && <BasicQuestionsSection />}
              {level === 'intermediate' && <IntermediateQuestionsSection />}
              {level === 'pro' && <ProQuestionsSection />}
            </>
          ) : (
            <>
              {level === 'basic' && <BasicQuiz />}
              {level === 'intermediate' && <IntermediateQuiz />}
              {level === 'pro' && <ProQuiz />}
            </>
          )}
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Classes;
