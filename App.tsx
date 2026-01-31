
import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Home, 
  Lock, 
  Target, 
  Users, 
  User,
  Calendar,
  Sparkles,
  Key,
  BarChart3,
  ListChecks
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './views/Dashboard';
import Vault from './views/Vault';
import Goals from './views/Goals';
import Chat from './views/Chat';
import Onboarding from './views/Onboarding';
import AiStudio from './views/AiStudio';
import WeeklyReport from './views/WeeklyReport';
import Groups from './views/Groups';
import Planner from './views/Planner';
import VoiceModal from './components/VoiceModal';
import WaveBackground from './components/WaveBackground';
import { UserProfile, LogEntry } from './types';
import confetti from 'canvas-confetti';

// Removed local AIStudio interface and Window augmentation because 
// they are pre-configured in the environment's global scope.

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('alo_user_v2');
    const savedLogs = localStorage.getItem('alo_logs_v2');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
    
    if (savedLogs) setLogs(JSON.parse(savedLogs));

    const checkKey = async () => {
      // Accessing aistudio from the global window object.
      const aiStudio = (window as any).aistudio;
      if (aiStudio && typeof aiStudio.hasSelectedApiKey === 'function') {
        const hasKey = await aiStudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('alo_user_v2', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('alo_logs_v2', JSON.stringify(logs));
  }, [logs]);

  const handleOnboardComplete = (profile: UserProfile) => {
    setUser(profile);
    setIsLocked(false);
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#00C4FF', '#ffffff', '#0070f3', '#10b981']
    });
  };

  const handleAddLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev]);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00C4FF', '#ffffff']
    });
  };

  const handleSelectKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio && typeof aiStudio.openSelectKey === 'function') {
      await aiStudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  if (!user) return <Onboarding onComplete={handleOnboardComplete} />;

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0D1B2A] relative overflow-hidden">
        <WaveBackground />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full max-w-md z-10 glass p-10 rounded-[40px]">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Key className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">AI Studio Setup</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            Advanced features like Video Generation and High-Quality Imaging require a selected API key.
          </p>
          <div className="mb-8">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 underline">
              Billing Documentation
            </a>
          </div>
          <button onClick={handleSelectKey} className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-600/20">
            Select API Key
          </button>
        </motion.div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0D1B2A] relative overflow-hidden">
        <WaveBackground />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full max-w-xs z-10">
          <div className="w-28 h-28 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 glass">
            <Lock className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3 gradient-text">Alo</h1>
          <p className="text-gray-400 mb-12 text-sm font-medium">Vault Encrypted</p>
          <button onClick={() => setIsLocked(false)} className="w-full py-5 bg-white text-black rounded-[24px] font-bold hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/10">
            Authenticate
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24 overflow-hidden relative">
      <WaveBackground />
      
      <header className="px-6 pt-14 pb-6 flex justify-between items-center z-10 sticky top-0">
        <div>
          <h1 className="text-3xl font-black gradient-text tracking-tighter">Alo</h1>
          <p className="text-[11px] text-blue-300 font-bold uppercase tracking-widest opacity-60">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setActiveTab('planner')} className="w-11 h-11 rounded-full glass flex items-center justify-center active:scale-90 transition-transform">
            <Calendar className="w-5 h-5 text-white" />
          </button>
          <button className="w-11 h-11 rounded-full glass flex items-center justify-center active:scale-90 transition-transform">
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 overflow-y-auto scroll-smooth z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <Dashboard logs={logs} user={user} />
            </motion.div>
          )}
          {activeTab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <WeeklyReport logs={logs} />
            </motion.div>
          )}
          {activeTab === 'groups' && (
            <motion.div key="groups" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <Groups user={user} logs={logs} />
            </motion.div>
          )}
          {activeTab === 'planner' && (
            <motion.div key="planner" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <Planner />
            </motion.div>
          )}
          {activeTab === 'studio' && (
            <motion.div key="studio" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <AiStudio />
            </motion.div>
          )}
          {activeTab === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <Vault />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-32 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="relative pointer-events-auto">
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-blue-400 rounded-full blur-xl"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsVoiceOpen(true)}
            className="relative w-18 h-18 bg-white text-black rounded-full flex items-center justify-center shadow-2xl z-10 border-[6px] border-[#0d1e30]"
            style={{ width: '72px', height: '72px' }}
          >
            <Mic className="w-8 h-8" />
          </motion.button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 px-6 py-6 glass border-t border-white/5 z-40 rounded-t-[40px] safe-bottom">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="Home" />
          <NavButton active={activeTab === 'planner'} onClick={() => setActiveTab('planner')} icon={<ListChecks />} label="Plan" />
          <div className="w-14"></div>
          <NavButton active={activeTab === 'groups'} onClick={() => setActiveTab('groups')} icon={<Users />} label="Circles" />
          <NavButton active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} icon={<Lock />} label="Vault" />
        </div>
      </nav>

      <VoiceModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} onProcessed={handleAddLog} />
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-white scale-110' : 'text-gray-500 opacity-50'}`}>
    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: active ? 2.5 : 2 }) : icon}
    <span className={`text-[9px] font-bold uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

export default App;
