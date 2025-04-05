import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, BookOpen, LayoutList, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ModuleForm from './ModuleForm';
import ContentForm from './ContentForm';
import QuizForm from './QuizForm';
import { 
  getEducationModules, 
  deleteEducationModule,
  getEducationContent,
  deleteEducationContent,
  getQuizQuestions,
  deleteQuizQuestion,
  EducationModule,
  EducationContent,
  QuizQuestion
} from '@/lib/services/educationService';

const ModuleManager = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);
  const [contents, setContents] = useState<EducationContent[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModuleFormOpen, setIsModuleFormOpen] = useState(false);
  const [isContentFormOpen, setIsContentFormOpen] = useState(false);
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<EducationModule | null>(null);
  const [editingContent, setEditingContent] = useState<EducationContent | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);
  const [deleteContentId, setDeleteContentId] = useState<string | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  const fetchModules = async () => {
    setIsLoading(true);
    const modulesData = await getEducationModules();
    setModules(modulesData);
    setIsLoading(false);
    
    if (modulesData.length > 0 && !selectedModule) {
      handleModuleSelect(modulesData[0]);
    } else if (selectedModule) {
      const refreshedModule = modulesData.find(m => m.id === selectedModule.id);
      if (refreshedModule) {
        setSelectedModule(refreshedModule);
      } else if (modulesData.length > 0) {
        setSelectedModule(null);
      }
    }
  };

  const handleModuleSelect = async (module: EducationModule) => {
    setSelectedModule(module);
    
    const contentsData = await getEducationContent(module.id);
    setContents(contentsData);
    
    const questionsData = await getQuizQuestions(module.id);
    setQuestions(questionsData);
  };

  const handleModuleFormSuccess = () => {
    setIsModuleFormOpen(false);
    setEditingModule(null);
    fetchModules();
  };

  const handleModuleDelete = async () => {
    if (deleteModuleId) {
      const success = await deleteEducationModule(deleteModuleId);
      if (success) {
        if (selectedModule?.id === deleteModuleId) {
          setSelectedModule(null);
        }
        fetchModules();
      }
      setDeleteModuleId(null);
    }
  };

  const handleContentFormSuccess = () => {
    setIsContentFormOpen(false);
    setEditingContent(null);
    if (selectedModule) {
      getEducationContent(selectedModule.id).then(data => setContents(data));
    }
  };

  const handleContentDelete = async () => {
    if (deleteContentId) {
      const success = await deleteEducationContent(deleteContentId);
      if (success && selectedModule) {
        getEducationContent(selectedModule.id).then(data => setContents(data));
      }
      setDeleteContentId(null);
    }
  };

  const handleQuizFormSuccess = () => {
    setIsQuizFormOpen(false);
    setEditingQuestion(null);
    if (selectedModule) {
      getQuizQuestions(selectedModule.id).then(data => setQuestions(data));
    }
  };

  const handleQuestionDelete = async () => {
    if (deleteQuestionId) {
      const success = await deleteQuizQuestion(deleteQuestionId);
      if (success && selectedModule) {
        getQuizQuestions(selectedModule.id).then(data => setQuestions(data));
      }
      setDeleteQuestionId(null);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education Modules</h2>
        <Button 
          onClick={() => {
            setEditingModule(null);
            setIsModuleFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Module
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : modules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-center text-gray-500">
              No education modules found.<br />
              Click "Add Module" to create your first module.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-2">
                {modules.map(module => (
                  <Card 
                    key={module.id}
                    className={`cursor-pointer hover:border-primary transition-all ${
                      selectedModule?.id === module.id ? 'border-primary' : ''
                    }`}
                    onClick={() => handleModuleSelect(module)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold truncate">{module.title}</h3>
                          <div className="flex items-center mt-1">
                            <Badge variant={module.is_active ? 'outline' : 'secondary'} className="mr-2">
                              {module.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">{module.level}</Badge>
                          </div>
                        </div>
                        <div className="flex">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingModule(module);
                              setIsModuleFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModuleId(module.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="lg:col-span-3">
            {selectedModule ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{selectedModule.title}</CardTitle>
                      <CardDescription>{selectedModule.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {selectedModule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="content">
                    <TabsList className="mb-4">
                      <TabsTrigger value="content" className="flex items-center">
                        <LayoutList className="h-4 w-4 mr-1" /> Content
                      </TabsTrigger>
                      <TabsTrigger value="quiz" className="flex items-center">
                        <HelpCircle className="h-4 w-4 mr-1" /> Quiz
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Content Items</h3>
                        <Button 
                          onClick={() => {
                            setEditingContent(null);
                            setIsContentFormOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Content
                        </Button>
                      </div>
                      
                      {contents.length === 0 ? (
                        <div className="text-center py-6 bg-muted rounded-lg">
                          <p className="text-muted-foreground">
                            No content items yet. Click "Add Content" to create your first content item.
                          </p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[50vh]">
                          <div className="space-y-3">
                            {contents.map((content) => (
                              <Card key={content.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">#{content.order_index}</span>
                                        <Badge variant="outline" className="text-xs">{content.content_type}</Badge>
                                      </div>
                                      <h4 className="font-semibold mt-1">{content.title}</h4>
                                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                        {content.content}
                                      </p>
                                    </div>
                                    <div className="flex ml-4">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          setEditingContent(content);
                                          setIsContentFormOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setDeleteContentId(content.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="quiz" className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Quiz Questions</h3>
                        <Button 
                          onClick={() => {
                            setEditingQuestion(null);
                            setIsQuizFormOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Question
                        </Button>
                      </div>
                      
                      {questions.length === 0 ? (
                        <div className="text-center py-6 bg-muted rounded-lg">
                          <p className="text-muted-foreground">
                            No quiz questions yet. Click "Add Question" to create your first question.
                          </p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[50vh]">
                          <div className="space-y-3">
                            {questions.map((question) => (
                              <Card key={question.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">#{question.order_index}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {question.options?.length || 0} options
                                        </Badge>
                                      </div>
                                      <h4 className="font-semibold mt-1">{question.question}</h4>
                                      
                                      {question.options && question.options.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                          {question.options.slice(0, 2).map((option, index) => (
                                            <div 
                                              key={index} 
                                              className={`text-xs px-2 py-1 rounded-sm ${
                                                index === question.correct_answer ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' : 'bg-muted'
                                              }`}
                                            >
                                              {option}
                                              {index === question.correct_answer && ' ✓'}
                                            </div>
                                          ))}
                                          {question.options.length > 2 && (
                                            <div className="text-xs text-muted-foreground">
                                              + {question.options.length - 2} more options
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex ml-4">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          setEditingQuestion(question);
                                          setIsQuizFormOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setDeleteQuestionId(question.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg text-center text-gray-500">
                    Select a module from the list to view and edit its content.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      
      <Dialog open={isModuleFormOpen} onOpenChange={setIsModuleFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Module' : 'Create Module'}</DialogTitle>
          </DialogHeader>
          <ModuleForm 
            module={editingModule || undefined}
            onSuccess={handleModuleFormSuccess}
            onCancel={() => setIsModuleFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isContentFormOpen} onOpenChange={setIsContentFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingContent ? 'Edit Content' : 'Create Content'}</DialogTitle>
          </DialogHeader>
          {selectedModule && (
            <ContentForm 
              moduleId={selectedModule.id}
              content={editingContent || undefined}
              onSuccess={handleContentFormSuccess}
              onCancel={() => setIsContentFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isQuizFormOpen} onOpenChange={setIsQuizFormOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create Question'}</DialogTitle>
          </DialogHeader>
          {selectedModule && (
            <QuizForm 
              moduleId={selectedModule.id}
              question={editingQuestion || undefined}
              onSuccess={handleQuizFormSuccess}
              onCancel={() => setIsQuizFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog 
        open={!!deleteModuleId} 
        onOpenChange={(open) => !open && setDeleteModuleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this module? This action cannot be undone.
              All associated content and quiz questions will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleModuleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog 
        open={!!deleteContentId} 
        onOpenChange={(open) => !open && setDeleteContentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleContentDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog 
        open={!!deleteQuestionId} 
        onOpenChange={(open) => !open && setDeleteQuestionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz question? This action cannot be undone.
              All associated answers will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleQuestionDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModuleManager;
