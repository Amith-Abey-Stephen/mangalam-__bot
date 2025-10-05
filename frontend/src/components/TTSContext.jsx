import React, { createContext, useContext, useState, useEffect } from 'react';

const TTSContext = createContext();

export const useTTS = () => useContext(TTSContext);

export const TTSProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('tts-enabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [lang, setLang] = useState('en-US');
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    localStorage.setItem('tts-enabled', JSON.stringify(enabled));
    if (!enabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [enabled]);

  useEffect(() => {
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (!voice && v.length) {
        setVoice(v.find(vv => vv.lang === lang) || v[0]);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, [lang, voice]);

  const speakText = (text, language = lang) => {
    if (!enabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = language;
    utter.voice = voice;
    utter.pitch = pitch;
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  };

  const value = {
    enabled,
    setEnabled,
    lang,
    setLang,
    voice,
    setVoice,
    pitch,
    setPitch,
    rate,
    setRate,
    voices,
    speakText,
  };

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
};
