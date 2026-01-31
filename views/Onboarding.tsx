
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { User, GraduationCap, Briefcase, Home, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('Guest');

  const nextStep = () => setStep(step + 1);

  const roles = [
    { id: 'Student', icon: <GraduationCap />, desc: 'Optimize study sessions and habits.' },
    { id: 'Business', icon: <Briefcase />, desc: 'Track meetings, income, and goals.' },
    { id: 'Housewife', icon: <Home />, desc: 'Balance tasks, health, and family time.' },
  ];

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex flex-col p-8 items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="text-center w-full max-w-sm"
          >
            <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-12 glass relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-pulse"></div>
              <h1 className="text-4xl font-black text-blue-400">Alo</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">Voice your life.</h2>
            <p className="text-gray-400 mb-12">The world's most intuitive personal tracker, powered by voice.</p>
            <button 
              onClick={nextStep}
              className="w-full py-5 bg-blue-600 rounded-3xl font-bold text-xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              Get Started
              <ChevronRight />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-sm"
          >
            <h2 className="text-3xl font-bold mb-2">What's your name?</h2>
            <p className="text-gray-400 mb-8">Personalization starts with a name.</p>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full py-5 px-6 bg-white/5 border border-white/10 rounded-3xl text-xl outline-none focus:border-blue-500 transition-colors mb-8"
              autoFocus
            />
            <button 
              disabled={!name}
              onClick={nextStep}
              className={`w-full py-5 rounded-3xl font-bold text-xl transition-all ${name ? 'bg-blue-600 shadow-xl shadow-blue-500/30' : 'bg-gray-800 text-gray-500'}`}
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm"
          >
            <h2 className="text-3xl font-bold mb-2">Pick your role.</h2>
            <p className="text-gray-400 mb-8">We'll tailor your experience.</p>
            <div className="space-y-4 mb-8">
              {roles.map((r) => (
                <button 
                  key={r.id}
                  onClick={() => setRole(r.id as UserProfile['role'])}
                  className={`w-full p-6 rounded-3xl text-left glass border-2 transition-all flex items-center gap-4 ${role === r.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === r.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                    {r.icon}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{r.id}</p>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => onComplete({ name, role, onboarded: true })}
              className="w-full py-5 bg-blue-600 rounded-3xl font-bold text-xl shadow-xl shadow-blue-500/30"
            >
              Finish Setup
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
