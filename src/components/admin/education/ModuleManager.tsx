
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, RefreshCw, Edit, Trash, FileText, HelpCircle, ArrowUpFromLine } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ModuleForm from './ModuleForm';
import ContentForm from './ContentForm';
import QuizForm from './QuizForm';
import { 
  getEducationModules, 
  getEducationContent, 
  getQuizQuestions,
  deleteEducationModule,
  deleteEducationContent,
  deleteQuizQuestion,
  EducationModule,
  EducationContent,
  QuizQuestion
} from '@/lib/services/educationService';
import { seedModule1QuizData } from '@/lib/utilities/seedEducationData';

const ModuleManager: React.FC = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);
  const [contents, setContents] = useState<EducationContent[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [activeTab, setActiveTab] = useState('modules');
  const [contentTab, setContentTab] = useState('content');

  // Fetch modules when component mounts
  useEffect(() => {
    fetchModules();
  }, []);

  // Fetch content when a module is selected
  useEffect(() => {
    if (selectedModule) {
      fetchContent();
      fetchQuestions();
    } else {
      setContents([]);
      setQuestions([]);
    }
  }, [selectedModule]);

  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const moduleData = await getEducationModules();
      setModules(moduleData);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: "Error",
        description: "Failed to fetch modules",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContent = async () => {
    if (!selectedModule) return;
    
    try {
      const contentData = await getEducationContent(selectedModule.id);
      setContents(contentData);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch module content",
        variant: "destructive",
      });
    }
  };

  const fetchQuestions = async () => {
    if (!selectedModule) return;
    
    try {
      const questionData = await getQuizQuestions(selectedModule.id);
      setQuestions(questionData);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quiz questions",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await deleteEducationModule(id);
        fetchModules();
        if (selectedModule?.id === id) {
          setSelectedModule(null);
        }
      } catch (error) {
        console.error('Error deleting module:', error);
        toast({
          title: "Error",
          description: "Failed to delete module",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteEducationContent(id);
        fetchContent();
        if (selectedContent?.id === id) {
          setSelectedContent(null);
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        toast({
          title: "Error",
          description: "Failed to delete content",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuizQuestion(id);
        fetchQuestions();
        if (selectedQuestion?.id === id) {
          setSelectedQuestion(null);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        toast({
          title: "Error",
          description: "Failed to delete question",
          variant: "destructive",
        });
      }
    }
  };

  const handleImportModule1Data = async () => {
    setIsImporting(true);
    try {
      const success = await seedModule1QuizData();
      if (success) {
        toast({
          title: "Success",
          description: "Module 1 quiz data has been imported successfully",
        });
        
        // Refresh the questions if we're currently viewing module 1
        if (selectedModule && (selectedModule.order_index === 1 || selectedModule.title.toLowerCase().includes('module 1'))) {
          fetchQuestions();
        }
      } else {
        toast({
          title: "Import Failed",
          description: "Failed to import Module 1 quiz data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error importing module 1 data:', error);
      toast({
        title: "Error",
        description: "An error occurred while importing Module 1 data",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const filteredModules = modules.filter(module => 
    module.title.toLowerCase().includes(filterText.toLowerCase()) || 
    (module.description || '').toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tabs for high level navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="content" disabled={!selectedModule}>Content</TabsTrigger>
          <TabsTrigger value="quiz" disabled={!selectedModule}>Quiz</TabsTrigger>
        </TabsList>
        
        {/* Modules Tab */}
        <TabsContent value="modules">
          <div className="flex justify-between mb-4">
            <div className="flex-1 mr-4">
              <Input 
                placeholder="Filter modules..." 
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setIsAddingModule(true)}
              disabled={isAddingModule}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Module
            </Button>
            <Button 
              variant="outline" 
              onClick={fetchModules} 
              className="ml-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module) => (
              <Card 
                key={module.id} 
                className={`cursor-pointer ${selectedModule?.id === module.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedModule(module)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    {module.title}
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${
                      module.level === 'basics' ? 'bg-blue-100 text-blue-800' : 
                      module.level === 'intermediate' ? 'bg-green-100 text-green-800' : 
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {module.level}
                    </span>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {module.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between">
                  <span className="text-xs text-gray-500">
                    Order: {module.order_index}
                  </span>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAddingModule(true);
                        setSelectedModule(module);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModule(module.id);
                      }}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            {filteredModules.length === 0 && !isLoading && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No modules found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or add a new module.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content">
          {selectedModule && (
            <>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Content for: {selectedModule.title}
                </h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsAddingContent(true)}
                    disabled={isAddingContent}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Content
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={fetchContent}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {contents.length > 0 ? (
                  contents.map((content) => (
                    <Card key={content.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {content.title}
                          </div>
                          <span className="text-xs text-gray-500">
                            Order: {content.order_index}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm line-clamp-3">
                          {content.content}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedContent(content);
                              setIsAddingContent(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteContent(content.id)}
                          >
                            <Trash className="h-4 w-4 mr-2 text-destructive" /> Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No content found</h3>
                    <p className="text-sm text-muted-foreground">
                      Add some content to this module.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Quiz Tab */}
        <TabsContent value="quiz">
          {selectedModule && (
            <>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Quiz for: {selectedModule.title}
                </h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleImportModule1Data}
                    disabled={isImporting}
                    variant="outline"
                  >
                    <ArrowUpFromLine className="h-4 w-4 mr-2" /> 
                    {isImporting ? "Importing..." : "Import Module 1 Quiz"}
                  </Button>
                  <Button 
                    onClick={() => setIsAddingQuestion(true)}
                    disabled={isAddingQuestion}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Question
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={fetchQuestions}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Q: {question.question}
                          </div>
                          <span className="text-xs text-gray-500">
                            Order: {question.order_index}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {question.answers && question.answers.length > 0 && (
                          <div className="space-y-2">
                            <Label>Answers:</Label>
                            <div className="space-y-1">
                              {question.answers.map((answer, index) => (
                                <div 
                                  key={answer.id} 
                                  className={`p-2 rounded text-sm ${
                                    answer.is_correct ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                  }`}
                                >
                                  {index + 1}. {answer.answer_text}
                                  {answer.is_correct && " (Correct)"}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="mt-4">
                            <Label>Explanation:</Label>
                            <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedQuestion(question);
                              setIsAddingQuestion(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash className="h-4 w-4 mr-2 text-destructive" /> Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No questions found</h3>
                    <p className="text-sm text-muted-foreground">
                      Add quiz questions to this module.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Module Form */}
      {isAddingModule && (
        <ModuleForm
          module={selectedModule}
          onCancel={() => {
            setIsAddingModule(false);
            setSelectedModule(null);
          }}
          onSuccess={() => {
            setIsAddingModule(false);
            setSelectedModule(null);
            fetchModules();
          }}
        />
      )}
      
      {/* Content Form */}
      {isAddingContent && (
        <ContentForm
          moduleId={selectedModule?.id || ''}
          content={selectedContent}
          onCancel={() => {
            setIsAddingContent(false);
            setSelectedContent(null);
          }}
          onSuccess={() => {
            setIsAddingContent(false);
            setSelectedContent(null);
            fetchContent();
          }}
        />
      )}
      
      {/* Question Form */}
      {isAddingQuestion && (
        <QuizForm
          moduleId={selectedModule?.id || ''}
          question={selectedQuestion}
          onCancel={() => {
            setIsAddingQuestion(false);
            setSelectedQuestion(null);
          }}
          onSuccess={() => {
            setIsAddingQuestion(false);
            setSelectedQuestion(null);
            fetchQuestions();
          }}
        />
      )}
    </div>
  );
};

export default ModuleManager;
