"use client";

import React, { useState, useEffect } from 'react';
import { JobDetails } from '@/lib/types';
import { apiService } from '@/services/apiService';
import { Spinner } from '@/components/ui/spinner';

interface JobCardProps {
  jobDetails: JobDetails;
}

const JobCard: React.FC<JobCardProps> = ({ jobDetails }) => {
  const [job, setJob] = useState<JobDetails & { result_url?: string }>(jobDetails);

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
        }
      } catch (error) {
        console.error('Failed to get job status:', error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [job.status, job.job_set_id]);

  const renderMedia = () => {
    if (job.status === 'completed' && job.result_url) {
      const url = job.result_url;
      if (url.endsWith('.mp4')) {
        return (
          <video
            src={url}
            controls
            className="mt-3 rounded-lg w-full border border-zinc-700 hover:border-lime-500/50 transition-colors duration-200"
          />
        );
      }
      return (
        <img
          src={url}
          alt="Generated Content"
          className="mt-3 rounded-lg w-full border border-zinc-700 hover:border-lime-500/50 transition-colors duration-200"
        />
      );
    }
    return null;
  };

  return (
    <div className="p-4 border border-zinc-700 rounded-xl bg-zinc-900/50 backdrop-blur-sm my-2 hover:border-lime-500/30 transition-all duration-200">
      <div className="flex items-center space-x-3">
        {(job.status === 'pending' || job.status === 'running') && (
          <>
            <Spinner />
            <p className="text-sm font-medium text-zinc-300">Generating your media...</p>
          </>
        )}
      </div>
      {renderMedia()}
      {job.status === 'failed' && (
        <p className="text-red-500 mt-2 text-sm">Generation failed. Please try again.</p>
      )}
    </div>
  );
};

export default JobCard;