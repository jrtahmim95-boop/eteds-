
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Share2, 
  MessageSquare, 
  TrendingUp, 
  Star,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { LogEntry } from '../types';

interface WeeklyReportProps {
  logs: LogEntry[];
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ logs }) => {
  // Simulated data based on categories
  const reportData = [
    { day: 'Mon', Study: 4, Sleep: 7, Prayer: 1 },
    { day: 'Tue', Study: 6, Sleep: 6.5, Prayer: 1.5 },
    { day: 'Wed', Study: 5, Sleep: 8, Prayer: 1 },
    { day: 'Thu', Study: 7, Sleep: 6, Prayer: 2 },
    { day: 'Fri', Study: 4.5, Sleep: 7.5, Prayer: 1 },
    { day: 'Sat', Study: 2, Sleep: 9, Prayer: 2 },
    { day: 'Sun', Study: 1, Sleep: 8.5, Prayer: 3 },
  ];

  const score = 88; // Calculated dynamically in real app

  const badges = [
    { id: 1, name: 'Prayer Champion', icon: <Star className="text-amber-400" />, desc: '3+ hours of prayer this week' },
    { id: 2, name: 'Bookworm', icon: <Award className="text-blue-400" />, desc: '30+ study hours logged' },
    { id: 3, name: 'Consistency King', icon: <Zap className="text-purple-400" />, desc: '7 day tracking streak' },
  ];

  const handleShareWhatsApp = () => {
    const text = `🚀 My Alo Weekly Report is out!\n\n✨ Weekly Score: ${score}/100\n📚 Study: 32h\n😴 Sleep: 52h\n🙏 Prayer: 12h\n\nTracked with Alo - Voice Your Life.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Score Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 rounded-[40px] glass relative overflow-hidden text-center border-t border-white/20"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-[8px] border-white/5 flex items-center justify-center mb-4 relative">
             <motion.div 
              initial={{ rotate: -90 }}
              animate={{ rotate: 360 * (score / 100) - 90 }}
              className="absolute inset-0 rounded-full border-[8px] border-emerald-400 border-t-transparent border-r-transparent"
             />
             <h2 className="text-4xl font-black">{score}<span className="text-lg text-emerald-400 ml-0.5">%</span></h2>
          </div>
          <h3 className="text-xl font-bold mb-1">Elite Performance</h3>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Global Ranking: Top 3%</p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -z-10"></div>
      </motion.div>

      {/* Chart Section */}
      <div className="p-6 rounded-[32px] glass">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="font-bold text-lg">Focus Allocation</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Past 7 Days (Hours)</p>
          </div>
          <TrendingUp className="text-emerald-400" size={20} />
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              <Bar dataKey="Study" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sleep" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Prayer" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" />
          Weekly Badges
        </h4>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {badges.map((badge) => (
            <motion.div 
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              className="min-w-[160px] p-4 rounded-3xl glass text-center border border-white/5"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                {badge.icon}
              </div>
              <p className="text-xs font-bold mb-1">{badge.name}</p>
              <p className="text-[9px] text-gray-500 leading-tight">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <button 
        onClick={handleShareWhatsApp}
        className="w-full py-5 bg-emerald-600 rounded-[28px] text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
      >
        <MessageSquare size={20} />
        Share to WhatsApp
      </button>

      <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <CheckCircle2 className="text-blue-400" />
        </div>
        <div>
          <h5 className="text-sm font-bold">Goal Streak Active</h5>
          <p className="text-[11px] text-gray-400">Keep tracking for 3 more days to unlock the "Iron Will" badge.</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
