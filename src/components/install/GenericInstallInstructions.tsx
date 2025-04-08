
import React from 'react';

const GenericInstallInstructions = () => {
  return (
    <div>
      <p className="text-gray-300 text-sm mb-3">
        Install our app for faster access and a better experience offline!
      </p>
      <ol className="text-gray-300 text-xs space-y-1 mb-3 list-decimal ml-4">
        <li>Click the install button below</li>
        <li>Follow the prompts in your browser</li>
        <li>Find the app on your home screen after installation</li>
      </ol>
    </div>
  );
};

export default GenericInstallInstructions;
