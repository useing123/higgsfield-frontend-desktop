"use client";

import React, { useState, useEffect } from 'react';
import { JobDetails } from '@/lib/types';
import { apiService } from '@/services/apiService';
import { Spinner } from '@/components/ui/spinner';
import { Download, RefreshCw, Video, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobCardProps {
  jobDetails: JobDetails;
  onRetry?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ jobDetails, onRetry }) => {
  const [job, setJob] = useState<JobDetails & { result_url?: string }>(jobDetails);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(120); // 2 minutes in seconds
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (job.status === 'completed' || job.status === 'failed') {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const updatedJob = await apiService.getJobStatus(job.job_set_id);
        if (updatedJob && updatedJob.jobs && updatedJob.jobs.length > 0) {
          const mainJob = updatedJob.jobs[0];
          const newStatus = mainJob.status;
          const newResultUrl = mainJob.results?.raw?.url || mainJob.results?.min?.url;

          setJob((prevJob) => ({
            ...prevJob,
            status: newStatus,
            result_url: newResultUrl,
          }));

          // Increase progress by 10% each poll
          setPollCount((prev) => prev + 1);
          setProgress((prev) => Math.min(prev + 10, 95));
          setEstimatedTime((prev) => Math.max(prev - 12, 5)); // Decrease time estimate
        }
      } catch (error) {
        console.error('Failed to get job status:', error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [job.status, job.job_set_id]);

  // Update progress to 100% when completed
  useEffect(() => {
    if (job.status === 'completed' || job.status === 'succeeded') {
      setProgress(100);
      setEstimatedTime(0);
    }
  }, [job.status]);

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
  if (job.status === 'failed') {
    return (
      <div className="p-6 border border-red-900/50 rounded-xl bg-red-950/20 backdrop-blur-sm my-3 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-400">Generation failed</p>
            <p className="text-xs text-zinc-500">Something went wrong. Please try again.</p>
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