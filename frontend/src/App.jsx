import React, { useState, useRef, useEffect } from 'react';
import { useTTS } from './components/TTSContext';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import TypingIndicator from './components/TypingIndicator';
import { chatService } from './services/chatService';

function App() {
  const { enabled, speakText, lang } = useTTS();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      text: message,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.sendQuery(message);
      const botMessage = {
        id: Date.now() + 1,
        text: response.answer,
        type: 'bot',
        timestamp: new Date(),
        confidence: response.confidence,
        sources: response.sources
      };
      setMessages(prev => [...prev, botMessage]);
      // TTS: Speak bot response if enabled
      if (enabled && botMessage.text) {
        speakText(botMessage.text, lang);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I encountered an error. Please try again.');
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I apologize, but I encountered an error while processing your question. Please try again in a moment.',
        type: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      // TTS: Speak error if enabled
      if (enabled) {
        speakText(errorMessage.text, lang);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onClearChat={clearChat} messageCount={messages.length} />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {messages.length === 0 ? (
                <WelcomeScreen onSampleQuestion={handleSendMessage} />
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
              
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="py-4">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;