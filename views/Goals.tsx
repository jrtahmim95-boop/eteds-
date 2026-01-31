
import React from 'react';
import { Target, Trophy, Plus, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Goals: React.FC = () => {
  const goals = [
    { title: 'Read 20 Books', current: 8, target: 20, unit: 'Books', color: 'bg-blue-500' },
    { title: 'Lose 5kg Weight', current: 3.2, target: 5, unit: 'kg', color: 'bg-rose-500' },
    { title: 'Complete JS Course', current: 45, target: 100, unit: '%', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Targets</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full font-bold text-sm">
          <Plus size={16} /> New Goal
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal, idx) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl glass relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold">{goal.title}</h3>
                  <p className="text-xs text-gray-500 font-medium">{goal.target - goal.current} {goal.unit} left to reach goal</p>
                </div>
                <Trophy className="text-amber-400" size={24} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{progress.toFixed(0)}% Complete</span>
                  <span>{goal.current} / {goal.target} {goal.unit}</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${goal.color}`}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-8 glass rounded-3xl border border-amber-500/10 flex items-center gap-6">
        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
          <Trophy size={32} />
        </div>
        <div>
          <h4 className="font-bold text-lg">Goal Master Badge</h4>
          <p className="text-sm text-gray-400">Finish 2 more goals this month to unlock the prestigious badge!</p>
        </div>
      </div>
    </div>
  );
};

export default Goals;
