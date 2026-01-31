
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Bell, 
  BellOff, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { PlannerTask } from '../types';
import confetti from 'canvas-confetti';

const Planner: React.FC = () => {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('alo_planner_tasks');
    if (saved) setTasks(JSON.parse(saved));
    else {
      setTasks([
        { id: '1', title: 'Gym session (30 min)', completed: false, notificationEnabled: true },
        { id: '2', title: 'Morning prayer', time: '05:30 AM', completed: false, notificationEnabled: true },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('alo_planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      // Short buzz for completion
      navigator.vibrate([10, 30, 10]);
    }
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: PlannerTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      completed: false,
      notificationEnabled: true
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    triggerHaptic();
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newState = !t.completed;
        if (newState) {
          triggerHaptic();
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
        }
        return { ...t, completed: newState };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if ('vibrate' in navigator) navigator.vibrate(5);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tomorrow's Plan</h2>
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest opacity-60">
            {new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <CalendarDays className="text-blue-400" size={20} />
        </div>
      </div>

      <div className="relative">
        <input 
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="New target..."
          className="w-full py-5 pl-6 pr-16 bg-white/5 border border-white/10 rounded-[28px] outline-none focus:border-blue-500 transition-all font-medium"
        />
        <button 
          onClick={addTask}
          className="absolute right-3 top-3 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-5 rounded-[32px] glass flex items-center justify-between border-t border-white/5 ${task.completed ? 'opacity-40 grayscale' : ''}`}
          >
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  task.completed ? 'bg-emerald-500 text-white' : 'border-2 border-white/10 text-transparent'
                }`}
              >
                <CheckCircle2 size={18} />
              </button>
              <h4 className={`font-bold text-sm ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
            </div>
            <button onClick={() => deleteTask(task.id)} className="p-3 text-rose-500/30">
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
