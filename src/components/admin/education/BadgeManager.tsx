import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import BadgeForm from './BadgeForm';
import { 
  getEducationBadges,
  deleteEducationBadge,
  EducationBadge
} from '@/lib/services/educationService';

const BadgeManager = () => {
  const { toast } = useToast();
  const [badges, setBadges] = useState<EducationBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialogs state
  const [isBadgeFormOpen, setIsBadgeFormOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<EducationBadge | null>(null);
  const [deleteBadgeId, setDeleteBadgeId] = useState<number | null>(null);

  // Fetch badges
  const fetchBadges = async () => {
    setIsLoading(true);
    const badgesData = await getEducationBadges();
    setBadges(badgesData);
    setIsLoading(false);
  };
  
  // Handle badge creation/edit
  const handleBadgeFormSuccess = () => {
    setIsBadgeFormOpen(false);
    setEditingBadge(null);
    fetchBadges();
  };
  
  // Handle badge deletion
  const handleBadgeDelete = async () => {
    if (deleteBadgeId) {
      const success = await deleteEducationBadge(deleteBadgeId);
      if (success) {
        fetchBadges();
      }
      setDeleteBadgeId(null);
    }
  };

  // Get background color based on level
  const getLevelColor = (level: 'basics' | 'intermediate' | 'pro') => {
    switch (level) {
      case 'basics':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'pro':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Map unlock condition to readable text
  const getUnlockText = (condition: string) => {
    const conditionMap: Record<string, string> = {
      'first_module': 'Complete first module',
      'half_modules': 'Complete 50% of modules',
      'all_modules': 'Complete all modules',
      'first_quiz': 'Complete first quiz',
      'perfect_score': 'Get perfect quiz score',
      'custom': 'Custom condition'
    };
    
    return conditionMap[condition] || condition;
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchBadges();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education Badges</h2>
        <Button 
          onClick={() => {
            setEditingBadge(null);
            setIsBadgeFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Badge
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : badges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Award className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-center text-gray-500">
              No badges found.<br />
              Click "Add Badge" to create your first badge.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-muted text-2xl">
                      {badge.image}
                    </div>
                    <div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {badge.description}
                      </p>
                      <div className="mt-2 space-x-2">
                        <Badge variant="secondary" className={getLevelColor(badge.level)}>
                          {badge.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getUnlockText(badge.unlocked_by)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingBadge(badge);
                        setIsBadgeFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setDeleteBadgeId(badge.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Badge Form Dialog */}
      <Dialog open={isBadgeFormOpen} onOpenChange={setIsBadgeFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingBadge ? 'Edit Badge' : 'Create Badge'}</DialogTitle>
          </DialogHeader>
          <BadgeForm 
            badge={editingBadge || undefined}
            onSuccess={handleBadgeFormSuccess}
            onCancel={() => setIsBadgeFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Badge Alert Dialog */}
      <AlertDialog 
        open={!!deleteBadgeId} 
        onOpenChange={(open) => !open && setDeleteBadgeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Badge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this badge? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBadgeDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BadgeManager;
