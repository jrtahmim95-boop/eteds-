
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { LogEntry, UserProfile } from '../types';
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  Award,
  BookOpen,
  Coffee,
  DollarSign,
  Sparkles,
  Utensils
} from 'lucide-react';
import { getQuickSummary } from '../geminiService';
// Added missing motion import
import { motion } from 'framer-motion';

interface DashboardProps {
  logs: LogEntry[];
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, user }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Filter logs for today
  const todayLogs = useMemo(() => {
    const today = new Date().setHours(0,0,0,0);
    return logs.filter(log => new Date(log.timestamp).setHours(0,0,0,0) === today);
  }, [logs]);

  // Dynamic Life Score Calculation (0-100)
  const lifeScore = useMemo(() => {
    let score = 0;
    
    // 1. Study & Sports (Core Productivity)
    const studyHours = todayLogs.filter(l => l.category === 'Study').reduce((acc, curr) => acc + curr.value, 0);
    const sportsHours = todayLogs.filter(l => l.category === 'Sports').reduce((acc, curr) => acc + curr.value, 0);
    score += Math.min(studyHours * 15, 45); // Max 45 points
    score += Math.min(sportsHours * 15, 30); // Max 30 points

    // 2. Sleep (Healthy Habits)
    const sleepLogs = todayLogs.filter(l => l.category === 'Sleep');
    if (sleepLogs.length > 0) {
      const sleepHours = sleepLogs.reduce((acc, curr) => acc + curr.value, 0);
      if (sleepHours >= 7 && sleepHours <= 9) score += 20;
      else if (sleepHours > 4) score += 10;
    }

    // 3. Mood & Consistency
    if (todayLogs.some(l => l.category === 'Mood')) score += 5;
    if (todayLogs.length >= 3) score += 10;

    return Math.min(score, 100);
  }, [todayLogs]);

  useEffect(() => {
    if (logs.length > 0) {
      getQuickSummary(user.role, logs).then(setAiSummary);
    }
  }, [logs, user.role]);

  const chartData = [
    { name: 'Mon', value: 40 },
    { name: 'Tue', value: 65 },
    { name: 'Wed', value: 55 },
    { name: 'Thu', value: 85 },
    { name: 'Fri', value: 70 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 60 },
  ];

  const categories = [
    { label: 'Study', icon: <BookOpen />, color: 'bg-blue-500' },
    { label: 'Sports', icon: <Zap />, color: 'bg-emerald-500' },
    { label: 'Expense', icon: <DollarSign />, color: 'bg-orange-500' },
    { label: 'Sleep', icon: <Coffee />, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* AI Insight Bar */}
      {aiSummary && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-3 items-start">
          <Sparkles className="text-blue-400 shrink-0" size={18} />
          <p className="text-xs text-blue-200/80 leading-relaxed italic">{aiSummary}</p>
        </div>
      )}

      {/* Life Score Hero */}
      <div className="p-6 rounded-[32px] glass relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-blue-300/80 font-medium uppercase tracking-wider">Today's Performance</p>
              <h2 className="text-5xl font-bold">{lifeScore}<span className="text-xl text-blue-400 ml-1">/100</span></h2>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-blue-400" />
            </div>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${lifeScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
            ></motion.div>
          </div>
          <p className="text-xs text-blue-200/60 mt-4 font-medium">
            {lifeScore > 80 ? "You're killing it today! 🔥" : lifeScore > 50 ? "Doing great, keep moving! 👍" : "Let's log some activities to boost your score."}
          </p>
        </div>
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat, idx) => {
          const catTotal = todayLogs.filter(l => l.category === cat.label).reduce((a, b) => a + b.value, 0);
          return (
            <div key={idx} className="p-4 rounded-2xl glass flex items-center gap-3">
              <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                {cat.icon}
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{cat.label}</p>
                <p className="text-lg font-bold">{catTotal || 0} <span className="text-[10px] text-gray-400 font-normal">pts</span></p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-[32px] glass">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold">Weekly Performance</h3>
          <select className="bg-transparent text-sm text-blue-400 outline-none">
            <option>This Week</option>
          </select>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C4FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00C4FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#00C4FF' }}
              />
              <Area type="monotone" dataKey="value" stroke="#00C4FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Today's Logs</h3>
          <button className="text-xs text-blue-400 font-bold">View History</button>
        </div>
        <div className="space-y-3">
          {todayLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic glass rounded-3xl">
              No activities logged today.
            </div>
          ) : (
            todayLogs.map((log) => (
              <motion.div 
                layout
                key={log.id} 
                className="p-4 rounded-2xl glass flex items-center gap-4 border-l-4 border-blue-500/50"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Clock size={18} className="text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{log.description}</p>
                  <p className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-400">{log.value} {log.unit}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
