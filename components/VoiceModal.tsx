
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { parseVoiceCommand } from '../geminiService';
import { LogEntry } from '../types';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessed: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onProcessed }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'parsing' | 'success'>('idle');
  const [parsedPreview, setParsedPreview] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setTranscript(text);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Automatically trigger processing when user stops talking
        if (transcript) handleProcess();
      };
    }
  }, [transcript]);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setSaveStatus('idle');
      setParsedPreview(null);
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
    setSaveStatus('parsing');
    
    const result = await parseVoiceCommand(transcript);
    
    if (result) {
      setParsedPreview(result);
      setSaveStatus('success');
      setIsProcessing(false);
      
      // Final "Auto-Save" delay for visual confirmation
      setTimeout(() => {
        onProcessed(result);
        onClose();
      }, 1500);
    } else {
      setIsProcessing(false);
      setSaveStatus('idle');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-24 sm:items-center sm:pb-0 bg-black/60 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ y: 300, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 300, scale: 0.95 }}
            className="w-full max-w-sm bg-[#0D1B2A] rounded-[40px] p-10 glass border-white/10 overflow-hidden relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-8">
              {/* Mic / Status Orb */}
              <div className="relative">
                <motion.div 
                  animate={saveStatus === 'success' ? { scale: [1, 1.2, 1] } : isListening ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                    saveStatus === 'success' ? 'bg-emerald-500 shadow-emerald-500/40' : 
                    isProcessing ? 'bg-blue-600 shadow-blue-600/40' : 'bg-white/10'
                  }`}
                >
                  {saveStatus === 'success' ? (
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  ) : isProcessing ? (
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  ) : (
                    <Mic className={`w-12 h-12 ${isListening ? 'text-blue-400' : 'text-gray-500'}`} />
                  )}
                </motion.div>
                
                {isListening && (
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 -z-10"></div>
                )}
              </div>

              {/* Text Area */}
              <div className="text-center w-full min-h-[120px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {saveStatus === 'success' ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Sparkles size={14} className="text-blue-400" />
                        <h3 className="text-xl font-bold text-white">Entry Saved</h3>
                      </div>
                      <div className="glass p-3 rounded-2xl border-white/5 inline-block mx-auto">
                        <p className="text-blue-300 font-bold text-lg">{parsedPreview?.value} {parsedPreview?.unit}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{parsedPreview?.category}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                        {isProcessing ? "Gemini Intelligence" : isListening ? "Listening Now" : "Voice Command"}
                      </h3>
                      <p className="text-white text-lg font-medium leading-tight">
                        {transcript || "Speak naturally..."}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-4 italic opacity-60">
                        "I studied for 2 hours" or "Ran 5km"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Control Bar */}
              <div className="w-full">
                {isListening ? (
                  <button 
                    onClick={stopListening}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-400 transition-all"
                  >
                    Tap to finish
                  </button>
                ) : !isProcessing && saveStatus !== 'success' && transcript && (
                  <button 
                    onClick={handleProcess}
                    className="w-full py-5 bg-blue-600 rounded-3xl text-white font-bold text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                  >
                    Process with Gemini
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceModal;
