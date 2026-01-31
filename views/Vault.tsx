
import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Shield, 
  Plus, 
  Key, 
  Eye, 
  EyeOff, 
  Search, 
  Fingerprint, 
  Check, 
  Copy, 
  Mic, 
  Loader2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseVaultCommand } from '../geminiService';
import { VaultItem } from '../types';

const Vault: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data initialization
  useEffect(() => {
    const saved = localStorage.getItem('alo_vault_items');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const initial: VaultItem[] = [
        { id: '1', label: 'Main Gmail', value: 'P@ssw0rd2025!', category: 'Personal' },
        { id: '2', label: 'DBS Bank PIN', value: '881920', category: 'Finance' },
        { id: '3', label: 'Company VPN', value: 'Alo-Dev-Secure-99', category: 'Work' },
      ];
      setItems(initial);
      localStorage.setItem('alo_vault_items', JSON.stringify(initial));
    }
  }, []);

  const handleAuth = () => {
    setIsAuthenticating(true);
    // Simulate biometric scan delay
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsAuthenticated(true);
    }, 1500);
  };

  const toggleVisibility = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVoiceAdd = async () => {
    if (!transcript) return;
    setIsProcessingVoice(true);
    const result = await parseVaultCommand(transcript);
    if (result) {
      const newItem: VaultItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...result
      };
      const updated = [newItem, ...items];
      setItems(updated);
      localStorage.setItem('alo_vault_items', JSON.stringify(updated));
      setIsVoiceModalOpen(false);
      setTranscript('');
    }
    setIsProcessingVoice(false);
  };

  const startSpeech = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onresult = (e: any) => setTranscript(e.results[0][0].transcript);
      recognition.start();
    }
  };

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          animate={isAuthenticating ? { scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] } : {}}
          className={`w-32 h-32 rounded-[40px] flex items-center justify-center mb-8 relative ${isAuthenticating ? 'bg-blue-600' : 'glass'}`}
        >
          {isAuthenticating ? (
            <Fingerprint size={64} className="text-white animate-pulse" />
          ) : (
            <Lock size={48} className="text-blue-400" />
          )}
          {isAuthenticating && (
            <div className="absolute inset-0 bg-blue-500 rounded-[40px] animate-ping opacity-20"></div>
          )}
        </motion.div>
        <h2 className="text-3xl font-black mb-3">Vault Locked</h2>
        <p className="text-gray-500 text-sm mb-12 max-w-[240px]">Access your encrypted credentials using Biometric Authentication.</p>
        
        <button 
          onClick={handleAuth}
          disabled={isAuthenticating}
          className="w-full max-w-xs py-5 bg-white text-black rounded-[28px] font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
        >
          {isAuthenticating ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
          Authenticate
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Secure Vault</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">AES-256 Active</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-blue-400 border-blue-500/20"
          >
            <Mic size={20} />
          </button>
          <button className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search encrypted items..."
          className="w-full py-5 pl-12 pr-4 bg-white/5 border border-white/10 rounded-[24px] outline-none focus:border-blue-500/50 transition-all font-medium"
        />
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-[32px] glass flex items-center justify-between border-t border-white/5 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center text-blue-400 border border-blue-500/10">
                <Key size={24} />
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">{item.category}</p>
                <p className="font-bold text-white">{item.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-mono font-medium text-blue-300 tracking-tighter">
                    {showValues[item.id] ? item.value : '••••••••••••'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-1 z-10">
              <button 
                onClick={() => toggleVisibility(item.id)}
                className="w-10 h-10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-gray-400 hover:text-white"
              >
                {showValues[item.id] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button 
                onClick={() => copyToClipboard(item.id, item.value)}
                className="w-10 h-10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-gray-400 hover:text-white"
              >
                {copiedId === item.id ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-0"></div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-[40px] bg-amber-500/5 border border-amber-500/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-2xl">
            <AlertTriangle className="text-amber-500" size={20} />
          </div>
          <h4 className="font-bold text-amber-200">Security Recommendation</h4>
        </div>
        <p className="text-xs text-amber-200/60 leading-relaxed">
          You haven't rotated your **Main Gmail** password in 180 days. Alo recommends changing it for better security.
        </p>
        <button className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1 hover:gap-2 transition-all">
          Update Now <ChevronRight size={12} />
        </button>
      </div>

      {/* Voice Entry Modal */}
      <AnimatePresence>
        {isVoiceModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass p-10 rounded-[48px] text-center space-y-8"
            >
              <div className="relative inline-block mx-auto">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-blue-600 shadow-2xl shadow-blue-600/40`}>
                  {isProcessingVoice ? <Loader2 className="animate-spin text-white" size={32} /> : <Mic className="text-white" size={32} />}
                </div>
                {!isProcessingVoice && <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>}
              </div>

              <div>
                <h3 className="text-2xl font-black mb-2">Voice Secure-Add</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-6">Powered by Gemini AI</p>
                <div className="p-6 bg-white/5 rounded-3xl min-h-[100px] flex items-center justify-center border border-white/10 italic text-gray-400">
                  {transcript || "Say: 'Store my Netflix password as MySecret123'"}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={startSpeech}
                  className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold shadow-xl active:scale-95 transition-all"
                >
                  Start Speaking
                </button>
                <button 
                  onClick={handleVoiceAdd}
                  disabled={!transcript || isProcessingVoice}
                  className="w-full py-5 glass text-white rounded-[24px] font-bold disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessingVoice && <Loader2 className="animate-spin" size={18} />}
                  Confirm Entry
                </button>
                <button 
                  onClick={() => setIsVoiceModalOpen(false)}
                  className="text-xs text-gray-500 font-bold uppercase tracking-widest hover:text-white pt-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vault;
