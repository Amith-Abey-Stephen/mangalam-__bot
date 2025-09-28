import React from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';

const Header = ({ onClearChat, messageCount }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">College Assistant</h1>
              <p className="text-sm text-gray-600">Your AI academic advisor</p>
            </div>
          </div>
          
          {messageCount > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {messageCount} message{messageCount !== 1 ? 's' : ''}
              </span>
              <button
                onClick={onClearChat}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;