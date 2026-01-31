
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Volume2, Radio, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Manual implementation of encoding as per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Manual implementation of decoding as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Robust PCM decoding logic as shown in examples
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setStatus('Connecting...');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: async () => {
          setIsActive(true);
          setStatus('Listening...');
          
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const inputCtx = new AudioContext({ sampleRate: 16000 });
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            
            // Manual encode function avoids spread operator stack issues
            const base64 = encode(new Uint8Array(int16.buffer));
            
            // CRITICAL: Solely rely on sessionPromise resolves to send data
            sessionPromise.then(session => {
              session.sendRealtimeInput({ 
                media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
              });
            });
          };
          
          source.connect(processor);
          processor.connect(inputCtx.destination);
          (sessionRef as any).currentInput = { source, processor, inputCtx };
        },
        onmessage: async (message: LiveServerMessage) => {
          const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
          if (audioBase64 && audioContextRef.current) {
            const bytes = decode(audioBase64);
            // Use robust decodeAudioData function for raw PCM
            const buffer = await decodeAudioData(bytes, audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            
            // Track next start time for smooth playback
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => {
              try { s.stop(); } catch(e) {}
            });
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e) => {
          console.error(e);
          setStatus('Error occurred');
          stopSession();
        },
        onclose: () => {
          setIsActive(false);
          setStatus('Closed');
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: 'You are a friendly life tracker assistant called Alo. Talk to the user naturally about their day, habits, and productivity.'
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      if (sessionRef.current.currentInput) {
        sessionRef.current.currentInput.processor.disconnect();
        sessionRef.current.currentInput.inputCtx.close();
      }
    }
    setIsActive(false);
    setStatus('Standby');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 glass rounded-[40px] relative overflow-hidden">
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <Radio size={14} className={isActive ? 'text-rose-500 animate-pulse' : 'text-gray-500'} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{status}</span>
      </div>

      <div className="relative mb-12">
        <motion.div 
          animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`w-40 h-40 rounded-full flex items-center justify-center relative z-10 ${isActive ? 'bg-blue-600' : 'bg-white/5'}`}
        >
          {isActive ? <Volume2 size={48} /> : <Mic size={48} className="text-gray-500" />}
        </motion.div>
        
        {isActive && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping delay-700"></div>
          </div>
        )}
      </div>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold mb-2">{isActive ? "Alo is Listening..." : "Start a Conversation"}</h3>
        <p className="text-sm text-gray-500 max-w-[240px]">Speak naturally to track your life or just have a human-like chat.</p>
      </div>

      <button 
        onClick={isActive ? stopSession : startSession}
        className={`w-full py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isActive ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-blue-600 shadow-xl shadow-blue-600/30'}`}
      >
        {isActive ? <><MicOff size={20} /> End Session</> : <><Sparkles size={20} /> Connect Live</>}
      </button>
    </div>
  );
};

export default LiveAssistant;
