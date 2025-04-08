
import React from 'react';

const AndroidInstallInstructions = () => {
  return (
    <div>
      <p className="text-gray-300 text-sm mb-3">
        Add this app to your home screen for the best experience:
      </p>
      <ol className="text-gray-300 text-xs space-y-1 mb-3 list-decimal ml-4">
        <li>Tap the menu button (⋮) in your browser</li>
        <li>Select "Add to Home screen" or "Install app"</li>
        <li>Confirm by tapping "Add" or "Install"</li>
      </ol>
    </div>
  );
};

export default AndroidInstallInstructions;
