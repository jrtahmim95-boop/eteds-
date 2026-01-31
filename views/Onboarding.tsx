
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  Home, 
  ChevronRight, 
  Phone, 
  Facebook,
  Loader2,
  CheckCircle2,
  Mail
} from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: Welcome, 1: Login, 2: Quiz, 3: Name
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('Guest');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSocialLogin = (platform: string) => {
    setIsLoggingIn(true);
    // Simulate Firebase/Google Sign-In interaction
    setTimeout(() => {
      setIsLoggingIn(false);
      setStep(2);
    }, 1500);
  };

  const roles = [
    { id: 'Student', label: 'Student', icon: <GraduationCap />, desc: 'Focus on studies, habits, and growth.' },
    { id: 'Businessman', label: 'Businessman', icon: <Briefcase />, desc: 'Track professional wins and finances.' },
    { id: 'Housewife', label: 'Housewife', icon: <Home />, desc: 'Manage family wellness and home tasks.' },
  ];

  const stepLabels = ['Welcome', 'Auth', 'Persona', 'Identity'];

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Progress Bar */}
      {step > 0 && (
        <div className="absolute top-16 left-0 right-0 px-12 z-20">
          <div className="flex justify-between mb-2">
            {stepLabels.map((label, i) => (
              <span key={i} className={`text-[10px] font-bold uppercase tracking-widest ${i <= step ? 'text-blue-400' : 'text-gray-600'}`}>
                {label}
              </span>
            ))}
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center w-full max-w-sm z-10"
          >
            <div className="w-32 h-32 bg-blue-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-10 glass relative shadow-2xl">
              <h1 className="text-4xl font-black gradient-text tracking-tighter">Alo</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tighter">Voice your life.</h2>
            <p className="text-gray-400 mb-12 text-lg font-medium leading-relaxed">
              Your intelligent, voice-first companion for tracking everyday life.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="w-full py-5 bg-white text-black rounded-[28px] font-bold text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Get Started
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm z-10 text-center"
          >
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Join Alo</h2>
            <p className="text-gray-400 mb-10 font-medium">Create your secure account to start tracking.</p>
            
            <div className="space-y-4">
              <SocialButton 
                onClick={() => handleSocialLogin('Google')}
                icon={<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />}
                label="Continue with Google"
                loading={isLoggingIn}
              />
              <SocialButton 
                onClick={() => handleSocialLogin('Facebook')}
                icon={<Facebook className="text-white" fill="currentColor" />}
                label="Continue with Facebook"
                className="bg-[#1877F2] text-white border-none"
                loading={isLoggingIn}
              />
              <SocialButton 
                onClick={() => setStep(2)}
                icon={<Phone className="text-emerald-400" />}
                label="Sign in with Phone"
                loading={isLoggingIn}
              />
            </div>

            <p className="mt-12 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] opacity-50">
              Powered by Firebase Authentication
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm z-10"
          >
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Daily Journey</h2>
            <p className="text-gray-400 mb-8 font-medium">Which best describes your current role?</p>
            
            <div className="space-y-4 mb-10">
              {roles.map((r) => (
                <button 
                  key={r.id}
                  onClick={() => setRole(r.id as UserProfile['role'])}
                  className={`w-full p-6 rounded-[32px] text-left glass border-2 transition-all flex items-center gap-5 ${role === r.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${role === r.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-gray-400'}`}>
                    {React.cloneElement(r.icon as React.ReactElement<any>, { size: 28 })}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-xl">{r.label}</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed opacity-60">{r.desc}</p>
                  </div>
                  {role === r.id && <CheckCircle2 className="text-blue-500" size={24} />}
                </button>
              ))}
            </div>

            <button 
              disabled={role === 'Guest'}
              onClick={() => setStep(3)}
              className={`w-full py-5 rounded-[28px] font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-2 ${role !== 'Guest' ? 'bg-blue-600 text-white active:scale-95' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
            >
              Continue
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm z-10"
          >
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Final Step</h2>
            <p className="text-gray-400 mb-10 font-medium">How should Alo address you?</p>
            
            <div className="relative mb-10">
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full py-6 px-8 bg-white/5 border border-white/10 rounded-[28px] text-2xl font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-center"
                autoFocus
              />
              <div className="absolute -bottom-6 left-0 right-0 text-center">
                <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest">Saved to Local Vault</span>
              </div>
            </div>

            <button 
              disabled={!name}
              onClick={() => onComplete({ name, role, onboarded: true })}
              className={`w-full py-5 rounded-[28px] font-bold text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${name ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
            >
              <CheckCircle2 size={24} />
              Let's Begin
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SocialButton = ({ onClick, icon, label, loading, className }: { onClick: () => void, icon: React.ReactNode, label: string, loading: boolean, className?: string }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className={`w-full py-5 px-6 glass rounded-[24px] flex items-center gap-4 hover:bg-white/10 active:scale-95 transition-all border border-white/5 font-bold text-sm ${className}`}
  >
    {loading ? <Loader2 className="animate-spin text-blue-400 mx-auto" /> : (
      <>
        <div className="w-8 flex justify-center">{icon}</div>
        <span className="flex-1 text-left">{label}</span>
      </>
    )}
  </button>
);

export default Onboarding;
