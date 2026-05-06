import React, { useState, useRef, useEffect } from 'react';
import { Settings, ChevronLeft, Bot } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { Message } from '../types/chat';

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm your AI English tutor. We can practice speaking or typing today. How are you feeling?",
    sender: 'ai',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    text: "Hi! I'm doing great, thanks. I want to practice ordering food at a restaurant.",
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: '3',
    text: "Excellent choice! I'll be the waiter. Let's start:\n\n'Welcome to Bella Italia. Are you ready to order?'",
    sender: 'ai',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  }
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string, isAudio?: boolean, duration?: number) => {
    // Add user message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      isAudio,
      audioDuration: duration
    };
    setMessages(prev => [...prev, newUserMsg]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: isAudio 
          ? "Great pronunciation! I heard what you said. Let's continue our conversation." 
          : "That's a good sentence. Just remember to use 'would like' instead of 'want' to sound more polite. Try saying: 'I would like to order...'",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex justify-center items-center p-0 sm:p-4">
      {/* Mobile container wrapper (simulates mobile view on desktop) */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[85vh] bg-background sm:rounded-[2rem] sm:shadow-custom flex flex-col overflow-hidden sm:border sm:border-border relative">
        
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border z-10 sticky top-0">
          <button className="p-2 -ml-2 rounded-full hover:bg-muted text-foreground transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <h1 className="font-semibold text-base">English AI Tutor</h1>
            </div>
            <span className="text-[11px] text-muted-foreground">Always listening</span>
          </div>

          <button className="p-2 -mr-2 rounded-full hover:bg-muted text-foreground transition-colors">
            <Settings size={22} />
          </button>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 flex flex-col">
          {/* Date separator (mock) */}
          <div className="flex justify-center mb-6 mt-2">
            <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground font-medium">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} className="h-1" />
        </main>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} />

      </div>
    </div>
  );
};

export default Chat;