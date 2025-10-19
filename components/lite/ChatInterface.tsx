"use client";

/**
 * 🎉 EASTER EGG ZONE - ROFL CODE AHEAD 🎉
 *
 * ⚠️  WARNING: This code contains easter eggs and fun facts! ⚠️
 * DO NOT copy-paste this to production without removing the easter egg logic!
 *
 * This is for entertainment purposes and showcasing company culture.
 * You've been warned! 🚀
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Message as MessageType } from '@/lib/types';
import { apiService } from '@/services/apiService';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackChatMessageSent, trackChatResponseReceived, trackFeatureCardClicked } from '@/lib/analytics/events';

// 🎯 Easter Egg: Fun facts about Higgsfield AI
const HIGGSFIELD_EASTER_EGGS = [
  "🦄 Fun fact: Higgsfield is Kazakhstan's first unicorn!",
  "💰 Did you know? We hit $50M revenue run rate in just 5 months!",
  "🚀 11 million users and counting! We're not stopping anytime soon.",
  "💎 Plot twist: Meta wanted to acquire us, but we said 'nah, we're good' 😎",
  "🎬 We invented 'Click-to-Video' - because who has time for complex prompts?",
  "📈 1.2 BILLION impressions across social media. Yes, with a B!",
  "💼 Our CEO Alex's previous startup sold to Snap for $166M. No big deal.",
  "🎓 Literally a team of PhDs in your pocket. We weren't kidding!",
  "🏆 $50M Series A led by GFT Ventures. They believe in the vision!",
  "🌟 From Kazakhstan to Silicon Valley - the global takeover is real.",
  "🎪 Yerzat Dulat (CTO) is an AI wizard. Like, actual magic.",
  "🎨 We're making video creation so easy, even your grandma could go viral.",
  "🎯 Sam Altman himself sent Yerzat a personal message about his AI research!",
  "🔥 OpenAI's John Schulman (creator of the algorithm that trained ChatGPT) tried to recruit Yerzat. He said no.",
  "🇰🇿 Team is mostly from Kazakhstan - Almaty represent! RFMSH alumni crushing it worldwide.",
  "📱 400,000+ creators use Diffuse monthly. The creative revolution is here!",
  "💡 Yerzat was coding AI algorithms before it was cool. GitHub legend since 2014.",
  "🏫 Harvard and top research labs used Yerzat's AI implementations. No biggie.",
  "🎓 Our team? Literally Olympic-level physics and math nerds. They win competitions for fun.",
  "💪 Started with $250k angel investment. Now? On track to change the entire industry.",
  "🌍 From Kaspi.kz to ERG - Yerzat built ML departments at Kazakhstan's biggest companies.",
  "⚡ Diffuse subscription: $18/month. Hollywood-level video creation in your pocket.",
  "🎯 First investor believed in us when we were just an idea. Trust pays off.",
  "🚀 We're not just building AI. We're building world models for consumers.",
  "🎪 Menlo Ventures backed us. The same folks who know how to spot unicorns.",
];

const getRandomEasterEgg = () => {
  return HIGGSFIELD_EASTER_EGGS[Math.floor(Math.random() * HIGGSFIELD_EASTER_EGGS.length)];
};

// 🎯 Easter Egg: Loading messages that show while waiting for AI
const LOADING_EASTER_EGGS = [
  "🧠 Training neural networks in real-time...",
  "🦄 Channeling Kazakhstan's unicorn energy...",
  "💎 Politely declining Meta's acquisition offer again...",
  "🎓 Consulting our team of PhDs...",
  "🔥 Warming up the $50M Series A supercomputers...",
  "🚀 Generating at 11 million user scale...",
  "🎬 Inventing new Click-to-Video magic...",
  "⚡ Running algorithms Harvard wishes they had...",
  "🇰🇿 Streaming wisdom from Almaty to Silicon Valley...",
  "🎪 Yerzat's AI wizardry in progress...",
  "💪 Flexing those 1.2 billion impressions...",
  "🏆 Putting that Menlo Ventures investment to work...",
  "🎯 Sam Altman would be proud of this response...",
  "🔬 Olympic-level AI processing happening...",
  "💡 GitHub legend mode: activated...",
];

const getRandomLoadingMessage = () => {
  return LOADING_EASTER_EGGS[Math.floor(Math.random() * LOADING_EASTER_EGGS.length)];
};

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
  const [loadingMessage, setLoadingMessage] = useState<string>(''); // 🎉 Easter Egg: Loading message

  // 🎉 Easter Egg: Console message on mount
  useEffect(() => {
    console.log(
      '%c🎉 HIGGSFIELD EASTER EGG ZONE 🎉',
      'background: #d1fe17; color: #000; font-size: 20px; font-weight: bold; padding: 10px;'
    );
    console.log(
      '%c⚠️  ROFL CODE ALERT ⚠️',
      'background: #ff0000; color: #fff; font-size: 16px; font-weight: bold; padding: 8px;'
    );
    console.log(
      '%cThis chat contains easter eggs with fun Higgsfield facts!',
      'color: #d1fe17; font-size: 14px; font-weight: bold;'
    );
    console.log(
      '%cDO NOT copy-paste this code to production without removing easter egg logic! 🚀',
      'color: #ff9900; font-size: 12px;'
    );
    console.log('%c\nSome fun facts:', 'color: #fff; font-size: 14px; font-weight: bold;');
    console.log('%c- Kazakhstan\'s first unicorn 🦄', 'color: #d1fe17;');
    console.log('%c- Rejected Meta acquisition 💎', 'color: #d1fe17;');
    console.log('%c- $50M revenue in 5 months 💰', 'color: #d1fe17;');
    console.log('%c- 11M+ users worldwide 🚀', 'color: #d1fe17;');
    console.log('%c\nKeep chatting to discover more easter eggs! 🎪', 'color: #fff; font-weight: bold;');
  }, []);

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
      console.log(`%c📸 Image uploaded: ${file.name}`, 'color: #d1fe17;');
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

    // 🎉 Easter Egg: Trigger special messages for certain keywords
    const lowerContent = content.toLowerCase();
    const specialKeywords = {
      'meta': "💎 Ah, Meta! Did you know they wanted to acquire us? We politely declined. We're building something bigger! 😎",
      'acquisition': "🚀 Fun fact: We rejected Meta's acquisition offer. Independence tastes sweeter!",
      'unicorn': "🦄 You said the magic word! Higgsfield is Kazakhstan's first unicorn. History in the making!",
      'kazakhstan': "🇰🇿 Kazakhstan represent! From Almaty to Silicon Valley, baby!",
      'alex': "👔 Our CEO Alex Mashrabov sold his previous startup to Snap for $166M. He knows a thing or two about building!",
      'yerzat': "🧙‍♂️ Yerzat Dulat, our CTO, is basically an AI wizard. The magic behind the magic!",
    };

    for (const [keyword, message] of Object.entries(specialKeywords)) {
      if (lowerContent.includes(keyword)) {
        console.log(`%c🎉 Easter Egg Triggered: ${keyword}`, 'color: #d1fe17; font-size: 16px; font-weight: bold;');
        console.log(`%c${message}`, 'color: #fff;');
        break;
      }
    }

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

    // 🎉 Easter Egg: Milestone achievements
    const userMessageCount = updatedMessages.filter(m => m.role === 'user').length;
    const milestones: { [key: number]: string } = {
      5: "🎊 5 messages! You're getting the hang of this!",
      10: "🔥 10 messages! You're on fire! Did you know we have 11M+ users?",
      20: "⭐ 20 messages! Pro level! Fun fact: We hit $50M revenue in just 5 months!",
      50: "💯 50 messages! Legend status! You deserve to know: Meta wanted us, we said no. 😎",
      100: "🚀 100 messages! You're part of the 1.2 BILLION impressions club now!",
    };

    if (milestones[userMessageCount]) {
      console.log(
        `%c🎉 ACHIEVEMENT UNLOCKED! 🎉`,
        'background: #d1fe17; color: #000; font-size: 18px; font-weight: bold; padding: 8px;'
      );
      console.log(`%c${milestones[userMessageCount]}`, 'color: #d1fe17; font-size: 14px; font-weight: bold;');
    }

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

    // 🎉 Easter Egg: Set a random loading message
    setLoadingMessage(getRandomLoadingMessage());
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

          // 🎉 Easter Egg: 20% chance to add a fun fact after streaming completes
          if (Math.random() < 0.2) {
            const easterEgg = getRandomEasterEgg();
            accumulatedContent = `${accumulatedContent}\n\n---\n\n${easterEgg}`;
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

        console.log('API Response:', responseData);
        console.log('Has job_details:', !!responseData?.job_details);
        if (responseData?.job_details) {
          console.log('Job details:', responseData.job_details);
        }

        if (responseData && responseData.message) {
          // 🎉 Easter Egg: 20% chance to add a fun fact to the response
          let finalMessage = responseData.message;
          if (Math.random() < 0.2) {
            const easterEgg = getRandomEasterEgg();
            finalMessage = `${responseData.message}\n\n---\n\n${easterEgg}`;
          }

          const assistantMessage: MessageType = {
            id: responseData.id || Date.now().toString(),
            role: 'assistant',
            content: finalMessage,
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
              loadingMessage={loadingMessage}
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