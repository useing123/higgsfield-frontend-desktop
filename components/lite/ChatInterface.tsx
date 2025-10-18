"use client";

import React, { useState } from 'react';
import { Message as MessageType } from '@/lib/types';
import { apiService } from '@/services/apiService';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { Button } from "@/components/ui/button";

const featureCards = [
    { title: "Generate Video Prompt", message: "Generate a video prompt about..." },
    { title: "Brainstorm Ideas", message: "Brainstorm some ideas for a new project about..." },
    { title: "Write a Script", message: "Write a script for a short film about..." },
    { title: "Create a Character", message: "Create a character profile for a story about..." },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const mockUploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://placehold.co/600x400');
      }, 1000);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadedImageUrl = await mockUploadImage(file);
      setImageUrl(uploadedImageUrl);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
  };

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input;
    if (!content.trim() && !imageUrl) return;

    const conversationHistory = [...messages];
    
    let combinedContent = content;
    if (imageUrl) {
      combinedContent = `Image: ${imageUrl}\n\n${content}`;
    }

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: combinedContent,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (!messageContent) {
      setInput('');
    }
    setImageUrl(null);
    setIsLoading(true);

    try {
      const responseData = await apiService.sendChatMessage(combinedContent, conversationHistory);

      if (responseData && responseData.message) {
        const assistantMessage: MessageType = {
          id: responseData.id || Date.now().toString(),
          role: 'assistant',
          content: responseData.message,
          job_details: responseData.job_details,
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorResponse: MessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Failed to connect to the server.',
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureCardClick = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="h-screen bg-black flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center flex-grow">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-3 mb-12">
              <h1 className="text-5xl font-bold text-white tracking-tight">Higgsfield Assist</h1>
              <p className="text-gray-400 text-lg">A team of PhDs in your pocket, built for creators.</p>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureCards.map((card) => (
                <Button
                  key={card.title}
                  variant="outline"
                  className="bg-zinc-900 border-zinc-800 text-white h-auto p-4 text-left justify-start"
                  onClick={() => handleFeatureCardClick(card.message)}
                >
                  {card.title}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow w-full">
            <MessageList messages={messages} isLoading={isLoading} />
          </div>
        )}
      </div>
      <div className="w-full max-w-4xl mx-auto pt-6">
        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={() => sendMessage()}
          isLoading={isLoading}
          imageUrl={imageUrl}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
        />
      </div>
    </div>
  );
};

export default ChatInterface;