import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, Paperclip, X } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
  imageUrl: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  sendMessage,
  isLoading,
  imageUrl,
  handleImageUpload,
  removeImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-zinc-900 rounded-3xl border border-zinc-800 p-4">
      {imageUrl && (
        <div className="mb-2 relative w-24 h-24">
          <img src={imageUrl} alt="Preview" className="rounded-lg object-cover w-full h-full" />
          <Button
            onClick={removeImage}
            className="absolute top-0 right-0 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center">
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0"
        />
        <Button onClick={triggerFileInput} disabled={isLoading} className="bg-transparent hover:bg-zinc-800 text-zinc-400 rounded-full p-2">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button onClick={sendMessage} disabled={isLoading} className="bg-primary hover:bg-blue-700 text-white rounded-full p-2">
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;