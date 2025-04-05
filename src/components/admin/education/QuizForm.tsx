
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
  createQuizQuestion,
  updateQuizQuestion
} from '@/lib/services/educationService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEducation } from '@/hooks/useEducation';

const questionSchema = z.object({
  question: z.string().min(3, { message: 'Question is required' }),
  explanation: z.string().optional().nullable(),
  order_index: z.number().int().min(0),
  level: z.enum(['basics', 'intermediate', 'pro']),
  options: z
    .array(
      z.object({
        text: z.string().min(1, { message: 'Option text is required' }),
        is_correct: z.boolean().default(false),
      })
    )
    .min(2, { message: 'At least 2 options are required' })
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
  
  // Convert QuizQuestion to form data format
  const getDefaultValues = (): QuestionFormData => {
    if (question) {
      return {
        question: question.question,
        explanation: question.explanation || '',
        order_index: question.order_index || 0,
        level: question.level,
        options: question.options.map((text, index) => ({
          text,
          is_correct: index === question.correct_answer
        }))
      };
    } 
    
    return {
      question: '',
      explanation: '',
      order_index: 0,
      level: currentLevel || 'basics',
      options: [
        { text: '', is_correct: false },
        { text: '', is_correct: false }
      ]
    };
  };
  
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: getDefaultValues()
  });

  const handleSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    try {
      // Get the correct answer index
      const correctAnswerIndex = data.options.findIndex(opt => opt.is_correct);
      if (correctAnswerIndex === -1) {
        form.setError('options', { 
          message: 'You must select at least one correct answer' 
        });
        setIsSubmitting(false);
        return;
      }
      
      // Convert form data to QuizQuestion format
      const questionData = {
        module_id: moduleId,
        question: data.question,
        explanation: data.explanation || undefined,
        order_index: data.order_index,
        level: data.level,
        options: data.options.map(opt => opt.text),
        correct_answer: correctAnswerIndex
      };
      
      if (question) {
        // Update question
        await updateQuizQuestion(question.id, questionData);
      } else {
        // Create question
        await createQuizQuestion(questionData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving quiz question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = form.watch('options') || [];
  
  const addOption = () => {
    const currentOptions = form.getValues('options') || [];
    form.setValue('options', [
      ...currentOptions, 
      { text: '', is_correct: false }
    ]);
  };
  
  const removeOption = (index: number) => {
    const currentOptions = form.getValues('options') || [];
    // Don't allow removal if only 2 options remain
    if (currentOptions.length <= 2) return;
    
    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    form.setValue('options', updatedOptions);
  };

  // Ensure only one option is marked as correct
  const handleCorrectChange = (index: number, checked: boolean) => {
    if (checked) {
      const currentOptions = form.getValues('options');
      const updatedOptions = currentOptions.map((opt, i) => ({
        ...opt,
        is_correct: i === index
      }));
      form.setValue('options', updatedOptions);
    }
  };

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
                    value={field.value} 
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
            <FormLabel className="text-base">Options</FormLabel>
            <div className="space-x-2">
              {!options.some(opt => opt.is_correct) && (
                <Badge variant="destructive">No correct answer selected</Badge>
              )}
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addOption}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Option
              </Button>
            </div>
          </div>
          
          {form.formState.errors.options?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.options?.message}
            </p>
          )}
          
          <div className="space-y-3">
            {options.map((_, index) => (
              <div key={index} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`options.${index}.is_correct`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            handleCorrectChange(index, checked as boolean);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`options.${index}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} placeholder={`Option ${index + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
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
