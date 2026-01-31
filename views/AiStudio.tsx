
import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  Image as ImageIcon, 
  Video, 
  Search, 
  MapPin, 
  BrainCircuit, 
  Send,
  Loader2,
  Camera,
  Play,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  searchGrounding, 
  mapsGrounding, 
  deepThink, 
  generateImage, 
  generateVideo, 
  analyzeImage, 
  textToSpeech 
} from '../geminiService';
import LiveAssistant from '../components/LiveAssistant';

const AiStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'chat' | 'creative' | 'live' | 'vision'>('chat');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeepSearch = async () => {
    setLoading(true);
    try {
      const res = await searchGrounding(prompt);
      setResult(res);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleMaps = async () => {
    setLoading(true);
    try {
      const res = await mapsGrounding(prompt);
      setResult(res);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleThinking = async () => {
    setLoading(true);
    try {
      const res = await deepThink(prompt);
      setResult({ text: res });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleImageGen = async () => {
    setLoading(true);
    try {
      const url = await generateImage(prompt, aspectRatio);
      setResult({ image: url });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // Fix: Restricted Veo video generation to supported aspect ratios (16:9 and 9:16) as per Gemini guidelines
  const handleVideoGen = async () => {
    if (aspectRatio !== "16:9" && aspectRatio !== "9:16") {
      alert("Veo video generation only supports 16:9 or 9:16 aspect ratios. Please select a supported ratio.");
      return;
    }
    setLoading(true);
    try {
      const url = await generateVideo(prompt, aspectRatio as any);
      setResult({ video: url });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setVisionImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVisionAnalysis = async () => {
    if (!visionImage) return;
    setLoading(true);
    try {
      const base64 = visionImage.split(',')[1];
      const mime = visionImage.split(';')[0].split(':')[1];
      const res = await analyzeImage(base64, mime, prompt || "Describe this image in detail.");
      setResult({ text: res });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // Fix: Implemented proper PCM audio decoding for Gemini TTS raw audio bytes as per guidelines
  const handleTTS = async (text: string) => {
    const base64 = await textToSpeech(text);
    if (base64) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const decodeBase64 = (b64: string) => {
        const binaryString = atob(b64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      };

      const pcmData = decodeBase64(base64);
      const dataInt16 = new Int16Array(pcmData.buffer);
      const audioBuffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <TabButton active={activeMode === 'chat'} onClick={() => setActiveMode('chat')} icon={<BrainCircuit size={18} />} label="Intelligence" />
        <TabButton active={activeMode === 'creative'} onClick={() => setActiveMode('creative')} icon={<ImageIcon size={18} />} label="Studio" />
        <TabButton active={activeMode === 'vision'} onClick={() => setActiveMode('vision')} icon={<Camera size={18} />} label="Vision" />
        <TabButton active={activeMode === 'live'} onClick={() => setActiveMode('live')} icon={<Mic size={18} />} label="Live" />
      </div>

      <AnimatePresence mode="wait">
        {activeMode === 'live' ? (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh]">
            <LiveAssistant />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            <div className="glass p-6 rounded-[32px] space-y-4">
              {activeMode === 'vision' && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors overflow-hidden relative"
                >
                  {visionImage ? (
                    <img src={visionImage} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera size={32} className="text-blue-400 mb-2" />
                      <p className="text-sm text-gray-500">Tap to upload image</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={onImageUpload} />
                </div>
              )}

              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeMode === 'creative' ? "Describe your creation..." : "Ask anything..."}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[100px] text-sm outline-none focus:border-blue-500/50"
              />

              <div className="flex flex-wrap gap-2">
                {activeMode === 'chat' && (
                  <>
                    <ActionButton onClick={handleDeepSearch} icon={<Search size={16} />} label="Google Search" color="bg-blue-600" />
                    <ActionButton onClick={handleMaps} icon={<MapPin size={16} />} label="Maps Search" color="bg-emerald-600" />
                    <ActionButton onClick={handleThinking} icon={<BrainCircuit size={16} />} label="Thinking Mode" color="bg-purple-600" />
                  </>
                )}
                {activeMode === 'creative' && (
                  <div className="w-full space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {["1:1", "16:9", "9:16", "3:4", "4:3"].map(r => (
                        <button 
                          key={r}
                          onClick={() => setAspectRatio(r)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${aspectRatio === r ? 'bg-blue-500 text-white' : 'glass text-gray-400'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <ActionButton onClick={handleImageGen} icon={<ImageIcon size={16} />} label="Generate Image" color="bg-blue-600" className="flex-1" />
                      <ActionButton onClick={handleVideoGen} icon={<Video size={16} />} label="Veo Video" color="bg-indigo-600" className="flex-1" />
                    </div>
                  </div>
                )}
                {activeMode === 'vision' && (
                  <ActionButton onClick={handleVisionAnalysis} icon={<Sparkles size={16} />} label="Analyze Image" color="bg-blue-600" className="w-full" />
                )}
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-sm text-blue-300 animate-pulse">Consulting the orbits of intelligence...</p>
              </div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-[32px] space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">Result</h4>
                  <div className="flex gap-2">
                    {result.text && <button onClick={() => handleTTS(result.text)} className="p-1 hover:text-blue-400"><Volume2 size={16} /></button>}
                    <button onClick={() => setResult(null)} className="text-gray-500 hover:text-white">✕</button>
                  </div>
                </div>
                
                {result.text && <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{result.text}</p>}
                
                {result.image && <img src={result.image} className="w-full rounded-2xl shadow-2xl" />}
                
                {result.video && (
                  <video src={result.video} controls className="w-full rounded-2xl shadow-2xl" autoPlay loop />
                )}

                {result.sources && result.sources.length > 0 && (
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((s: any, i: number) => (
                        <a key={i} href={s.web?.uri || s.maps?.uri} target="_blank" className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-blue-400 hover:underline">
                          {s.web?.title || s.maps?.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all flex-shrink-0 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'glass text-gray-400 hover:bg-white/10'}`}
  >
    {icon} {label}
  </button>
);

const ActionButton = ({ onClick, icon, label, color, className }: any) => (
  <button 
    onClick={onClick}
    className={`${color} ${className} flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold hover:brightness-110 transition-all`}
  >
    {icon} {label}
  </button>
);

export default AiStudio;