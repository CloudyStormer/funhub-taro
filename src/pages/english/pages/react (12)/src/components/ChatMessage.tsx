import React from 'react';
import { Bot, User, Volume2 } from 'lucide-react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      data-cmp="ChatMessage"
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 flex items-end ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-custom ${
            isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 shadow-custom ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
                : 'bg-card border border-border text-card-foreground rounded-2xl rounded-bl-sm'
            }`}
          >
            {message.isAudio ? (
              <div className="flex items-center space-x-2 min-w-[120px]">
                <Volume2 size={18} className={isUser ? 'text-primary-foreground' : 'text-primary'} />
                <div className="flex-1 h-1 bg-current opacity-30 rounded-full overflow-hidden">
                  <div className="h-full bg-current w-1/3 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs font-medium">{message.audioDuration}s</span>
              </div>
            ) : (
              <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                {message.text}
              </p>
            )}
          </div>
          
          {/* Timestamp */}
          <span className={`text-[11px] text-muted-foreground mt-1 ${isUser ? 'text-right mr-1' : 'text-left ml-1'}`}>
            {formatTime(message.timestamp)}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ChatMessage;