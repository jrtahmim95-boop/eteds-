
import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Home, 
  Lock, 
  Target, 
  MessageCircle, 
  User,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './views/Dashboard';
import Vault from './views/Vault';
import Goals from './views/Goals';
import Chat from './views/Chat';
import Onboarding from './views/Onboarding';
import AiStudio from './views/AiStudio';
import VoiceModal from './components/VoiceModal';
import { UserProfile, LogEntry } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('alo_user');
    const savedLogs = localStorage.getItem('alo_logs');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('alo_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('alo_logs', JSON.stringify(logs));
  }, [logs]);

  const handleOnboard = (profile: UserProfile) => {
    setUser(profile);
    setIsLocked(false);
  };

  const handleAddLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  if (!user) return <Onboarding onComplete={handleOnboard} />;

  if (isLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0D1B2A]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 glass">
            <Lock className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 gradient-text">Alo Secure</h1>
          <p className="text-gray-400 mb-12">Encrypted Vault Locked</p>
          <button onClick={() => setIsLocked(false)} className="w-full max-w-xs py-4 bg-blue-600 rounded-2xl font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
            Unlock with Biometrics
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24 overflow-hidden bg-[#0D1B2A]">
      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Alo</h1>
          <p className="text-xs text-blue-300 opacity-70">Hello, {user.name}</p>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400" />
          </button>
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Dashboard logs={logs} user={user} />
            </motion.div>
          )}
          {activeTab === 'goals' && (
            <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Goals />
            </motion.div>
          )}
          {activeTab === 'studio' && (
            <motion.div key="studio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AiStudio />
            </motion.div>
          )}
          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Chat />
            </motion.div>
          )}
          {activeTab === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Vault />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-28 left-0 right-0 flex justify-center pointer-events-none z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsVoiceOpen(true)}
          className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/50 pointer-events-auto border-4 border-[#0D1B2A]"
        >
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          <Mic className="text-white w-8 h-8" />
        </motion.button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 px-4 py-4 glass border-t border-white/10 z-40 rounded-t-[32px]">
        <div className="flex justify-between items-center max-w-lg mx-auto px-4">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="Home" />
          <NavButton active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} icon={<Target />} label="Goals" />
          <NavButton active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} icon={<Sparkles />} label="AI Studio" />
          <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageCircle />} label="Chat" />
          <NavButton active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} icon={<Lock />} label="Vault" />
        </div>
      </nav>

      <VoiceModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} onProcessed={handleAddLog} />
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-400 scale-110' : 'text-gray-500 opacity-60'}`}>
    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 22 }) : icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
