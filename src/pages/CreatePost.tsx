import React from 'react';
import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle,
  Image,
  BookOpen,
  MessageSquare
} from "lucide-react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postTitle.trim() || !postContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate post creation
    setTimeout(() => {
      toast({
        title: "Post created!",
        description: "Your post has been published to the community.",
      });
      setIsSubmitting(false);
      navigate("/community");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/community");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />
      <main className="pt-16 pb-20 px-4 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Create New Post</h1>
          <p className="text-gray-400">Share your thoughts with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-300 block">
              Title <span className="text-[#FF00D4]">*</span>
            </label>
            <Input
              id="title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="E.g., My strategy for volatile markets..."
              className="border-gray-700 bg-gray-800/50 focus:ring-[#FF00D4] text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-gray-300 block">
              Content <span className="text-[#FF00D4]">*</span>
            </label>
            <Textarea
              id="content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share your thoughts, strategies, or questions..."
              className="border-gray-700 bg-gray-800/50 focus:ring-[#FF00D4] text-white min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block">
              Image (Optional)
            </label>
            <div className="flex flex-col gap-3">
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-[#FF00D4]/50 transition-colors">
                  <Image className="w-10 h-10 text-white opacity-70" />
                  <span className="text-gray-400 text-sm">
                    {selectedImage ? selectedImage.name : "Click to upload an image"}
                  </span>
                  {selectedImage && (
                    <span className="text-xs text-gray-500">
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-gray-900 hover:bg-gray-200"
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </main>
      <BottomNav />
    </div>
  );
};

export default CreatePost;

