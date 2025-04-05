
import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  InfoIcon, 
  Book, 
  Award, 
  Database, 
  ArrowUpDown, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X 
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
  const [isAdmin, setIsAdmin] = useState(true); // In a real scenario, you'd fetch this from Supabase
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuizQuestion>({
    module_id: 'module1',
    level: 'basics',
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: ''
  });
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch quiz questions
  const fetchQuizQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('education_quiz_clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setQuizQuestions(data || []);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  // Handle input changes for new question
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion(prev => ({
      ...prev,
      options: updatedOptions
    }));
  };

  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      [field]: field === 'correct_answer' ? parseInt(value) : value
    }));
  };

  // Save a new quiz question
  const saveQuizQuestion = async () => {
    if (!newQuestion.question || !newQuestion.options.every(opt => opt.trim() !== '')) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields including all options",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('education_quiz_clients')
        .insert({
          module_id: newQuestion.module_id,
          level: newQuestion.level,
          question: newQuestion.question,
          options: newQuestion.options,
          correct_answer: newQuestion.correct_answer,
          explanation: newQuestion.explanation
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Quiz question added successfully"
      });
      
      // Reset form and refresh questions
      setNewQuestion({
        module_id: 'module1',
        level: 'basics',
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: ''
      });
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error saving quiz question:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz question",
        variant: "destructive"
      });
    }
  };

  // Edit a question
  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion({
      ...question,
      options: Array.isArray(question.options) ? question.options : JSON.parse(question.options as unknown as string)
    });
    setIsEditing(true);
  };

  // Update edited question
  const updateQuizQuestion = async () => {
    if (!editingQuestion) return;
    
    try {
      const { error } = await supabase
        .from('education_quiz_clients')
        .update({
          module_id: editingQuestion.module_id,
          level: editingQuestion.level,
          question: editingQuestion.question,
          options: editingQuestion.options,
          correct_answer: editingQuestion.correct_answer,
          explanation: editingQuestion.explanation
        })
        .eq('id', editingQuestion.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Quiz question updated successfully"
      });
      
      setIsEditing(false);
      setEditingQuestion(null);
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error updating quiz question:', error);
      toast({
        title: "Error",
        description: "Failed to update quiz question",
        variant: "destructive"
      });
    }
  };

  // Delete a question
  const deleteQuizQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const { error } = await supabase
        .from('education_quiz_clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Quiz question deleted successfully"
      });
      
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz question",
        variant: "destructive"
      });
    }
  };

  // Handle input changes for editing
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingQuestion) return;
    
    const { name, value } = e.target;
    setEditingQuestion(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  // Handle option changes for editing
  const handleEditOptionChange = (index: number, value: string) => {
    if (!editingQuestion) return;
    
    const updatedOptions = [...editingQuestion.options];
    updatedOptions[index] = value;
    setEditingQuestion(prev => ({
      ...prev!,
      options: updatedOptions
    }));
  };

  // Handle select changes for editing
  const handleEditSelectChange = (field: string, value: string) => {
    if (!editingQuestion) return;
    
    setEditingQuestion(prev => ({
      ...prev!,
      [field]: field === 'correct_answer' ? parseInt(value) : value
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
          <div className="flex items-center justify-between px-4 h-16">
            <h1 className="text-lg font-semibold">Education Management</h1>
          </div>
        </header>

        <main className="pt-20 px-4 pb-24">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Education Content Management</h2>
            <p className="text-gray-400">
              Manage education modules, content, quiz questions, and badges. All changes will immediately reflect in the user-facing education section.
            </p>
          </div>
          
          <Alert className="mb-6 bg-blue-900/20 border-blue-800 text-blue-100">
            <Database className="h-4 w-4 text-blue-500" />
            <AlertTitle>New Quiz Questions Table</AlertTitle>
            <AlertDescription>
              The education_quiz_clients table has been created to store quiz questions. You can now manage quiz questions 
              directly in the database. The education section will fetch questions from this table.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="modules" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="modules" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Modules & Content</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Badges</span>
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Quiz Questions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules">
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-center mb-6">
                  <Database className="h-12 w-12 text-red-500 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Database Tables Removed</h3>
                  <p className="text-gray-300 max-w-md mx-auto">
                    Education module management is unavailable because required database tables have been removed.
                    The application now uses local static data.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium mb-2 flex items-center"><ArrowUpDown className="h-4 w-4 mr-2 text-amber-500" /> Missing Tables</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• education_modules</li>
                      <li>• education_quiz_questions</li>
                      <li>• education_quiz_answers</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium mb-2 flex items-center"><InfoIcon className="h-4 w-4 mr-2 text-cyan" /> Alternative</h4>
                    <p className="text-sm text-gray-400">
                      All education content is now served from local static data in src/data/educationData.ts
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="badges">
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
                <p className="text-gray-300 mb-4">Badge management functionality is unavailable because required database tables have been removed.</p>
                <Button variant="outline" className="border-cyan text-cyan hover:bg-cyan/10" disabled>
                  View Remaining Database Tables
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="questions">
              <div className="space-y-6">
                {isEditing ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>Edit Quiz Question</CardTitle>
                      <CardDescription className="text-gray-400">Update the question details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-module-id">Module ID</Label>
                          <Select 
                            value={editingQuestion?.module_id} 
                            onValueChange={(value) => handleEditSelectChange('module_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Module" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => (
                                <SelectItem key={i} value={`module${i + 1}`}>Module {i + 1}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-level">Level</Label>
                          <Select 
                            value={editingQuestion?.level} 
                            onValueChange={(value) => handleEditSelectChange('level', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basics">Basics</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-question">Question</Label>
                        <Textarea 
                          id="edit-question" 
                          name="question" 
                          value={editingQuestion?.question || ''} 
                          onChange={handleEditInputChange} 
                          rows={3}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Options (select correct one)</Label>
                        {editingQuestion?.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => handleEditOptionChange(index, e.target.value)}
                              className="bg-gray-700 border-gray-600 flex-1"
                              placeholder={`Option ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant={editingQuestion.correct_answer === index ? "default" : "outline"}
                              className={editingQuestion.correct_answer === index ? "bg-green-600 hover:bg-green-700" : ""}
                              onClick={() => handleEditSelectChange('correct_answer', index.toString())}
                              size="sm"
                            >
                              {editingQuestion.correct_answer === index ? <Check className="h-4 w-4" /> : "Set Correct"}
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-explanation">Explanation (Optional)</Label>
                        <Textarea 
                          id="edit-explanation" 
                          name="explanation" 
                          value={editingQuestion?.explanation || ''} 
                          onChange={handleEditInputChange} 
                          rows={2}
                          className="bg-gray-700 border-gray-600"
                          placeholder="Explain why the correct answer is right (optional)"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="border-gray-600"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingQuestion(null);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={updateQuizQuestion}
                        className="bg-cyan text-gray-900 hover:bg-cyan/90"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Update Question
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>Add New Quiz Question</CardTitle>
                      <CardDescription className="text-gray-400">Create a new quiz question for modules</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="module-id">Module ID</Label>
                          <Select 
                            value={newQuestion.module_id} 
                            onValueChange={(value) => handleSelectChange('module_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Module" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => (
                                <SelectItem key={i} value={`module${i + 1}`}>Module {i + 1}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="level">Level</Label>
                          <Select 
                            value={newQuestion.level} 
                            onValueChange={(value) => handleSelectChange('level', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basics">Basics</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea 
                          id="question" 
                          name="question" 
                          value={newQuestion.question} 
                          onChange={handleInputChange} 
                          rows={3}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Options (select correct one)</Label>
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              className="bg-gray-700 border-gray-600 flex-1"
                              placeholder={`Option ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant={newQuestion.correct_answer === index ? "default" : "outline"}
                              className={newQuestion.correct_answer === index ? "bg-green-600 hover:bg-green-700" : ""}
                              onClick={() => handleSelectChange('correct_answer', index.toString())}
                              size="sm"
                            >
                              {newQuestion.correct_answer === index ? <Check className="h-4 w-4" /> : "Set Correct"}
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="explanation">Explanation (Optional)</Label>
                        <Textarea 
                          id="explanation" 
                          name="explanation" 
                          value={newQuestion.explanation || ''} 
                          onChange={handleInputChange} 
                          rows={2}
                          className="bg-gray-700 border-gray-600"
                          placeholder="Explain why the correct answer is right (optional)"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={saveQuizQuestion}
                        className="bg-cyan text-gray-900 hover:bg-cyan/90 w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Existing Quiz Questions</h3>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Loading questions...</p>
                    </div>
                  ) : quizQuestions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-gray-400">No quiz questions found. Add some using the form above!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {quizQuestions.map((question) => (
                        <Card key={question.id} className="bg-gray-800 border-gray-700">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-blue-600">{question.level}</Badge>
                                  <Badge className="bg-gray-600">Module {question.module_id.replace('module', '')}</Badge>
                                </div>
                                <CardTitle className="text-md">{question.question}</CardTitle>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEdit(question)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 w-8 p-0 border-red-800 text-red-500 hover:bg-red-900/20"
                                  onClick={() => question.id && deleteQuizQuestion(question.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {Array.isArray(question.options) ? (
                                question.options.map((option, index) => (
                                  <div 
                                    key={index} 
                                    className={`p-2 rounded ${index === question.correct_answer ? 'bg-green-900/30 border border-green-800' : 'bg-gray-700'}`}
                                  >
                                    {index === question.correct_answer && (
                                      <Check className="h-4 w-4 text-green-500 inline mr-2" />
                                    )}
                                    {option}
                                  </div>
                                ))
                              ) : (
                                <p className="text-red-400">Options format error</p>
                              )}
                              
                              {question.explanation && (
                                <div className="mt-3 p-3 bg-blue-900/20 border border-blue-800 rounded">
                                  <p className="text-sm text-blue-100">
                                    <span className="font-semibold">Explanation:</span> {question.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
};

export default AdminEducation;
