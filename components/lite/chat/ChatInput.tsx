import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, Paperclip, X, Sparkles } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
  imageUrl: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  hasMessages?: boolean;
}

const suggestedPrompts = [
  "Create a cinematic video prompt",
  "Help me brainstorm video ideas",
  "Write a compelling script",
  "Design a character concept",
];

const typingPrompts = [
  "A cinematic drone shot flying over a misty mountain at sunrise",
  "Generate a video of a coffee cup steaming on a rainy windowsill",
  "Create a time-lapse of a blooming flower in 4K quality",
  "Make a slow-motion video of paint splashing in vibrant colors",
  "An epic fantasy castle with dragons flying in the background",
  "Create a neon-lit cyberpunk city street at night",
  "Generate a peaceful meditation scene in a Japanese zen garden",
  "A professional product showcase video for a smartphone",
];

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  sendMessage,
  isLoading,
  imageUrl,
  handleImageUpload,
  removeImage,
  hasMessages = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [placeholder, setPlaceholder] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Animated typing effect for placeholder
  useEffect(() => {
    if (input.length > 0) {
      setPlaceholder('');
      return;
    }

    const currentPrompt = typingPrompts[currentPromptIndex];
    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;

    if (isTyping) {
      // Typing phase
      typingInterval = setInterval(() => {
        if (currentIndex <= currentPrompt.length) {
          setPlaceholder(currentPrompt.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
        }
      }, 50); // Typing speed
    } else {
      // Wait phase before switching to next prompt
      const waitTimeout = setTimeout(() => {
        setCurrentPromptIndex((prev) => (prev + 1) % typingPrompts.length);
        setIsTyping(true);
      }, 15000); // 15 seconds

      return () => clearTimeout(waitTimeout);
    }

    return () => clearInterval(typingInterval);
  }, [currentPromptIndex, isTyping, input]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
      setShowSuggestions(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full space-y-3">
      {/* Suggested prompts */}
      {!hasMessages && showSuggestions && input.length === 0 && (
        <div className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(prompt)}
              className="px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-sm hover:bg-zinc-800 hover:text-lime-500 hover:border-lime-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3 h-3 inline mr-1.5" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input container */}
      <div className="w-full bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 p-4 shadow-xl hover:border-zinc-700 transition-all duration-200">
        {imageUrl && (
          <div className="mb-3 relative w-20 h-20 group">
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-xl object-cover w-full h-full border-2 border-zinc-800 group-hover:border-lime-500/50 transition-all duration-200"
            />
            <Button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-zinc-800 hover:bg-red-500 text-white rounded-full p-1 h-6 w-6 shadow-lg transition-all duration-200"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <Input
            type="text"
            placeholder={placeholder || "Ask anything..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 focus-visible:ring-0 text-[15px]"
          />
          <Button
            onClick={triggerFileInput}
            disabled={isLoading}
            className="bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-lime-500 rounded-full p-2 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && !imageUrl)}
            className="bg-lime-500 hover:bg-lime-400 text-black rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;