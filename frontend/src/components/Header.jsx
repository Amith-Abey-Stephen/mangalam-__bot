import React, { useState } from 'react';
import { MessageSquare, RefreshCw, Volume2, VolumeX, Settings } from 'lucide-react';
import { useTTS } from './TTSContext';


const Header = ({ onClearChat, messageCount }) => {
  const { enabled, setEnabled, lang, setLang, voice, setVoice, pitch, setPitch, rate, setRate, voices } = useTTS();
  const [showSettings, setShowSettings] = useState(false);

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

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setEnabled(!enabled)}
              className={`inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${enabled ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'} hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors`}
              title={enabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
            >
              {enabled ? <Volume2 className="h-5 w-5 mr-1" /> : <VolumeX className="h-5 w-5 mr-1" />}
              {enabled ? 'Speaker On' : 'Speaker Off'}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              title="TTS Settings"
            >
              <Settings className="h-5 w-5 mr-1" />
              Settings
            </button>
            {messageCount > 0 && (
              <span className="text-sm text-gray-500">
                {messageCount} message{messageCount !== 1 ? 's' : ''}
              </span>
            )}
            {messageCount > 0 && (
              <button
                onClick={onClearChat}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Clear
              </button>
            )}
          </div>
        </div>
        {/* TTS Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Text-to-Speech Settings</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select value={lang} onChange={e => setLang(e.target.value)} className="w-full border rounded px-2 py-1">
                    <option value="en-US">English (US)</option>
                    <option value="ml-IN">Malayalam (India)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Voice</label>
                  <select value={voice?.name || ''} onChange={e => setVoice(voices.find(v => v.name === e.target.value))} className="w-full border rounded px-2 py-1">
                    {voices.filter(v => v.lang === lang).map(v => (
                      <option key={v.name} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pitch</label>
                  <input type="range" min="0.5" max="2" step="0.01" value={pitch} onChange={e => setPitch(Number(e.target.value))} />
                  <span className="ml-2 text-xs">{pitch}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Speed</label>
                  <input type="range" min="0.5" max="2" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} />
                  <span className="ml-2 text-xs">{rate}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded bg-primary-600 text-white">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;