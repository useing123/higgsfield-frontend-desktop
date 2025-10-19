import React from 'react';
import { Message as MessageType } from '@/lib/types';
import JobCard from './JobCard';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface MessageProps {
  message: MessageType;
  isStreaming?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isStreaming = false }) => {
  const { role, content, job_details } = message;

  return (
    <div
      className={cn(
        'flex gap-3 mb-6 group',
        role === 'user' ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
          role === 'user'
            ? 'bg-lime-500/10 text-lime-500 group-hover:bg-lime-500/20'
            : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
        )}
      >
        {role === 'user' ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          'flex flex-col max-w-[75%] transition-all duration-200',
          role === 'user' ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'px-4 py-3 rounded-2xl shadow-sm transition-all duration-200',
            role === 'user'
              ? 'bg-lime-500 text-black rounded-tr-sm hover:shadow-lime-500/20 hover:shadow-lg'
              : 'bg-zinc-800/80 text-white rounded-tl-sm hover:bg-zinc-800 hover:shadow-lg'
          )}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {content}
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-lime-500 animate-pulse"></span>
            )}
          </p>
        </div>

        {job_details && (
          <div className="mt-3 w-full">
            <JobCard jobDetails={job_details} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;