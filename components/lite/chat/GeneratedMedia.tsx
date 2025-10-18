import React from 'react';
import { JobDetails } from '@/lib/types';

interface GeneratedMediaProps {
  job: JobDetails;
}

const GeneratedMedia: React.FC<GeneratedMediaProps> = ({ job }) => {
  if (job.status !== 'succeeded' || !job.result) {
    return null;
  }

  const mediaUrl = job.result.url;
  const isVideo = mediaUrl.endsWith('.mp4');

  return (
    <div className="mt-2">
      {isVideo ? (
        <video src={mediaUrl} controls className="w-full rounded-lg" />
      ) : (
        <img src={mediaUrl} alt="Generated content" className="w-full rounded-lg" />
      )}
    </div>
  );
};

export default GeneratedMedia;