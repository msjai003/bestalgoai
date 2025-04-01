
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EducationBadge, createEducationBadge, updateEducationBadge } from '@/lib/services/educationService';

const badgeSchema = z.object({
  badge_id: z.string().min(3, { message: 'Badge ID is required' }),
  name: z.string().min(3, { message: 'Name is required' }),
  description: z.string().min(3, { message: 'Description is required' }),
  image: z.string().min(1, { message: 'Image emoji/URL is required' }),
  level: z.enum(['basics', 'intermediate', 'pro']),
  unlocked_by: z.string().min(1, { message: 'Unlock condition is required' }),
});

type BadgeFormData = z.infer<typeof badgeSchema>;

interface BadgeFormProps {
  badge?: EducationBadge;
  onSuccess: () => void;
  onCancel: () => void;
}

const BadgeForm: React.FC<BadgeFormProps> = ({ badge, onSuccess, onCancel }) => {
  const form = useForm<BadgeFormData>({
    resolver: zodResolver(badgeSchema),
    defaultValues: badge ? {
      badge_id: badge.badge_id,
      name: badge.name,
      description: badge.description,
      image: badge.image,
      level: badge.level,
      unlocked_by: badge.unlocked_by,
    } : {
      badge_id: '',
      name: '',
      description: '',
      image: '🏆',
      level: 'basics',
      unlocked_by: 'first_module',
    },
  });

  const handleSubmit = async (data: BadgeFormData) => {
    let success;
    
    if (badge) {
      success = await updateEducationBadge(badge.id, data);
    } else {
      success = await createEducationBadge(data);
    }
    
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="badge_id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Badge ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="unique-badge-id" disabled={!!badge} />
                </FormControl>
                <FormDescription>
                  Unique identifier for this badge (e.g., "basics-starter")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Badge Image</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="🏆 or image URL" />
                </FormControl>
                <FormDescription>
                  Emoji or image URL
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Badge Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Badge name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Badge description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Level</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
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
          
          <FormField
            control={form.control}
            name="unlocked_by"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Unlock Condition</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="first_module">First Module</SelectItem>
                    <SelectItem value="half_modules">Half Modules</SelectItem>
                    <SelectItem value="all_modules">All Modules</SelectItem>
                    <SelectItem value="first_quiz">First Quiz</SelectItem>
                    <SelectItem value="perfect_score">Perfect Quiz Score</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{badge ? 'Update Badge' : 'Create Badge'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default BadgeForm;
