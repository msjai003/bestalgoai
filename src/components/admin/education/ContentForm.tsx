
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EducationContent, createEducationContent, updateEducationContent } from '@/lib/services/educationService';

const contentSchema = z.object({
  title: z.string().min(3, { message: 'Title is required and must be at least 3 characters' }),
  content: z.string().min(1, { message: 'Content is required' }),
  order_index: z.number().int().min(0),
  content_type: z.string().default('text'),
  media_url: z.string().optional().nullable(),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentFormProps {
  moduleId: string;
  content?: EducationContent;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ moduleId, content, onSuccess, onCancel }) => {
  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: content ? {
      title: content.title,
      content: content.content,
      order_index: content.order_index,
      content_type: content.content_type,
      media_url: content.media_url || '',
    } : {
      title: '',
      content: '',
      order_index: 0,
      content_type: 'text',
      media_url: '',
    },
  });

  const handleSubmit = async (data: ContentFormData) => {
    let success;
    
    if (content) {
      success = await updateEducationContent(content.id, data);
    } else {
      // Ensure all required fields are provided
      success = await createEducationContent({
        module_id: moduleId,
        title: data.title,
        content: data.content,
        order_index: data.order_index,
        content_type: data.content_type,
        media_url: data.media_url
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
                <Input {...field} placeholder="Content title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="content_type"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Content Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
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
        
        {form.watch('content_type') !== 'text' && (
          <FormField
            control={form.control}
            name="media_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="URL to media content" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter content here" 
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{content ? 'Update Content' : 'Create Content'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentForm;
