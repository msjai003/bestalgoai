
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronLeft, X } from 'lucide-react';

const Registration = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center">
            <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl"></i>
            <span className="text-white text-xl ml-2">BestAlgo.ai</span>
          </Link>
        </div>
        <Link to="/" className="text-gray-400">
          <X className="h-5 w-5" />
        </Link>
      </div>

      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Registration Disabled</h1>
      </section>

      <section className="space-y-6">
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700">
          <div className="flex items-center mb-4 text-yellow-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Registration Unavailable</h2>
          </div>
          <p className="text-gray-300 mb-4">
            The registration functionality has been temporarily removed.
          </p>
        </div>

        <Button
          onClick={() => window.history.back()}
          className="w-full bg-gradient-to-r from-[#FF00D4]/70 to-purple-600/70 text-white py-8 rounded-xl shadow-lg"
        >
          Go Back
        </Button>

        <div className="text-center text-gray-500 text-sm mt-6">
          <p>© 2023 BestAlgo.ai. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};

export default Registration;
