
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Question, AnswerResult } from './quiz/types';
import QuizQuestion from './quiz/QuizQuestion';
import QuizComplete from './quiz/QuizComplete';

const BASE_URL = 'http://103.61.225.81:8000';

const SmartQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finalLevel, setFinalLevel] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/quiz/start`)
      .then((res) => {
        // Process questions to handle stringified JSON options
        const processedQuestions = res.data.map((q: Question) => ({
          ...q,
          options: typeof q.options === 'string'
            ? Object.values(JSON.parse(q.options))
            : q.options
        }));
        setQuestions(processedQuestions);
      })
      .catch((err) => {
        console.error("❌ Failed to load quiz:", err);
      });
  }, []);

  const handleSelect = async (option: string) => {
    setSelected(option);
    const q = questions[current];
    const res = await axios.post(`${BASE_URL}/api/quiz/analyze`, {
      user_id: 'demo_user',
      question: q.question,
      options: q.options,
      selected_answer: option,
      level: q.level,
    });
    setResult(res.data);
    setAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        selected: option,
        ...res.data,
      },
    ]);
  };

  const handleNext = () => {
    setSelected(null);
    setResult(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const level_signals = answers.map((a) => a.level_signal);
      axios
        .post(`${BASE_URL}/api/quiz/final_level`, {
          user_id: 'demo_user',
          level_signals,
        })
        .then((res) => {
          setFinalLevel(res.data.final_level);
          axios.post(`${BASE_URL}/api/quiz/save_result`, {
            user_id: 'demo_user',
            final_level: res.data.final_level,
            results: answers,
          });
        });
    }
  };

  if (finalLevel) {
    return <QuizComplete finalLevel={finalLevel} />;
  }

  if (questions.length === 0) {
    return (
      <Card className="glass-card p-8 text-center mt-10 max-w-xl mx-auto rounded-3xl">
        <p className="text-gray-400">Loading your assessment...</p>
      </Card>
    );
  }

  return (
    <QuizQuestion
      currentQuestion={questions[current]}
      current={current}
      questionsLength={questions.length}
      selected={selected}
      result={result}
      onSelect={handleSelect}
      onNext={handleNext}
    />
  );
};

export default SmartQuiz;
