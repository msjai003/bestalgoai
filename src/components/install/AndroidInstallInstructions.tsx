
import React from 'react';
import { MoreVertical } from 'lucide-react';

const AndroidInstallInstructions = () => {
  return (
    <div>
      <p className="text-gray-300 text-sm mb-3">
        Add this app to your home screen for the best experience:
      </p>
      <ol className="text-gray-300 text-xs space-y-1 mb-3 list-decimal ml-4">
        <li>Tap the menu button <span id="android-menu-button" className="inline-block animate-pulse-slow">
          <MoreVertical className="h-4 w-4 inline text-blue-400" />
        </span> in your browser</li>
        <li>Select "Install app" or "Add to Home screen"</li>
        <li>Tap "Install" in the popup dialog</li>
        <li>Once installed, find and open BestAlgo.ai from your home screen</li>
      </ol>
      <div className="mt-2 mb-2">
        <img src="/android-install-guide.png" alt="Android installation guide" className="rounded-md w-full max-w-[200px] mx-auto" onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }} />
      </div>
    </div>
  );
};

export default AndroidInstallInstructions;
