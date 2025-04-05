
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Check
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Define the quiz question interface
interface QuizQuestion {
  id?: string;
  module_id: string;
  level: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

const AdminEducation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('quiz-questions');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for quiz question editing
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<QuizQuestion>({
    module_id: '',
    level: 'basics',
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: ''
  });
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion>({
    module_id: '',
    level: 'basics',
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: ''
  });
  
  // Fetch quiz questions
  const fetchQuizQuestions = async () => {
    setLoading(true);
    try {
      // Define the type for the quiz data from Supabase
      type QuizClientData = {
        id: string;
        module_id: string;
        level: string;
        question: string;
        options: string | string[];
        correct_answer: number;
        explanation?: string;
        created_at?: string;
        updated_at?: string;
      };
      
      const { data, error } = await supabase
        .from('education_quiz_clients' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match our QuizQuestion interface
      const formattedQuestions = (data || []).map((item: any) => ({
        id: item.id,
        module_id: item.module_id,
        level: item.level,
        question: item.question,
        options: Array.isArray(item.options) ? item.options : JSON.parse(item.options as string),
        correct_answer: item.correct_answer,
        explanation: item.explanation
      }));
      
      setQuizQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch quiz questions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && activeTab === 'quiz-questions') {
      fetchQuizQuestions();
    }
  }, [user, activeTab]);
  
  // Reset the form for adding a new question
  const resetQuestionForm = () => {
    setNewQuestion({
      module_id: '',
      level: 'basics',
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      explanation: ''
    });
  };
  
