
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useBookmarks = () => {
  const [bookmarkedModules, setBookmarkedModules] = useState<Record<string, boolean>>({});
  
  // Load bookmarks from local storage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarked_modules');
    if (savedBookmarks) {
      try {
        setBookmarkedModules(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error("Error parsing bookmarks:", error);
      }
    }
  }, []);
  
  const toggleBookmark = (moduleId: string) => {
    setBookmarkedModules(prev => {
      const newBookmarks = { ...prev, [moduleId]: !prev[moduleId] };
      localStorage.setItem('bookmarked_modules', JSON.stringify(newBookmarks));
      
      if (newBookmarks[moduleId]) {
        toast({
          title: "Module Bookmarked",
          description: "This module has been added to your bookmarks.",
        });
      } else {
        toast({
          title: "Bookmark Removed",
          description: "This module has been removed from your bookmarks.",
        });
      }
      
      return newBookmarks;
    });
  };
  
  return {
    bookmarkedModules,
    toggleBookmark
  };
};
