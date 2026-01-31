
import React, { useState } from 'react';
import { Lock, Shield, Plus, Key, Eye, EyeOff, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Vault: React.FC = () => {
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});

  const items = [
    { id: '1', label: 'Gmail Password', value: 'mysecret123', category: 'Personal' },
    { id: '2', label: 'Banking PIN', value: '4928', category: 'Finance' },
    { id: '3', label: 'Work VPN', value: 'vpn_pass_2024', category: 'Work' },
  ];

  const toggleVisibility = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Secure Vault</h2>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <Shield size={12} /> AES-256 Encrypted
          </p>
        </div>
        <button className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Plus size={24} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Search vault..."
          className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500/50"
        />
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl glass flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Key size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{item.category}</p>
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm font-mono text-blue-300 mt-1">
                  {showValues[item.id] ? item.value : '••••••••••••'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => toggleVisibility(item.id)}
              className="p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              {showValues[item.id] ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 flex flex-col items-center text-center gap-4">
        <div className="p-4 bg-blue-500/10 rounded-full">
          <Shield className="text-blue-400 w-8 h-8" />
        </div>
        <div>
          <h4 className="font-bold">Privacy Guaranteed</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
            Your data is stored locally on this device. Alo cannot see your passwords.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vault;
