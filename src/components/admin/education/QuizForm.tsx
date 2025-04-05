
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  QuizQuestion, 
  QuizAnswer,
  createQuizQuestion,
  updateQuizQuestion,
  createQuizAnswer,
  updateQuizAnswer,
  deleteQuizAnswer
} from '@/lib/services/educationService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEducation } from '@/hooks/useEducation';

const questionSchema = z.object({
  question: z.string().min(3, { message: 'Question is required' }),
  explanation: z.string().optional().nullable(),
  order_index: z.number().int().min(0),
  level: z.enum(['basics', 'intermediate', 'pro']),
  answers: z
    .array(
      z.object({
        id: z.string().optional(),
        answer_text: z.string().min(1, { message: 'Answer text is required' }),
        is_correct: z.boolean().default(false),
        order_index: z.number().int().min(0),
      })
    )
    .min(2, { message: 'At least 2 answers are required' })
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuizFormProps {
  moduleId: string;
  question?: QuizQuestion;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ moduleId, question, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentLevel } = useEducation();
  
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: question ? {
      question: question.question,
      explanation: question.explanation || '',
      order_index: question.order_index,
      level: question.level || currentLevel || 'basics',
      answers: question.answers?.map(answer => ({
        id: answer.id,
        answer_text: answer.answer_text,
        is_correct: answer.is_correct,
        order_index: answer.order_index
      })) || []
    } : {
      question: '',
      explanation: '',
      order_index: 0,
      level: currentLevel || 'basics',
      answers: [
        { answer_text: '', is_correct: false, order_index: 0 },
        { answer_text: '', is_correct: false, order_index: 1 }
      ]
    },
  });

  const handleSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    try {
      let questionId;
      
      // Create or update the question
      if (question) {
        const updatedQuestion = await updateQuizQuestion(question.id, {
          question: data.question,
          explanation: data.explanation,
          order_index: data.order_index,
          level: data.level
        });
        questionId = updatedQuestion?.id;
      } else {
        const newQuestion = await createQuizQuestion({
          module_id: moduleId,
          question: data.question,
          explanation: data.explanation,
          order_index: data.order_index,
          level: data.level
        });
        questionId = newQuestion?.id;
      }
      
      if (!questionId) {
        throw new Error('Failed to save question');
      }
      
      // Handle answers
      const existingAnswerIds = question?.answers?.map(a => a.id) || [];
      const newAnswers = data.answers.filter(a => !a.id);
      const updatedAnswers = data.answers.filter(a => a.id);
      
      // Delete answers that were removed
      const answersToKeep = data.answers.filter(a => a.id).map(a => a.id);
      const answersToDelete = existingAnswerIds.filter(id => !answersToKeep.includes(id));
      
      // Process deletes, updates, and creates
      for (const id of answersToDelete) {
        await deleteQuizAnswer(id!);
      }
      
      for (const answer of updatedAnswers) {
        await updateQuizAnswer(answer.id!, {
          answer_text: answer.answer_text,
          is_correct: answer.is_correct,
          order_index: answer.order_index
        });
      }
      
      for (const answer of newAnswers) {
        await createQuizAnswer({
          question_id: questionId,
          answer_text: answer.answer_text,
          is_correct: answer.is_correct,
          order_index: answer.order_index
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving quiz question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const answers = form.watch('answers') || [];
  
  const addAnswer = () => {
    const currentAnswers = form.getValues('answers') || [];
    form.setValue('answers', [
      ...currentAnswers, 
      { 
        answer_text: '', 
        is_correct: false, 
        order_index: currentAnswers.length 
      }
    ]);
  };
  
  const removeAnswer = (index: number) => {
    const currentAnswers = form.getValues('answers') || [];
    // Don't allow removal if only 2 answers remain
    if (currentAnswers.length <= 2) return;
    
    const updatedAnswers = currentAnswers.filter((_, i) => i !== index);
    // Update order_index values
    updatedAnswers.forEach((answer, i) => {
      answer.order_index = i;
    });
    
    form.setValue('answers', updatedAnswers);
  };

  const correctAnswersCount = answers.filter(a => a.is_correct).length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter the question" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Explanation for the answer" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    placeholder="Order index" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basics">Basics</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Answers</FormLabel>
            <div className="space-x-2">
              {correctAnswersCount === 0 && (
                <Badge variant="destructive">No correct answer selected</Badge>
              )}
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addAnswer}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Answer
              </Button>
            </div>
          </div>
          
          {form.formState.errors.answers?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.answers?.message}
            </p>
          )}
          
          <div className="space-y-3">
            {answers.map((_, index) => (
              <div key={index} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`answers.${index}.is_correct`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`answers.${index}.answer_text`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} placeholder={`Answer ${index + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`answers.${index}.order_index`}
                  render={({ field }) => (
                    <FormItem className="w-16">
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          placeholder="#" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeAnswer(index)}
                  disabled={answers.length <= 2}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {question ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuizForm;
