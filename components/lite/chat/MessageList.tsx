import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '@/lib/types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  streamingMessageId?: string | null;
  loadingMessage?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, streamingMessageId, loadingMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll the parent scrollable container
      const scrollableParent = scrollRef.current.closest('.overflow-y-auto');
      if (scrollableParent) {
        scrollableParent.scrollTo({
          top: scrollableParent.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages, isLoading]);

  // Check if a message might be waiting for job creation
  const isWaitingForJob = (msg: MessageType, index: number): boolean => {
    if (msg.role !== 'assistant') return false;
    if (msg.job_details) return false; // Already has job details

    // Check if this is the last assistant message and might be a generation response
    const isLastAssistantMessage = index === messages.length - 1 ||
      messages.slice(index + 1).every(m => m.role === 'user');

    // Keywords that suggest generation is happening
    const generationKeywords = [
      'generat', 'creat', 'mak', 'produc', 'render',
      'video', 'image', 'picture', 'clip', 'animation'
    ];

    const contentLower = msg.content.toLowerCase();
    const hasGenerationKeyword = generationKeywords.some(keyword =>
      contentLower.includes(keyword)
    );

    return isLastAssistantMessage && hasGenerationKeyword;
  };

  return (
    <div ref={scrollRef} className="w-full">
      <div className="max-w-3xl mx-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            <Message
              message={msg}
              isStreaming={msg.id === streamingMessageId}
              isWaitingForJob={isWaitingForJob(msg, index)}
            />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
            <TypingIndicator loadingMessage={loadingMessage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;