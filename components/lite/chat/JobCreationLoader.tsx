"use client";

import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Sparkles } from 'lucide-react';

interface JobCreationLoaderProps {
  message?: string;
}

/**
 * Shows a loading state while waiting for the backend to create a job
 * This appears immediately after the user sends a generation request
 */
const JobCreationLoader: React.FC<JobCreationLoaderProps> = ({
  message = "Creating your generation job..."
}) => {
  return (
    <div className="p-6 border border-zinc-700/50 rounded-xl bg-zinc-900/30 backdrop-blur-sm my-3 space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-lime-500/10 flex items-center justify-center">
          <Spinner className="text-lime-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Initializing generation</p>
          <p className="text-xs text-zinc-500">{message}</p>
        </div>
        <Sparkles className="w-5 h-5 text-lime-500 animate-pulse" />
      </div>

      {/* Animated progress bar (indeterminate) */}
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-lime-500 to-lime-400 animate-pulse" style={{ width: '60%' }} />
      </div>

      {/* Info text */}
      <div className="text-xs text-zinc-500 text-center">
        Setting up your request with our AI servers...
      </div>
    </div>
  );
};

export default JobCreationLoader;
