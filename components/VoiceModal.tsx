
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Loader2, CheckCircle2, Languages } from 'lucide-react';
import { parseVoiceCommand } from '../geminiService';
import { LogEntry } from '../types';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessed: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const LANGUAGES = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'bn-BD', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
];

const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onProcessed }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLang;
    }
  }, [selectedLang]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setTranscript(text);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition already started");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleProcess = async () => {
    if (!transcript) return;
    setIsProcessing(true);
    const result = await parseVoiceCommand(transcript);
    setIsProcessing(false);
    
    if (result) {
      onProcessed({ ...result, rawText: transcript });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-24 sm:items-center sm:pb-0 bg-black/40 backdrop-blur-md"
        >
          <motion.div 
            initial={{ y: 300, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 300, scale: 0.95 }}
            className="w-full max-w-md bg-[#0D1B2A] rounded-3xl p-8 glass overflow-hidden relative"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${selectedLang === lang.code ? 'bg-blue-600 border-blue-400 text-white' : 'glass border-white/10 text-gray-400'}`}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-8 py-4">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40 relative z-10 transition-transform ${isListening ? 'scale-110' : ''}`}>
                  {isProcessing ? (
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </div>
                {isListening && (
                  <>
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.2s' }}></div>
                  </>
                )}
              </div>

              <div className="text-center w-full">
                <h3 className="text-xl font-semibold mb-2">
                  {isProcessing ? "Analyzing..." : isListening ? "Listening..." : "Command Received"}
                </h3>
                <p className="text-gray-400 italic min-h-[3rem] px-4 overflow-hidden text-ellipsis line-clamp-2">
                  {transcript || (selectedLang === 'bn-BD' ? "বলুন: 'আমি আজ ২ ঘণ্টা পড়লাম'" : "Try: 'I studied for 2 hours today'")}
                </p>
              </div>

              {!isListening && !isProcessing && transcript && (
                <button 
                  onClick={handleProcess}
                  className="w-full py-4 bg-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30"
                >
                  <CheckCircle2 size={20} />
                  Process Log
                </button>
              )}

              {isListening && (
                <button 
                  onClick={stopListening}
                  className="px-6 py-2 border border-white/20 rounded-full text-sm text-gray-400"
                >
                  Tap to stop
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceModal;
