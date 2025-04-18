
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Question, AnswerResult } from '@/components/quiz/types';

const BASE_URL = 'http://103.61.225.81:8000';

export const useQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finalLevel, setFinalLevel] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/quiz/start`);
      const processedQuestions = res.data.map((q: Question) => {
        let parsedOptions;
        
        if (typeof q.options === 'string') {
          try {
            const parsed = JSON.parse(q.options);
            parsedOptions = Array.isArray(parsed) ? parsed : Object.values(parsed);
          } catch (err) {
            console.error("Failed to parse options JSON:", err);
            parsedOptions = [];
          }
        } else {
          parsedOptions = q.options;
        }
        
        return {
          ...q,
          options: parsedOptions
        };
      });
      
      setQuestions(processedQuestions);
    } catch (err) {
      console.error("❌ Failed to load quiz:", err);
    }
  };

  const handleSelect = async (option: string) => {
    setSelected(option);
    const q = questions[current];
    try {
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
    } catch (err) {
      console.error("❌ Failed to analyze answer:", err);
    }
  };

  const handleNext = async () => {
    setSelected(null);
    setResult(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      try {
        const level_signals = answers.map((a) => a.level_signal);
        const finalLevelRes = await axios.post(`${BASE_URL}/api/quiz/final_level`, {
          user_id: 'demo_user',
          level_signals,
        });
        setFinalLevel(finalLevelRes.data.final_level);
        await axios.post(`${BASE_URL}/api/quiz/save_result`, {
          user_id: 'demo_user',
          final_level: finalLevelRes.data.final_level,
          results: answers,
        });
      } catch (err) {
        console.error("❌ Failed to save final results:", err);
      }
    }
  };

  return {
    questions,
    current,
    selected,
    result,
    finalLevel,
    handleSelect,
    handleNext,
  };
};