  // Handle quiz question option change
  const handleOptionChange = (index: number, value: string, isNewQuestion: boolean) => {
    if (isNewQuestion) {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index] = value;
      setNewQuestion({
        ...newQuestion,
        options: updatedOptions
      });
    } else {
      const updatedOptions = [...editingQuestion.options];
      updatedOptions[index] = value;
      setEditingQuestion({
        ...editingQuestion,
        options: updatedOptions
      });
    }
  };
  
  // Add a new quiz question
  const handleAddQuestion = async () => {
    if (!newQuestion.module_id || !newQuestion.question || newQuestion.options.some(opt => !opt)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields including all options',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Format the options for storage
      const formattedOptions = JSON.stringify(newQuestion.options);
      
      const { error } = await supabase
        .from('education_quiz_clients' as any)
        .insert({
          module_id: newQuestion.module_id,
          level: newQuestion.level,
          question: newQuestion.question,
          options: formattedOptions,
          correct_answer: newQuestion.correct_answer,
          explanation: newQuestion.explanation
        });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Quiz question added successfully!'
      });
      
      // Reset form and fetch updated questions
      setIsAddingQuestion(false);
      resetQuestionForm();
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error adding quiz question:', error);
      toast({
        title: 'Error',
        description: 'Failed to add quiz question. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Start editing a question
  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestionId(question.id || null);
    setEditingQuestion({
      ...question,
      options: [...question.options]
    });
  };
  
  // Update a quiz question
  const handleUpdateQuestion = async () => {
    if (!editingQuestionId) return;
    
    try {
      // Format the options for storage
      const formattedOptions = JSON.stringify(editingQuestion.options);
      
      const { error } = await supabase
        .from('education_quiz_clients' as any)
        .update({
          module_id: editingQuestion.module_id,
          level: editingQuestion.level,
          question: editingQuestion.question,
          options: formattedOptions,
          correct_answer: editingQuestion.correct_answer,
          explanation: editingQuestion.explanation
        })
        .eq('id', editingQuestionId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Quiz question updated successfully!'
      });
      
      // Reset editing state and fetch updated questions
      setEditingQuestionId(null);
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error updating quiz question:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quiz question. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Delete a quiz question
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const { error } = await supabase
        .from('education_quiz_clients' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Quiz question deleted successfully!'
      });
      
      // Fetch updated questions
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete quiz question. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
  };
  
  // Cancel adding
  const handleCancelAdd = () => {
    setIsAddingQuestion(false);
    resetQuestionForm();
  };
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Education Admin Panel</h1>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Logged in as:</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 pt-24 pb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="quiz-questions" className="flex-1">Quiz Questions</TabsTrigger>
              <TabsTrigger value="modules" className="flex-1">Modules</TabsTrigger>
              <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
              <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
            </TabsList>
            
            {/* Quiz Questions Tab */}
            <TabsContent value="quiz-questions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Quiz Questions</h2>
                <Button 
                  onClick={() => {
                    setIsAddingQuestion(true);
                    resetQuestionForm();
                  }}
                  disabled={isAddingQuestion}
                >
                  Add New Question
                </Button>
              </div>
              
              {isAddingQuestion && (
                <Card className="mb-6 border-2 border-blue-500">
                  <CardHeader>
                    <CardTitle>Add New Quiz Question</CardTitle>
                    <CardDescription>Create a new quiz question for a module</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Module ID</label>
                        <Input 
                          placeholder="e.g., module1"
                          value={newQuestion.module_id}
                          onChange={e => setNewQuestion({...newQuestion, module_id: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Level</label>
                        <Select
                          value={newQuestion.level}
                          onValueChange={value => setNewQuestion({...newQuestion, level: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basics">Basics</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Question</label>
                      <Textarea 
                        placeholder="Enter the question here"
                        value={newQuestion.question}
                        onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Options</label>
                      <div className="space-y-2">
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-grow">
                              <Input 
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={e => handleOptionChange(index, e.target.value, true)}
                              />
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                name="correct-option-new" 
                                checked={newQuestion.correct_answer === index}
                                onChange={() => setNewQuestion({...newQuestion, correct_answer: index})}
                                className="mr-1" 
                              />
                              <label className="text-sm">Correct</label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Explanation (Optional)</label>
                      <Textarea 
                        placeholder="Provide explanation for the correct answer"
                        value={newQuestion.explanation || ''}
                        onChange={e => setNewQuestion({...newQuestion, explanation: e.target.value})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelAdd}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddQuestion}>
                      Save Question
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {loading ? (
                <div className="flex justify-center p-8">
                  <p>Loading quiz questions...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizQuestions.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p>No quiz questions found. Create your first question!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    quizQuestions.map(question => (
                      <Card key={question.id} className={editingQuestionId === question.id ? 'border-2 border-blue-500' : ''}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>
                                {editingQuestionId === question.id ? (
                                  <Input 
                                    value={editingQuestion.question}
                                    onChange={e => setEditingQuestion({...editingQuestion, question: e.target.value})}
                                    className="text-lg font-bold"
                                  />
                                ) : (
                                  question.question
                                )}
                              </CardTitle>
                              <CardDescription className="flex mt-1 gap-2">
                                <Badge variant="outline">{question.module_id}</Badge>
                                <Badge variant="secondary">{question.level}</Badge>
                              </CardDescription>
                            </div>
                            
                            {editingQuestionId === question.id ? (
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="default" onClick={handleUpdateQuestion}>
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost" onClick={() => handleEditQuestion(question)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteQuestion(question.id || '')}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {editingQuestionId === question.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Module ID</label>
                                  <Input 
                                    value={editingQuestion.module_id}
                                    onChange={e => setEditingQuestion({...editingQuestion, module_id: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Level</label>
                                  <Select
                                    value={editingQuestion.level}
                                    onValueChange={value => setEditingQuestion({...editingQuestion, level: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="basics">Basics</SelectItem>
                                      <SelectItem value="intermediate">Intermediate</SelectItem>
                                      <SelectItem value="pro">Pro</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">Options</label>
                                <div className="space-y-2">
                                  {editingQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="flex-grow">
                                        <Input 
                                          value={option}
                                          onChange={e => handleOptionChange(index, e.target.value, false)}
                                        />
                                      </div>
                                      <div className="flex items-center">
                                        <input 
                                          type="radio" 
                                          name="correct-option-edit" 
                                          checked={editingQuestion.correct_answer === index}
                                          onChange={() => setEditingQuestion({...editingQuestion, correct_answer: index})}
                                          className="mr-1" 
                                        />
                                        <label className="text-sm">Correct</label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">Explanation</label>
                                <Textarea 
                                  value={editingQuestion.explanation || ''}
                                  onChange={e => setEditingQuestion({...editingQuestion, explanation: e.target.value})}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-sm font-medium mb-2">Options:</h3>
                              <ul className="space-y-1">
                                {question.options.map((option, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs ${
                                      index === question.correct_answer ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}>
                                      {index === question.correct_answer && <Check className="h-3.5 w-3.5" />}
                                    </span>
                                    <span className={index === question.correct_answer ? 'font-semibold' : ''}>
                                      {option}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              
                              {question.explanation && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                  <p className="text-sm">
                                    <span className="font-semibold">Explanation:</span> {question.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Placeholder for Modules Tab */}
            <TabsContent value="modules">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Modules Management</h2>
              </div>
              <p>Coming soon. Module management functionality will be implemented here.</p>
            </TabsContent>
            
            {/* Placeholder for Content Tab */}
            <TabsContent value="content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Content Management</h2>
              </div>
              <p>Coming soon. Content management functionality will be implemented here.</p>
            </TabsContent>
            
            {/* Placeholder for Badges Tab */}
            <TabsContent value="badges">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Badges Management</h2>
              </div>
              <p>Coming soon. Badge management functionality will be implemented here.</p>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminEducation;
