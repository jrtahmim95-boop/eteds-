
import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Trophy, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, SubTask, Category } from '../types';
import confetti from 'canvas-confetti';

const Goals: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('alo_goals_v3');
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      const initial: Goal[] = [
        {
          id: 'g1',
          title: 'Master Flutter UI',
          timeframe: 'Monthly',
          category: 'Study',
          deadline: Date.now() + 2592000000,
          tasks: [
            { id: 't1', text: 'Learn CustomPainter', completed: true },
            { id: 't2', text: 'Build 5 Glassmorphism screens', completed: false },
            { id: 't3', text: 'Integrate Gemini API', completed: false }
          ]
        },
        {
          id: 'g2',
          title: 'Health Renaissance',
          timeframe: 'Yearly',
          category: 'Sports',
          deadline: Date.now() + 31536000000,
          tasks: [
            { id: 't4', text: 'Run 500km total', completed: false },
            { id: 't5', text: 'Reach 75kg target weight', completed: true },
            { id: 't6', text: 'Drink 3L water daily', completed: false }
          ]
        }
      ];
      setGoals(initial);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('alo_goals_v3', JSON.stringify(goals));
  }, [goals]);

  const calculateProgress = (tasks: SubTask[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const toggleTask = (goalId: string, taskId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedTasks = goal.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        
        // Trigger confetti if this task completion finished the goal
        const wasFinished = updatedTasks.every(t => t.completed);
        const previouslyUnfinished = goal.tasks.some(t => !t.completed);
        
        if (wasFinished && previouslyUnfinished) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00C4FF', '#ffffff', '#FFD700']
          });
        }
        
        return { ...goal, tasks: updatedTasks };
      }
      return goal;
    }));
  };

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoalTitle,
      timeframe,
      category: 'General',
      deadline: Date.now() + (timeframe === 'Monthly' ? 2592000000 : 31536000000),
      tasks: []
    };
    setGoals([newGoal, ...goals]);
    setNewGoalTitle('');
    setShowAddModal(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const filteredGoals = goals.filter(g => g.timeframe === timeframe);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Life Targets</h2>
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest opacity-60">Plan your future</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Timeframe Switcher */}
      <div className="p-1 glass rounded-2xl flex gap-1">
        {(['Monthly', 'Yearly'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              timeframe === t ? 'bg-white text-black shadow-lg' : 'text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredGoals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center glass rounded-[40px] border border-white/5 space-y-4"
            >
              <Target className="mx-auto text-gray-700" size={48} />
              <p className="text-gray-500 text-sm italic">"A goal without a plan is just a wish."</p>
              <button onClick={() => setShowAddModal(true)} className="text-blue-400 font-bold text-xs uppercase">Set your first target</button>
            </motion.div>
          ) : (
            filteredGoals.map((goal) => {
              const progress = calculateProgress(goal.tasks);
              const isExpanded = expandedGoal === goal.id;

              return (
                <motion.div 
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass rounded-[32px] overflow-hidden border border-white/5"
                >
                  <div 
                    className="p-6 cursor-pointer select-none"
                    onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${progress === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {progress === 100 ? <Trophy size={20} /> : <Zap size={20} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{goal.title}</h3>
                          <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
                            Ends {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-500">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                        <span className={progress === 100 ? 'text-emerald-400' : 'text-blue-400'}>{progress}% Reach</span>
                        <span className="text-gray-500">{goal.tasks.filter(t => t.completed).length}/{goal.tasks.length} Steps</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-white/5"
                      >
                        <div className="p-6 space-y-3">
                          {goal.tasks.map((task) => (
                            <div 
                              key={task.id} 
                              onClick={() => toggleTask(goal.id, task.id)}
                              className="flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                  task.completed ? 'bg-blue-500 text-white' : 'border border-white/20 text-transparent'
                                }`}>
                                  <CheckCircle2 size={14} />
                                </div>
                                <span className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                  {task.text}
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          <div className="pt-4 flex justify-between items-center border-t border-white/5">
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
                              className="p-2 text-rose-500/50 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1">
                              Edit Details <ArrowRight size={10} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass p-8 rounded-[40px] space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-black">Set New {timeframe} Target</h3>
              </div>

              <input 
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="What do you want to achieve?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-500 transition-all font-bold"
                autoFocus
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 glass rounded-2xl font-bold text-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={addGoal}
                  disabled={!newGoalTitle.trim()}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 disabled:opacity-50"
                >
                  Set Target
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
