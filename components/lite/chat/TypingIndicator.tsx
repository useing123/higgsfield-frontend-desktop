import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-6">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center">
        <Bot className="w-4 h-4" />
      </div>

      {/* Typing bubble */}
      <div className="bg-zinc-800/80 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-lime-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-lime-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-lime-500 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;