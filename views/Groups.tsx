
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Trophy, 
  Crown, 
  ChevronRight, 
  Copy, 
  Check, 
  Bell,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Group, LeaderboardMember, UserProfile, LogEntry } from '../types';
import confetti from 'canvas-confetti';

interface GroupsProps {
  user: UserProfile;
  logs: LogEntry[];
}

const Groups: React.FC<GroupsProps> = ({ user, logs }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initial Mock Data
  useEffect(() => {
    const mockGroups: Group[] = [
      {
        id: 'g1',
        name: 'Alo Alpha Testers',
        code: 'ALO789',
        createdBy: 'system',
        members: [
          { id: 'm1', name: 'Rahul S.', score: 1450, lastUpdate: Date.now() },
          { id: 'm2', name: 'Sara Khan', score: 1200, lastUpdate: Date.now() },
          { id: 'm3', name: user.name, score: 850, lastUpdate: Date.now() },
          { id: 'm4', name: 'Asif J.', score: 420, lastUpdate: Date.now() },
        ]
      }
    ];
    setGroups(mockGroups);
  }, [user.name]);

  // Scoring Logic Simulation (Cloud Function Substitute)
  const calculateScore = (userLogs: LogEntry[]) => {
    return userLogs.reduce((acc, log) => {
      let multiplier = 1;
      if (log.category === 'Study') multiplier = 10;
      if (log.category === 'Prayer') multiplier = 15;
      if (log.category === 'Sports') multiplier = 8;
      if (log.category === 'Sleep') multiplier = 2;
      return acc + (log.value * multiplier);
    }, 0);
  };

  const currentScore = 850 + calculateScore(logs);

  const handleCreateGroup = () => {
    if (!newGroupName) return;
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGroupName,
      code: Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdBy: user.name,
      members: [
        { id: 'me', name: user.name, score: currentScore, lastUpdate: Date.now() }
      ]
    };
    setGroups([newGroup, ...groups]);
    setShowCreateModal(false);
    setNewGroupName('');
    setActiveGroup(newGroup);
    confetti();
  };

  const handleJoinGroup = () => {
    if (joinCode.length !== 6) return;
    setNotification(`Successfully joined ${joinCode}!`);
    setTimeout(() => setNotification(null), 3000);
    setShowJoinModal(false);
    setJoinCode('');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulated "Beat you" notification logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (groups.length > 0) {
        setNotification("⚠️ Alert: Sara Khan just added a study log and beat your rank!");
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [groups]);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-24 left-6 right-6 z-[100] glass p-4 rounded-2xl border-blue-500/30 flex items-center gap-3 shadow-2xl"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Bell className="text-blue-400" size={18} />
            </div>
            <p className="text-xs font-bold text-white flex-1">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Circles</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowJoinModal(true)}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center text-blue-400"
          >
            <Search size={18} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeGroup ? (
          <motion.div 
            key="leaderboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setActiveGroup(null)} className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <ChevronRight className="rotate-180" size={14} /> Back to Circles
              </button>
              <div 
                onClick={() => copyCode(activeGroup.code)}
                className="glass px-3 py-1 rounded-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <span className="text-[10px] font-mono font-bold text-gray-400">{activeGroup.code}</span>
                {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} className="text-gray-500" />}
              </div>
            </div>

            <div className="glass p-6 rounded-[32px] relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                      <Trophy className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{activeGroup.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Weekly Leaderboard</p>
                    </div>
                  </div>
                  <Sparkles className="text-blue-400" size={20} />
               </div>

               <div className="space-y-3">
                  {activeGroup.members
                    .sort((a, b) => b.score - a.score)
                    .map((member, index) => {
                      const isMe = member.name === user.name;
                      const scoreToDisplay = isMe ? currentScore : member.score;
                      
                      return (
                        <motion.div 
                          key={member.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${
                            isMe ? 'bg-blue-600/20 border-blue-500/30' : 'glass border-transparent'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                            index === 0 ? 'bg-amber-400 text-black' : 
                            index === 1 ? 'bg-gray-300 text-black' :
                            index === 2 ? 'bg-orange-400 text-black' : 'bg-white/5 text-gray-500'
                          }`}>
                            {index === 0 ? <Crown size={14} /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${isMe ? 'text-blue-400' : 'text-white'}`}>
                              {member.name} {isMe && '(You)'}
                            </p>
                            <div className="flex items-center gap-1">
                               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Level {Math.floor(scoreToDisplay / 500)} Master</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="font-black text-lg leading-tight">{scoreToDisplay.toLocaleString()}</p>
                             <div className={`flex items-center justify-end gap-0.5 text-[8px] font-bold ${index < 2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {index < 2 ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                                {Math.floor(Math.random() * 5)}%
                             </div>
                          </div>
                        </motion.div>
                      );
                    })}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {groups.length === 0 ? (
              <div className="p-12 text-center glass rounded-[40px] space-y-4">
                <Users className="mx-auto text-gray-700" size={48} />
                <p className="text-gray-500 text-sm">You haven't joined any circles yet. Life is better with friends!</p>
                <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-blue-600 rounded-2xl text-white font-bold text-xs uppercase tracking-widest">Create Circle</button>
              </div>
            ) : (
              groups.map((group) => (
                <div 
                  key={group.id} 
                  onClick={() => setActiveGroup(group)}
                  className="p-6 rounded-[32px] glass flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{group.name}</h3>
                      <p className="text-xs text-gray-500">{group.members.length} Members • Your Rank: #3</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full glass border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm glass p-8 rounded-[40px] space-y-6"
            >
              <h3 className="text-2xl font-bold text-center">Join Circle</h3>
              <p className="text-center text-gray-500 text-sm">Enter the 6-character code shared by your friend.</p>
              <input 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="Ex: ALO123"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-xl font-black tracking-[0.5em] outline-none focus:border-blue-500"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowJoinModal(false)} className="flex-1 py-4 glass rounded-2xl font-bold text-gray-400">Cancel</button>
                <button onClick={handleJoinGroup} className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white">Join</button>
              </div>
            </motion.div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm glass p-8 rounded-[40px] space-y-6"
            >
              <h3 className="text-2xl font-bold text-center">New Circle</h3>
              <p className="text-center text-gray-500 text-sm">Compete and grow with your specific squad.</p>
              <input 
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group Name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-4 glass rounded-2xl font-bold text-gray-400">Cancel</button>
                <button onClick={handleCreateGroup} className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white">Create</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Groups;
