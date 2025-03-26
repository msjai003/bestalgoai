
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, EditIcon, TrashIcon, BookOpen, GraduationCap, Brain, Infinity, AlertCircle } from 'lucide-react';

type Module = {
  id: string;
  title: string;
  description: string;
  level: 'basics' | 'intermediate' | 'pro';
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

type Flashcard = {
  id: string;
  module_id: string;
  front_content: string;
  back_content: string;
  sort_order: number;
};

type Quiz = {
  id: string;
  module_id: string;
  title: string;
  description: string;
  passing_score: number;
};

type Question = {
  id: string;
  quiz_id: string;
  question: string;
  sort_order: number;
  answers?: Answer[];
};

type Answer = {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  sort_order: number;
};

const EducationAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');
  
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [flashcardDialogOpen, setFlashcardDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ type: string; id: string; name: string } | null>(null);
  
  // For module form
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    level: 'basics' as 'basics' | 'intermediate' | 'pro',
    sort_order: 0,
    is_active: true
  });
  
  // For flashcard form
  const [flashcardForm, setFlashcardForm] = useState({
    module_id: '',
    front_content: '',
    back_content: '',
    sort_order: 0
  });
  
  // For quiz form
  const [quizForm, setQuizForm] = useState({
    module_id: '',
    title: '',
    description: '',
    passing_score: 70
  });
  
  // For question form
  const [questionForm, setQuestionForm] = useState({
    quiz_id: '',
    question: '',
    sort_order: 0
  });
  
  // For answer form
  const [answerForm, setAnswerForm] = useState({
    question_id: '',
    answer_text: '',
    is_correct: false,
    sort_order: 0
  });
  
  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [user]);
  
  // Load modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const { data, error } = await supabase
          .from('learning_modules')
          .select('*')
          .order('level', { ascending: true })
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        setModules(data || []);
      } catch (error: any) {
        console.error('Error fetching modules:', error);
        toast({
          title: 'Error',
          description: 'Failed to load modules',
          variant: 'destructive'
        });
      }
    };
    
    fetchModules();
  }, [toast]);
  
  // Load flashcards when module is selected
  useEffect(() => {
    if (!selectedModule) {
      setFlashcards([]);
      return;
    }
    
    const fetchFlashcards = async () => {
      try {
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('module_id', selectedModule.id)
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        setFlashcards(data || []);
      } catch (error: any) {
        console.error('Error fetching flashcards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load flashcards',
          variant: 'destructive'
        });
      }
    };
    
    fetchFlashcards();
  }, [selectedModule, toast]);
  
  // Load quizzes when module is selected
  useEffect(() => {
    if (!selectedModule) {
      setQuizzes([]);
      return;
    }
    
    const fetchQuizzes = async () => {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('module_id', selectedModule.id);
        
        if (error) throw error;
        setQuizzes(data || []);
      } catch (error: any) {
        console.error('Error fetching quizzes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load quizzes',
          variant: 'destructive'
        });
      }
    };
    
    fetchQuizzes();
  }, [selectedModule, toast]);
  
  // Load questions when quiz is selected
  useEffect(() => {
    if (!selectedQuiz) {
      setQuestions([]);
      return;
    }
    
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', selectedQuiz.id)
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        setQuestions(data || []);
      } catch (error: any) {
        console.error('Error fetching questions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load questions',
          variant: 'destructive'
        });
      }
    };
    
    fetchQuestions();
  }, [selectedQuiz, toast]);
  
  // Load answers when question is selected
  useEffect(() => {
    if (!selectedQuestion) {
      setAnswers([]);
      return;
    }
    
    const fetchAnswers = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_answers')
          .select('*')
          .eq('question_id', selectedQuestion.id)
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        setAnswers(data || []);
      } catch (error: any) {
        console.error('Error fetching answers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load answers',
          variant: 'destructive'
        });
      }
    };
    
    fetchAnswers();
  }, [selectedQuestion, toast]);
  
  // Handle module selection
  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    setSelectedQuiz(null);
    setSelectedQuestion(null);
    setSelectedFlashcard(null);
  };
  
  // Handle quiz selection
  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setSelectedQuestion(null);
  };
  
  // Handle question selection
  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
  };
  
  // Open module dialog
  const openModuleDialog = (module?: Module) => {
    if (module) {
      setModuleForm({
        title: module.title,
        description: module.description || '',
        level: module.level,
        sort_order: module.sort_order,
        is_active: module.is_active
      });
      setSelectedModule(module);
    } else {
      setModuleForm({
        title: '',
        description: '',
        level: 'basics',
        sort_order: modules.length,
        is_active: true
      });
      setSelectedModule(null);
    }
    setModuleDialogOpen(true);
  };
  
  // Open flashcard dialog
  const openFlashcardDialog = (flashcard?: Flashcard) => {
    if (!selectedModule) {
      toast({
        title: 'Error',
        description: 'Please select a module first',
        variant: 'destructive'
      });
      return;
    }
    
    if (flashcard) {
      setFlashcardForm({
        module_id: flashcard.module_id,
        front_content: flashcard.front_content,
        back_content: flashcard.back_content || '',
        sort_order: flashcard.sort_order
      });
      setSelectedFlashcard(flashcard);
    } else {
      setFlashcardForm({
        module_id: selectedModule.id,
        front_content: '',
        back_content: '',
        sort_order: flashcards.length
      });
      setSelectedFlashcard(null);
    }
    setFlashcardDialogOpen(true);
  };
  
  // Open quiz dialog
  const openQuizDialog = (quiz?: Quiz) => {
    if (!selectedModule) {
      toast({
        title: 'Error',
        description: 'Please select a module first',
        variant: 'destructive'
      });
      return;
    }
    
    if (quiz) {
      setQuizForm({
        module_id: quiz.module_id,
        title: quiz.title,
        description: quiz.description || '',
        passing_score: quiz.passing_score
      });
      setSelectedQuiz(quiz);
    } else {
      setQuizForm({
        module_id: selectedModule.id,
        title: '',
        description: '',
        passing_score: 70
      });
      setSelectedQuiz(null);
    }
    setQuizDialogOpen(true);
  };
  
  // Open question dialog
  const openQuestionDialog = (question?: Question) => {
    if (!selectedQuiz) {
      toast({
        title: 'Error',
        description: 'Please select a quiz first',
        variant: 'destructive'
      });
      return;
    }
    
    if (question) {
      setQuestionForm({
        quiz_id: question.quiz_id,
        question: question.question,
        sort_order: question.sort_order
      });
      setSelectedQuestion(question);
    } else {
      setQuestionForm({
        quiz_id: selectedQuiz.id,
        question: '',
        sort_order: questions.length
      });
      setSelectedQuestion(null);
    }
    setQuestionDialogOpen(true);
  };
  
  // Open answer dialog
  const openAnswerDialog = (answer?: Answer) => {
    if (!selectedQuestion) {
      toast({
        title: 'Error',
        description: 'Please select a question first',
        variant: 'destructive'
      });
      return;
    }
    
    if (answer) {
      setAnswerForm({
        question_id: answer.question_id,
        answer_text: answer.answer_text,
        is_correct: answer.is_correct,
        sort_order: answer.sort_order
      });
      setSelectedAnswer(answer);
    } else {
      setAnswerForm({
        question_id: selectedQuestion.id,
        answer_text: '',
        is_correct: false,
        sort_order: answers.length
      });
      setSelectedAnswer(null);
    }
    setAnswerDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (type: string, id: string, name: string) => {
    setDeleteItem({ type, id, name });
    setDeleteDialogOpen(true);
  };
  
  // Handle module save
  const handleModuleSave = async () => {
    try {
      if (selectedModule) {
        // Update existing module
        const { error } = await supabase
          .from('learning_modules')
          .update({
            title: moduleForm.title,
            description: moduleForm.description,
            level: moduleForm.level,
            sort_order: moduleForm.sort_order,
            is_active: moduleForm.is_active
          })
          .eq('id', selectedModule.id);
        
        if (error) throw error;
        
        // Update local state
        setModules(modules.map(m => 
          m.id === selectedModule.id 
            ? { ...m, ...moduleForm, id: selectedModule.id } 
            : m
        ));
        
        toast({
          title: 'Success',
          description: 'Module updated successfully'
        });
      } else {
        // Create new module
        const { data, error } = await supabase
          .from('learning_modules')
          .insert({
            title: moduleForm.title,
            description: moduleForm.description,
            level: moduleForm.level,
            sort_order: moduleForm.sort_order,
            is_active: moduleForm.is_active
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setModules([...modules, data]);
        
        toast({
          title: 'Success',
          description: 'Module created successfully'
        });
      }
      
      setModuleDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving module:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  // Handle flashcard save
  const handleFlashcardSave = async () => {
    try {
      if (selectedFlashcard) {
        // Update existing flashcard
        const { error } = await supabase
          .from('flashcards')
          .update({
            front_content: flashcardForm.front_content,
            back_content: flashcardForm.back_content,
            sort_order: flashcardForm.sort_order
          })
          .eq('id', selectedFlashcard.id);
        
        if (error) throw error;
        
        // Update local state
        setFlashcards(flashcards.map(f => 
          f.id === selectedFlashcard.id 
            ? { ...f, ...flashcardForm, id: selectedFlashcard.id } 
            : f
        ));
        
        toast({
          title: 'Success',
          description: 'Flashcard updated successfully'
        });
      } else {
        // Create new flashcard
        const { data, error } = await supabase
          .from('flashcards')
          .insert({
            module_id: flashcardForm.module_id,
            front_content: flashcardForm.front_content,
            back_content: flashcardForm.back_content,
            sort_order: flashcardForm.sort_order
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setFlashcards([...flashcards, data]);
        
        toast({
          title: 'Success',
          description: 'Flashcard created successfully'
        });
      }
      
      setFlashcardDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving flashcard:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  // Handle quiz save
  const handleQuizSave = async () => {
    try {
      if (selectedQuiz) {
        // Update existing quiz
        const { error } = await supabase
          .from('quizzes')
          .update({
            title: quizForm.title,
            description: quizForm.description,
            passing_score: quizForm.passing_score
          })
          .eq('id', selectedQuiz.id);
        
        if (error) throw error;
        
        // Update local state
        setQuizzes(quizzes.map(q => 
          q.id === selectedQuiz.id 
            ? { ...q, ...quizForm, id: selectedQuiz.id } 
            : q
        ));
        
        toast({
          title: 'Success',
          description: 'Quiz updated successfully'
        });
      } else {
        // Create new quiz
        const { data, error } = await supabase
          .from('quizzes')
          .insert({
            module_id: quizForm.module_id,
            title: quizForm.title,
            description: quizForm.description,
            passing_score: quizForm.passing_score
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setQuizzes([...quizzes, data]);
        
        toast({
          title: 'Success',
          description: 'Quiz created successfully'
        });
      }
      
      setQuizDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  // Handle question save
  const handleQuestionSave = async () => {
    try {
      if (selectedQuestion) {
        // Update existing question
        const { error } = await supabase
          .from('quiz_questions')
          .update({
            question: questionForm.question,
            sort_order: questionForm.sort_order
          })
          .eq('id', selectedQuestion.id);
        
        if (error) throw error;
        
        // Update local state
        setQuestions(questions.map(q => 
          q.id === selectedQuestion.id 
            ? { ...q, ...questionForm, id: selectedQuestion.id } 
            : q
        ));
        
        toast({
          title: 'Success',
          description: 'Question updated successfully'
        });
      } else {
        // Create new question
        const { data, error } = await supabase
          .from('quiz_questions')
          .insert({
            quiz_id: questionForm.quiz_id,
            question: questionForm.question,
            sort_order: questionForm.sort_order
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setQuestions([...questions, data]);
        
        toast({
          title: 'Success',
          description: 'Question created successfully'
        });
      }
      
      setQuestionDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving question:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  // Handle answer save
  const handleAnswerSave = async () => {
    try {
      if (selectedAnswer) {
        // Update existing answer
        const { error } = await supabase
          .from('quiz_answers')
          .update({
            answer_text: answerForm.answer_text,
            is_correct: answerForm.is_correct,
            sort_order: answerForm.sort_order
          })
          .eq('id', selectedAnswer.id);
        
        if (error) throw error;
        
        // Update local state
        setAnswers(answers.map(a => 
          a.id === selectedAnswer.id 
            ? { ...a, ...answerForm, id: selectedAnswer.id } 
            : a
        ));
        
        toast({
          title: 'Success',
          description: 'Answer updated successfully'
        });
      } else {
        // Create new answer
        const { data, error } = await supabase
          .from('quiz_answers')
          .insert({
            question_id: answerForm.question_id,
            answer_text: answerForm.answer_text,
            is_correct: answerForm.is_correct,
            sort_order: answerForm.sort_order
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setAnswers([...answers, data]);
        
        toast({
          title: 'Success',
          description: 'Answer created successfully'
        });
      }
      
      setAnswerDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving answer:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!deleteItem) return;
    
    try {
      const { type, id } = deleteItem;
      
      switch (type) {
        case 'module':
          await supabase.from('learning_modules').delete().eq('id', id);
          setModules(modules.filter(m => m.id !== id));
          setSelectedModule(null);
          break;
        case 'flashcard':
          await supabase.from('flashcards').delete().eq('id', id);
          setFlashcards(flashcards.filter(f => f.id !== id));
          break;
        case 'quiz':
          await supabase.from('quizzes').delete().eq('id', id);
          setQuizzes(quizzes.filter(q => q.id !== id));
          setSelectedQuiz(null);
          break;
        case 'question':
          await supabase.from('quiz_questions').delete().eq('id', id);
          setQuestions(questions.filter(q => q.id !== id));
          setSelectedQuestion(null);
          break;
        case 'answer':
          await supabase.from('quiz_answers').delete().eq('id', id);
          setAnswers(answers.filter(a => a.id !== id));
          break;
      }
      
      toast({
        title: 'Success',
        description: `${type} deleted successfully`
      });
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteItem(null);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan"></div>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-gray-400 mb-6">You do not have administrator privileges to view this page.</p>
              <Button variant="default" onClick={() => window.location.href = '/'}>
                Go to Home
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Education Content Management</h1>
            <Button onClick={() => openModuleDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Module
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Modules List */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Learning Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                {modules.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    No modules found. Create your first module.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {modules.map((module) => (
                      <div 
                        key={module.id}
                        className={`p-3 rounded-md flex justify-between items-center cursor-pointer transition-colors ${
                          selectedModule?.id === module.id 
                            ? 'bg-cyan/20 border border-cyan/40' 
                            : 'hover:bg-charcoalSecondary/50 border border-transparent'
                        }`}
                        onClick={() => handleModuleSelect(module)}
                      >
                        <div className="flex items-center">
                          {module.level === 'basics' && <BookOpen className="h-4 w-4 mr-2 text-cyan" />}
                          {module.level === 'intermediate' && <Brain className="h-4 w-4 mr-2 text-cyan" />}
                          {module.level === 'pro' && <Infinity className="h-4 w-4 mr-2 text-cyan" />}
                          <div>
                            <div className="font-medium">{module.title}</div>
                            <div className="text-xs text-gray-400">
                              {module.level.charAt(0).toUpperCase() + module.level.slice(1)}
                              {!module.is_active && ' • Inactive'}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            openModuleDialog(module);
                          }}>
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog('module', module.id, module.title);
                          }}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Content Area */}
            <Card className="col-span-2">
              {selectedModule ? (
                <>
                  <CardHeader>
                    <CardTitle>{selectedModule.title}</CardTitle>
                    <CardDescription>
                      Level: {selectedModule.level.charAt(0).toUpperCase() + selectedModule.level.slice(1)}
                      {!selectedModule.is_active && ' • Inactive'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="flashcards" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-2 mb-6">
                        <TabsTrigger value="flashcards" className="flex gap-2 items-center">
                          <BookOpen className="h-4 w-4" />
                          <span>Flashcards</span>
                        </TabsTrigger>
                        <TabsTrigger value="quizzes" className="flex gap-2 items-center">
                          <Brain className="h-4 w-4" />
                          <span>Quizzes</span>
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="flashcards">
                        <div className="flex justify-between mb-4">
                          <h3 className="text-lg font-medium">Flashcards</h3>
                          <Button variant="outline" onClick={() => openFlashcardDialog()}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Flashcard
                          </Button>
                        </div>
                        
                        {flashcards.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 border rounded-md">
                            No flashcards found for this module.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {flashcards.map((flashcard) => (
                              <Card key={flashcard.id} className="overflow-hidden">
                                <div className="flex justify-between p-4 bg-charcoalSecondary/30">
                                  <span className="font-medium">Card #{flashcard.sort_order + 1}</span>
                                  <div className="flex space-x-1">
                                    <Button variant="ghost" size="icon" onClick={() => openFlashcardDialog(flashcard)}>
                                      <EditIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog('flashcard', flashcard.id, `Card #${flashcard.sort_order + 1}`)}>
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <div className="mb-4">
                                    <div className="text-sm text-gray-400 mb-1">Front:</div>
                                    <div className="p-2 bg-charcoalSecondary/20 rounded-md">
                                      {flashcard.front_content}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-400 mb-1">Back:</div>
                                    <div className="p-2 bg-charcoalSecondary/20 rounded-md">
                                      {flashcard.back_content}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="quizzes">
                        <div className="flex justify-between mb-4">
                          <h3 className="text-lg font-medium">Quizzes</h3>
                          <Button variant="outline" onClick={() => openQuizDialog()}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Quiz
                          </Button>
                        </div>
                        
                        {quizzes.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 border rounded-md">
                            No quizzes found for this module.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {quizzes.map((quiz) => (
                              <Card key={quiz.id} className="overflow-hidden">
                                <div 
                                  className={`flex justify-between p-4 ${
                                    selectedQuiz?.id === quiz.id
                                      ? 'bg-cyan/20'
                                      : 'bg-charcoalSecondary/30'
                                  } cursor-pointer`}
                                  onClick={() => handleQuizSelect(quiz)}
                                >
                                  <div>
                                    <span className="font-medium">{quiz.title}</span>
                                    <div className="text-xs text-gray-400">
                                      Passing score: {quiz.passing_score}%
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button variant="ghost" size="icon" onClick={(e) => {
                                      e.stopPropagation();
                                      openQuizDialog(quiz);
                                    }}>
                                      <EditIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={(e) => {
                                      e.stopPropagation();
                                      openDeleteDialog('quiz', quiz.id, quiz.title);
                                    }}>
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {selectedQuiz?.id === quiz.id && (
                                  <div className="p-4">
                                    <div className="flex justify-between mb-4">
                                      <h4 className="font-medium">Questions</h4>
                                      <Button variant="outline" size="sm" onClick={() => openQuestionDialog()}>
                                        <PlusCircle className="h-3 w-3 mr-1" />
                                        Add Question
                                      </Button>
                                    </div>
                                    
                                    {questions.length === 0 ? (
                                      <div className="text-center py-4 text-gray-400 border rounded-md">
                                        No questions found for this quiz.
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        {questions.map((question) => (
                                          <div 
                                            key={question.id} 
                                            className={`border rounded-md overflow-hidden ${
                                              selectedQuestion?.id === question.id
                                                ? 'border-cyan/40 bg-cyan/5'
                                                : 'border-gray-700'
                                            }`}
                                          >
                                            <div 
                                              className="flex justify-between p-3 bg-charcoalSecondary/20 cursor-pointer"
                                              onClick={() => handleQuestionSelect(question)}
                                            >
                                              <span className="font-medium">Q{question.sort_order + 1}: {question.question}</span>
                                              <div className="flex space-x-1">
                                                <Button variant="ghost" size="icon" onClick={(e) => {
                                                  e.stopPropagation();
                                                  openQuestionDialog(question);
                                                }}>
                                                  <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={(e) => {
                                                  e.stopPropagation();
                                                  openDeleteDialog('question', question.id, `Question #${question.sort_order + 1}`);
                                                }}>
                                                  <TrashIcon className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                            
                                            {selectedQuestion?.id === question.id && (
                                              <div className="p-3">
                                                <div className="flex justify-between mb-2">
                                                  <h5 className="text-sm font-medium">Answer Options</h5>
                                                  <Button variant="outline" size="sm" onClick={() => openAnswerDialog()}>
                                                    <PlusCircle className="h-3 w-3 mr-1" />
                                                    Add Answer
                                                  </Button>
                                                </div>
                                                
                                                {answers.length === 0 ? (
                                                  <div className="text-center py-3 text-gray-400 border rounded-md text-sm">
                                                    No answers found for this question.
                                                  </div>
                                                ) : (
                                                  <Table>
                                                    <TableHeader>
                                                      <TableRow>
                                                        <TableHead>Answer Text</TableHead>
                                                        <TableHead className="w-[100px]">Correct?</TableHead>
                                                        <TableHead className="w-[100px]">Actions</TableHead>
                                                      </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                      {answers.map((answer) => (
                                                        <TableRow key={answer.id}>
                                                          <TableCell>{answer.answer_text}</TableCell>
                                                          <TableCell className="text-center">
                                                            {answer.is_correct ? '✅' : '❌'}
                                                          </TableCell>
                                                          <TableCell>
                                                            <div className="flex space-x-1">
                                                              <Button variant="ghost" size="icon" onClick={() => openAnswerDialog(answer)}>
                                                                <EditIcon className="h-4 w-4" />
                                                              </Button>
                                                              <Button variant="ghost" size="icon" onClick={() => openDeleteDialog('answer', answer.id, answer.answer_text)}>
                                                                <TrashIcon className="h-4 w-4" />
                                                              </Button>
                                                            </div>
                                                          </TableCell>
                                                        </TableRow>
                                                      ))}
                                                    </TableBody>
                                                  </Table>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-96">
                  <GraduationCap className="h-12 w-12 text-gray-500 mb-4" />
                  <h2 className="text-xl font-medium mb-2">No Module Selected</h2>
                  <p className="text-gray-400 text-center max-w-md mb-6">
                    Select a module from the list on the left or create a new one to manage its content.
                  </p>
                  <Button onClick={() => openModuleDialog()}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Module
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </main>
        
        {/* Module Dialog */}
        <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedModule ? 'Edit Module' : 'Create Module'}</DialogTitle>
              <DialogDescription>
                {selectedModule 
                  ? 'Update the details for this learning module.'
                  : 'Add a new learning module to your course.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={moduleForm.title} 
                  onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                  placeholder="Module title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={moduleForm.description} 
                  onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                  placeholder="Module description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select 
                    value={moduleForm.level} 
                    onValueChange={(value) => setModuleForm({
                      ...moduleForm, 
                      level: value as 'basics' | 'intermediate' | 'pro'
                    })}
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
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input 
                    id="sort_order" 
                    type="number" 
                    value={moduleForm.sort_order} 
                    onChange={(e) => setModuleForm({...moduleForm, sort_order: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={moduleForm.is_active}
                  onChange={(e) => setModuleForm({...moduleForm, is_active: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-600"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleModuleSave}>{selectedModule ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Flashcard Dialog */}
        <Dialog open={flashcardDialogOpen} onOpenChange={setFlashcardDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedFlashcard ? 'Edit Flashcard' : 'Create Flashcard'}</DialogTitle>
              <DialogDescription>
                {selectedFlashcard 
                  ? 'Update the content for this flashcard.'
                  : 'Add a new flashcard to this module.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="front_content">Front Content</Label>
                <Textarea 
                  id="front_content" 
                  value={flashcardForm.front_content} 
                  onChange={(e) => setFlashcardForm({...flashcardForm, front_content: e.target.value})}
                  placeholder="Question or concept"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="back_content">Back Content</Label>
                <Textarea 
                  id="back_content" 
                  value={flashcardForm.back_content} 
                  onChange={(e) => setFlashcardForm({...flashcardForm, back_content: e.target.value})}
                  placeholder="Answer or explanation"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input 
                  id="sort_order" 
                  type="number" 
                  value={flashcardForm.sort_order} 
                  onChange={(e) => setFlashcardForm({...flashcardForm, sort_order: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFlashcardDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleFlashcardSave}>{selectedFlashcard ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Quiz Dialog */}
        <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedQuiz ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle>
              <DialogDescription>
                {selectedQuiz 
                  ? 'Update the details for this quiz.'
                  : 'Add a new quiz to this module.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={quizForm.title} 
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                  placeholder="Quiz title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={quizForm.description} 
                  onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                  placeholder="Quiz description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="passing_score">Passing Score (%)</Label>
                <Input 
                  id="passing_score" 
                  type="number" 
                  value={quizForm.passing_score} 
                  onChange={(e) => setQuizForm({...quizForm, passing_score: parseInt(e.target.value)})}
                  min={0}
                  max={100}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setQuizDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleQuizSave}>{selectedQuiz ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Question Dialog */}
        <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedQuestion ? 'Edit Question' : 'Create Question'}</DialogTitle>
              <DialogDescription>
                {selectedQuestion 
                  ? 'Update the content for this question.'
                  : 'Add a new question to this quiz.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea 
                  id="question" 
                  value={questionForm.question} 
                  onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                  placeholder="Quiz question"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input 
                  id="sort_order" 
                  type="number" 
                  value={questionForm.sort_order} 
                  onChange={(e) => setQuestionForm({...questionForm, sort_order: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setQuestionDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleQuestionSave}>{selectedQuestion ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Answer Dialog */}
        <Dialog open={answerDialogOpen} onOpenChange={setAnswerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedAnswer ? 'Edit Answer' : 'Create Answer'}</DialogTitle>
              <DialogDescription>
                {selectedAnswer 
                  ? 'Update the content for this answer option.'
                  : 'Add a new answer option to this question.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="answer_text">Answer Text</Label>
                <Textarea 
                  id="answer_text" 
                  value={answerForm.answer_text} 
                  onChange={(e) => setAnswerForm({...answerForm, answer_text: e.target.value})}
                  placeholder="Answer option"
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_correct"
                  checked={answerForm.is_correct}
                  onChange={(e) => setAnswerForm({...answerForm, is_correct: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-600"
                />
                <Label htmlFor="is_correct">Correct Answer</Label>
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input 
                  id="sort_order" 
                  type="number" 
                  value={answerForm.sort_order} 
                  onChange={(e) => setAnswerForm({...answerForm, sort_order: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAnswerDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAnswerSave}>{selectedAnswer ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {deleteItem?.type}?
                <br /><br />
                <strong>{deleteItem?.name}</strong>
                <br /><br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Footer />
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
};

export default EducationAdmin;
