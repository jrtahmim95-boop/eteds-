
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  Award,
  BookOpen,
  DollarSign,
  Sparkles,
  Settings2,
  QrCode,
  Volume2,
  Eye,
  EyeOff,
  Share2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry, UserProfile } from '../types';
import { getQuickSummary, textToSpeech } from '../geminiService';

interface DashboardProps {
  logs: LogEntry[];
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, user }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isMorningPlayed, setIsMorningPlayed] = useState(false);
  const [layout, setLayout] = useState({
    showScore: true,
    showCategories: true,
    showActivities: true
  });
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    if (logs.length > 0) {
      getQuickSummary(user.role, logs).then(setAiSummary);
    }
    
    // Auto-trigger Morning Message
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12 && !isMorningPlayed) {
      handleMorningGreeting();
    }
  }, [logs, user.role]);

  const handleMorningGreeting = async () => {
    setIsMorningPlayed(true);
    const greeting = `Good morning, ${user.name}. You have 3 tasks in your planner today. Let's make it a great ${user.role} day!`;
    setAiSummary(greeting);
    
    // Play TTS
    const base64 = await textToSpeech(greeting);
    if (base64) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const pcmData = atob(base64);
      const arrayBuffer = new Uint8Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) arrayBuffer[i] = pcmData.charCodeAt(i);
      const dataInt16 = new Int16Array(arrayBuffer.buffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  };

  const categories = [
    { label: 'Study', icon: <BookOpen />, color: 'bg-blue-500' },
    { label: 'Health', icon: <Zap />, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center px-1">
        <button 
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`p-3 rounded-2xl transition-all ${isCustomizing ? 'bg-blue-600 text-white' : 'glass text-gray-400'}`}
        >
          <Settings2 size={18} />
        </button>
        <div className="flex gap-2">
          <button onClick={() => setShowQrModal(true)} className="p-3 glass rounded-2xl text-blue-400">
            <QrCode size={18} />
          </button>
          <button onClick={handleMorningGreeting} className="p-3 glass rounded-2xl text-amber-400">
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      {/* Customizable Morning Greeting */}
      {aiSummary && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-[28px] bg-blue-500/10 border border-blue-500/20 flex gap-4 items-start relative overflow-hidden">
          <Sparkles className="text-blue-400 shrink-0 mt-1" size={20} />
          <p className="text-sm text-blue-100/90 leading-relaxed font-medium">{aiSummary}</p>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-400/5 rounded-full blur-xl"></div>
        </motion.div>
      )}

      {/* Customizable Widgets */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="p-4 glass rounded-3xl grid grid-cols-3 gap-2 border-dashed border-white/20"
          >
            <button onClick={() => setLayout({...layout, showScore: !layout.showScore})} className={`p-2 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 ${layout.showScore ? 'text-blue-400 bg-blue-500/10' : 'text-gray-600'}`}>
              {layout.showScore ? <Eye size={14}/> : <EyeOff size={14}/>} Score
            </button>
            <button onClick={() => setLayout({...layout, showCategories: !layout.showCategories})} className={`p-2 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 ${layout.showCategories ? 'text-blue-400 bg-blue-500/10' : 'text-gray-600'}`}>
              {layout.showCategories ? <Eye size={14}/> : <EyeOff size={14}/>} Circles
            </button>
            <button onClick={() => setLayout({...layout, showActivities: !layout.showActivities})} className={`p-2 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 ${layout.showActivities ? 'text-blue-400 bg-blue-500/10' : 'text-gray-600'}`}>
              {layout.showActivities ? <Eye size={14}/> : <EyeOff size={14}/>} History
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {layout.showScore && (
        <div className="p-6 rounded-[32px] glass relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-blue-300/80 font-medium uppercase tracking-wider">Productivity Score</p>
                <h2 className="text-5xl font-black tracking-tighter">82<span className="text-xl text-blue-400 ml-1">/100</span></h2>
              </div>
              <TrendingUp className="text-blue-400" />
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[82%] shadow-[0_0_15px_rgba(59,130,246,0.4)]"></div>
            </div>
          </div>
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
        </div>
      )}

      {layout.showCategories && (
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-2xl glass flex items-center gap-3 active:scale-95 transition-transform">
              <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                {cat.icon}
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{cat.label}</p>
                <p className="text-lg font-bold">12h</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {layout.showActivities && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm px-1">Recent Activities</h3>
          {logs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-4 rounded-2xl glass flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-300">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{log.description}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
              </div>
              <p className="font-black text-blue-400">{log.value} {log.unit}</p>
            </div>
          ))}
        </div>
      )}

      {/* QR Sharing Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm glass p-10 rounded-[48px] text-center space-y-8 relative">
              <button onClick={() => setShowQrModal(false)} className="absolute top-6 right-6 text-gray-500"><X/></button>
              <div>
                <h3 className="text-2xl font-black mb-2">Share Alo Profile</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Connect with your Circle</p>
              </div>
              <div className="p-8 bg-white rounded-[32px] inline-block mx-auto shadow-2xl">
                {/* Simplified QR Placeholder */}
                <div className="w-40 h-40 bg-black flex flex-wrap p-1">
                   {Array.from({length: 100}).map((_, i) => (
                     <div key={i} className={`w-[10%] h-[10%] ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                   ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-400">ID: ALO-{user.name.toUpperCase()}-77</p>
                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Share2 size={18}/> Share Image
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
