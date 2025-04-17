
import React from 'react';
import { Share } from 'lucide-react';
import { Badge as BadgeType, Level } from '@/hooks/useEducation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LevelBadgesProps {
  level: Level;
  earnedBadges: BadgeType[];
  canShare?: boolean;
}

export const LevelBadges = ({ level, earnedBadges, canShare = true }: LevelBadgesProps) => {
  const { toast } = useToast();
  const levelBadges = earnedBadges.filter(badge => badge.level === level);
  
  const handleShare = (badge: BadgeType) => {
    // In a real app, this would use the Web Share API if available
    const shareText = `I just earned the "${badge.name}" badge in Trading Academy! Join me to learn trading from basics to pro.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Trading Academy Achievement',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // Fallback if share fails
        copyToClipboard(shareText);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(shareText);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Share text copied!",
        description: "Share text copied to clipboard. Paste it to share with friends!",
      });
    });
  };
  
  return (
    <div className="flex flex-wrap gap-3">
      {levelBadges.length > 0 ? (
        levelBadges.map(badge => (
          <div 
            key={badge.id} 
            className="flex items-center gap-2 bg-cyan/10 px-3 py-1.5 rounded-full border border-cyan/20 group relative"
          >
            <span className="text-lg">{badge.image}</span>
            <span className="text-sm font-medium text-white">{badge.name}</span>
            
            {canShare && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                onClick={() => handleShare(badge)}
                title="Share this achievement"
              >
                <Share className="h-3 w-3 text-cyan" />
              </Button>
            )}
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-400">Complete modules to earn badges</div>
      )}
    </div>
  );
};
