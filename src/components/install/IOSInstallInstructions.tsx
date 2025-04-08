
import React from 'react';
import { Share2 } from 'lucide-react';

const IOSInstallInstructions = () => {
  return (
    <div>
      <p className="text-gray-300 text-sm mb-3">
        Add this app to your home screen for the best experience:
      </p>
      <ol className="text-gray-300 text-xs space-y-1 mb-3 list-decimal ml-4">
        <li>Tap the share button <span id="ios-share-button" className="inline-block animate-pulse-slow">
          <Share2 className="h-4 w-4 inline text-blue-400" />
        </span></li>
        <li>Scroll and select "Add to Home Screen"</li>
        <li>Tap "Add" in the top right corner</li>
      </ol>
      <div className="mt-2 mb-2">
        <img src="/ios-install-guide.png" alt="iOS installation guide" className="rounded-md w-full max-w-[200px] mx-auto" onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }} />
      </div>
    </div>
  );
};

export default IOSInstallInstructions;
