
import React, { useState } from 'react';
import { Send, Image, Smile, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { id: '1', sender: 'Rahul', text: 'How are the study goals going everyone?', timestamp: '10:00 AM', isSelf: false },
    { id: '2', sender: 'Me', text: 'Finished 3 hours already! 💪', timestamp: '10:05 AM', isSelf: true },
    { id: '3', sender: 'Sara', text: 'Amazing! I just finished my gym session.', timestamp: '10:10 AM', isSelf: false },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'Me',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };
    setChat([...chat, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex items-center gap-2 mb-4 p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
        <ShieldCheck className="text-emerald-400" size={16} />
        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">End-to-End Encrypted Group</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth">
        <AnimatePresence>
          {chat.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: msg.isSelf ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
            >
              {!msg.isSelf && <span className="text-[10px] text-gray-500 mb-1 ml-3">{msg.sender}</span>}
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.isSelf ? 'bg-blue-600 rounded-tr-none' : 'glass rounded-tl-none'}`}>
                <p className="text-sm">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[10px] opacity-40">{msg.timestamp}</span>
                  {msg.isSelf && <ShieldCheck size={10} className="text-blue-300 opacity-60" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-3 glass p-2 rounded-2xl border-white/10">
        <button className="p-3 text-gray-400 hover:text-white transition-colors">
          <Image size={20} />
        </button>
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type securely..."
          className="flex-1 bg-transparent border-none outline-none text-sm px-2"
        />
        <button 
          onClick={handleSend}
          className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/30"
        >
          <Send size={20} />
        </button>
      </div>
      
      <p className="text-[9px] text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
        <Lock size={10} /> Screenshots are blocked in this secure environment.
      </p>
    </div>
  );
};

export default Chat;
