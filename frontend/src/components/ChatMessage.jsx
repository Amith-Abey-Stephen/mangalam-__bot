import React from 'react';
import { User, Bot, ExternalLink } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`chat-message flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
        </div>
        
        {/* Message Content */}
        <div className={`rounded-lg px-4 py-2 ${
          isUser 
            ? 'bg-primary-600 text-white' 
            : message.isError
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-white text-gray-800 shadow-sm border'
        }`}>
          <div className="text-sm whitespace-pre-wrap">
            {message.text}
          </div>
          
          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">Sources:</p>
              <div className="space-y-1">
                {message.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Confidence Score */}
          {message.confidence !== undefined && (
            <div className="mt-2 text-xs text-gray-500">
              Confidence: {Math.round(message.confidence * 100)}%
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;