import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '@/lib/types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  streamingMessageId?: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, streamingMessageId }) => {
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

  return (
    <div ref={scrollRef} className="w-full">
      <div className="max-w-3xl mx-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            <Message message={msg} isStreaming={msg.id === streamingMessageId} />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;