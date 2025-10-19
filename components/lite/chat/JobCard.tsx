"use client";

import React from 'react';
import { JobDetails } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';
import { Download, RefreshCw, Video, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJobPolling } from '@/hooks/useJobPolling';

interface JobCardProps {
  jobDetails: JobDetails;
  onRetry?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ jobDetails, onRetry }) => {
  const { job, progress, estimatedTime, error, retryCount } = useJobPolling({
    jobSetId: jobDetails.job_set_id,
    initialStatus: jobDetails.status,
    onStatusChange: (status) => {
      console.log(`Job ${jobDetails.job_set_id} status changed to: ${status}`);
    },
    onError: (err) => {
      console.error('Job polling error:', err);
    },
    onComplete: (completedJob) => {
      console.log('Job completed:', completedJob);
    },
  });

  const handleDownload = async () => {
    if (!job.result_url) return;

    try {
      const response = await fetch(job.result_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `higgsfield-${job.job_set_id.slice(0, 8)}.${job.result_url.endsWith('.mp4') ? 'mp4' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isVideo = job.result_url?.endsWith('.mp4');

  // Loading state
  if (job.status === 'pending' || job.status === 'running') {
    return (
      <div className="p-6 border border-zinc-700 rounded-xl bg-zinc-900/50 backdrop-blur-sm my-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-lime-500/10 flex items-center justify-center">
              <Spinner className="text-lime-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Generating your content</p>
              <p className="text-xs text-zinc-500">Job ID: {job.job_set_id.slice(0, 8)}...</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Estimated time</p>
            <p className="text-sm font-mono text-lime-500">{formatTime(estimatedTime)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-500 to-lime-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error indicator (if polling is having issues) */}
        {error && retryCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Experiencing network issues (retry {retryCount}/10). Still generating...
            </span>
          </div>
        )}

        {/* Skeleton preview */}
        <div className="aspect-video bg-zinc-800 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-zinc-600">
            {isVideo ? <Video className="w-12 h-12" /> : <ImageIcon className="w-12 h-12" />}
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (job.status === 'failed' || (error && retryCount >= 10)) {
    return (
      <div className="p-6 border border-red-900/50 rounded-xl bg-red-950/20 backdrop-blur-sm my-3 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-400">
              {job.status === 'failed' ? 'Generation failed' : 'Connection failed'}
            </p>
            <p className="text-xs text-zinc-500">
              {error ? error.message : 'Something went wrong. Please try again.'}
            </p>
          </div>
        </div>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-900/50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Generation
          </Button>
        )}
      </div>
    );
  }

  // Completed state
  if ((job.status === 'completed' || job.status === 'succeeded') && job.result_url) {
    return (
      <div className="p-4 border border-lime-500/30 rounded-xl bg-zinc-900/50 backdrop-blur-sm my-3 space-y-3">
        {/* Media */}
        <div className="relative group">
          {isVideo ? (
            <video
              src={job.result_url}
              controls
              className="w-full rounded-lg border border-zinc-700"
            />
          ) : (
            <img
              src={job.result_url}
              alt="Generated Content"
              className="w-full rounded-lg border border-zinc-700"
            />
          )}
        </div>

        {/* Download button */}
        <Button
          onClick={handleDownload}
          className="w-full bg-lime-500 hover:bg-lime-400 text-black font-semibold"
        >
          <Download className="w-4 h-4 mr-2" />
          Download {isVideo ? 'Video' : 'Image'}
        </Button>
      </div>
    );
  }

  return null;
};

export default JobCard;