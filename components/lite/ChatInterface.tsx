"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Message as MessageType } from '@/lib/types';
import { apiService } from '@/services/apiService';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackChatMessageSent, trackChatResponseReceived, trackFeatureCardClicked } from '@/lib/analytics/events';

const featureCards = [
    {
      title: "Generate Video Prompt",
      message: "Generate a video prompt about...",
      icon: "🎬"
    },
    {
      title: "Brainstorm Ideas",
      message: "Brainstorm some ideas for a new project about...",
      icon: "💡"
    },
    {
      title: "Write a Script",
      message: "Write a script for a short film about...",
      icon: "✍️"
    },
    {
      title: "Create a Character",
      message: "Create a character profile for a story about...",
      icon: "🎭"
    },
];

const ChatInterface = () => {
  const searchParams = useSearchParams();
  const { sessionId } = useAnalytics();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [useStreaming] = useState(false); // Toggle to enable/disable streaming
  const hasAutoSubmittedRef = useRef(false);
  const messageStartTimeRef = useRef<number>(0);

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

  // Handle URL prompt parameter and auto-submit
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    // Use ref to prevent double-submission in React StrictMode or re-renders
    if (promptParam && !hasAutoSubmittedRef.current && messages.length === 0) {
      hasAutoSubmittedRef.current = true;
      setInput(promptParam);
      // Auto-submit after a brief delay to ensure state is set
      const timeoutId = setTimeout(() => {
        sendMessage(promptParam);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, messages.length]);

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input;
    if (!content.trim() && !imageUrl) return;

    // Prevent duplicate sends if already loading
    if (isLoading) return;

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

    // Track message sent
    trackChatMessageSent({
      messageLength: content.length,
      hasImage: !!imageUrl,
      conversationLength: messages.length,
      sessionId: sessionId,
      suggestionUsed: false,
    });

    // Store start time for response time tracking
    messageStartTimeRef.current = Date.now();

    if (!messageContent) {
      setInput('');
    }
    setImageUrl(null);
    setIsLoading(true);

    try {
      if (useStreaming) {
        // Streaming mode
        const assistantMessageId = `assistant-${Date.now()}`;
        setStreamingMessageId(assistantMessageId);

        const assistantMessage: MessageType = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        setIsLoading(false);

        let accumulatedContent = '';

        try {
          for await (const delta of apiService.sendChatMessageStream(combinedContent, conversationHistory)) {
            accumulatedContent += delta;
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
          }
        } catch (streamError) {
          console.error('Streaming failed, falling back to regular mode:', streamError);
          // If streaming fails, fall back to regular mode
          const responseData = await apiService.sendChatMessage(combinedContent, conversationHistory);

          if (responseData && responseData.message) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: responseData.message,
                      job_details: responseData.job_details,
                    }
                  : msg
              )
            );
          }
        } finally {
          setStreamingMessageId(null);
        }
      } else {
        // Regular mode (non-streaming)
        const responseData = await apiService.sendChatMessage(combinedContent, conversationHistory);

        if (responseData && responseData.message) {
          const assistantMessage: MessageType = {
            id: responseData.id || Date.now().toString(),
            role: 'assistant',
            content: responseData.message,
            job_details: responseData.job_details,
          };
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);

          // Track response received
          const responseTime = Date.now() - messageStartTimeRef.current;
          trackChatResponseReceived({
            responseTimeMs: responseTime,
            responseLength: responseData.message.length,
            hasJobDetails: !!responseData.job_details,
            sessionId: sessionId,
          });
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorResponse: MessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Failed to connect to the server.',
      };
      setMessages((prev) => [...prev, errorResponse]);
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const handleFeatureCardClick = (message: string, cardIndex: number) => {
    const cardTypes = ['video_prompt', 'brainstorm', 'script', 'character'] as const;

    trackFeatureCardClicked({
      cardType: cardTypes[cardIndex],
      cardPosition: cardIndex,
      sessionId: sessionId,
    });

    sendMessage(message);
  };

  return (
    <div className="h-full bg-black flex flex-col">
      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full">
              <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Higgsfield Assist
                </h1>
                <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
                  A team of PhDs in your pocket, built for creators.
                </p>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {featureCards.map((card, index) => (
                  <button
                    key={card.title}
                    onClick={() => handleFeatureCardClick(card.message, index)}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 text-left transition-all duration-300 hover:bg-zinc-800/80 hover:border-lime-500/50 hover:scale-105 hover:shadow-xl hover:shadow-lime-500/10 active:scale-100 animate-in fade-in slide-in-from-bottom-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-lime-500 transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-zinc-500 text-sm group-hover:text-zinc-400 transition-colors duration-300">
                          {card.message}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lime-500/0 to-lime-500/0 group-hover:from-lime-500/5 group-hover:to-transparent transition-all duration-300" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              streamingMessageId={streamingMessageId}
            />
          )}
        </div>
      </div>

      {/* Fixed input at bottom */}
      <div className="border-t border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-4">
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={() => sendMessage()}
            isLoading={isLoading}
            imageUrl={imageUrl}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            hasMessages={messages.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;