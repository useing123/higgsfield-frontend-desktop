import React from 'react';
import { Message as MessageType, JobDetails } from '@/lib/types';
import JobCard from './JobCard';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { role, content, job_details } = message;

  return (
    <div
      className={cn(
        'flex flex-col p-4 my-2 rounded-lg',
        role === 'user' ? 'bg-zinc-800 text-white self-end' : 'bg-zinc-900 text-white self-start'
      )}
    >
      <p className="text-sm">{content}</p>
      {job_details && (
        <div className="mt-2">
          <JobCard jobDetails={job_details} />
        </div>
      )}
    </div>
  );
};

export default Message;