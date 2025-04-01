
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EducationModule, createEducationModule, updateEducationModule } from '@/lib/services/educationService';

const moduleSchema = z.object({
  title: z.string().min(3, { message: 'Title is required and must be at least 3 characters' }),
  description: z.string().optional().nullable(),
  level: z.enum(['basics', 'intermediate', 'pro']),
  order_index: z.number().int().min(0),
  estimated_time: z.number().int().min(0).optional().nullable(),
  is_active: z.boolean().default(true),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  module?: EducationModule;
  onSuccess: () => void;
  onCancel: () => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ module, onSuccess, onCancel }) => {
  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: module ? {
      title: module.title,
      description: module.description || '',
      level: module.level,
      order_index: module.order_index,
      estimated_time: module.estimated_time || 0,
      is_active: module.is_active,
    } : {
      title: '',
      description: '',
      level: 'basics',
      order_index: 0,
      estimated_time: 0,
      is_active: true,
    },
  });

  const handleSubmit = async (data: ModuleFormData) => {
    let success: EducationModule | null;
    
    if (module) {
      success = await updateEducationModule(module.id, {
        title: data.title,
        description: data.description || '',
        level: data.level,
        order_index: data.order_index,
        estimated_time: data.estimated_time,
        is_active: data.is_active,
      });
    } else {
      success = await createEducationModule({
        title: data.title,
        description: data.description || '',
        level: data.level,
        order_index: data.order_index,
        estimated_time: data.estimated_time,
        is_active: data.is_active,
      });
    }
    
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Module title" />
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
                <Textarea {...field} value={field.value || ''} placeholder="Module description" />
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
            name="order_index"
            render={({ field }) => (
              <FormItem className="flex-1">
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
        </div>
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="estimated_time"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Estimated Time (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Estimated time in minutes" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Module will be visible to users
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{module ? 'Update Module' : 'Create Module'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default ModuleForm;
