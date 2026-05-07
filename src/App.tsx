import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ChevronRight, ArrowLeft, CheckCircle2,
  Clock, Trophy, Flame, MessageCircle, X, Send, Loader2, Sparkles, Info
} from "lucide-react";
import { copy, clientPrograms, trainingSchedules, ariKnowledgeBase } from "./AriLogic";
import { useLocalStorage } from "./useLocalStorage"; 

// --- TYPES ---
type Lang = "en" | "es";
interface ChatMessage { role: "user" | "assistant"; content: string; }

// --- SUB-COMPONENTS ---
function StatsBadge({ totalWorkouts, streak }: { totalWorkouts: number; streak: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex gap-4 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Trophy size={14} className="text-sky-400" />
        <span className="text-[10px] font-black uppercase tracking-widest">{totalWorkouts} Workouts</span>
      </div>
      <div className="w-[1px] h-3 bg-white/20 self-center" />
      <div className="flex items-center gap-2">
        <Flame size={14} className="text-orange-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">{streak} Day Streak</span>
      </div>
    </motion.div>
  );
}

const App = () => {
  // Persistence Hooks
  const [lang, setLang] = useLocalStorage<Lang>("glutesync_lang", "en");
  const [activeId, setActiveId] = useLocalStorage("glutesync_active_id", clientPrograms[0].id);
  const [completed, setCompleted] = useLocalStorage<string[]>("glutesync_completed", []);
  const [totalWorkouts, setTotalWorkouts] = useLocalStorage("glutesync_total_stats", 0);
  const [streak, setStreak] = useLocalStorage("glutesync_streak", 0);
  const [lastDate, setLastDate] = useLocalStorage<string | null>("glutesync_last_date", null);

  // UI State
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // --- TIMER & VOICE ---
  const speakCoaching = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "es" ? "es-MX" : "en-US";
    window.speechSynthesis.speak(utterance);
  }, [lang]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      speakCoaching(lang === "en" ? "Rest over. Get back to work!" : "¡Descanso terminado!");
      setTimeLeft(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => (prev ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, lang, speakCoaching]);

  const activeProgram = clientPrograms.find(p => p.id === activeId) ?? clientPrograms[0];
  const currentSchedule = (trainingSchedules as any)[activeProgram.planVariant];
  const workoutList = currentSchedule?.workouts ?? [];

  const toggleExercise = (exerciseKey: string, name: string) => {
    const isNowCompleted = !completed.includes(exerciseKey);
    const newCompleted = isNowCompleted ? [...completed, exerciseKey] : completed.filter(id => id !== exerciseKey);
    setCompleted(newCompleted);

    if (isNowCompleted) {
      const allKeys = workoutList.map((ex: any) => `${activeId}-${ex.name}`);
      if (allKeys.every(k => newCompleted.includes(k))) {
        setShowSuccess(true);
        const today = new Date().toDateString();
        setTotalWorkouts(prev => prev + 1);
        if (lastDate !== today) { setStreak(prev => prev + 1); setLastDate(today); }
        speakCoaching(lang === 'en' ? "Workout complete!" : "¡Entrenamiento terminado!");
      } else {
        speakCoaching(lang === "en" ? `Great job on the ${name}!` : `¡Buen trabajo!`);
        setTimeLeft(60);
      }
    }
  };

  const t = (copy as any)[lang] ?? copy.en;

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video className="w-full h-full object-cover opacity-30" autoPlay loop muted playsInline src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" />
      </div>

      <main className="relative z-50 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-[100]">
          <div className="flex items-center gap-2">
            <Zap className="text-sky-400" />
            <span className="text-2xl font-black italic uppercase tracking-tighter">GLUTE<span className="text-sky-400">SYNC</span></span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-xs font-black uppercase text-white/40">
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
            {showWorkouts && (
              <button onClick={() => setShowWorkouts(false)} className="text-sky-400 font-black uppercase text-sm flex items-center gap-1">
                <ArrowLeft size={16} /> Back
              </button>
            )}
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {!showWorkouts ? (
            <motion.section key="home" className="flex-grow flex flex-col items-center justify-center text-center px-6 py-12">
              <StatsBadge totalWorkouts={totalWorkouts} streak={streak} />
              <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-4">{activeProgram.title}</h1>
              <p className="text-xl text-sky-400/80 font-bold uppercase tracking-widest mb-10">{activeProgram.goal}</p>
              <button onClick={() => setShowWorkouts(true)} className="px-12 py-6 bg-sky-400 text-black font-black rounded-full uppercase italic hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                {t.cta1} <ChevronRight />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 w-full max-w-4xl">
                {clientPrograms.map(p => (
                  <button key={p.id} onClick={() => setActiveId(p.id)} className={`p-6 rounded-3xl border-2 transition-all duration-300 ${activeId === p.id ? "bg-sky-400/20 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]" : "bg-white/5 border-white/10"}`}>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-1">{p.days} Days</div>
                    <div className="text-2xl font-black uppercase italic tracking-tighter">{p.title}</div>
                  </button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section key="workouts" className="p-6 md:p-12 max-w-4xl mx-auto w-full pb-32">
              <h2 className="text-5xl font-black uppercase italic mb-2 tracking-tighter">{activeProgram.title}</h2>
              <div className="space-y-4">
                {workoutList.map((ex: any, i: number) => {
                  const exerciseKey = `${activeId}-${ex.name}`;
                  const isDone = completed.includes(exerciseKey);
                  const isExpanded = expandedEx === exerciseKey;
                  const details = (ariKnowledgeBase.exercises as any)[ex.name];

                  return (
                    <div key={i} className={`bg-white/5 border transition-all duration-300 rounded-3xl overflow-hidden ${isExpanded ? 'border-sky-400/50 bg-sky-950/20' : 'border-white/10'}`}>
                      <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => setExpandedEx(isExpanded ? null : exerciseKey)}>
                        <div>
                          <div className={`text-2xl font-black uppercase italic tracking-tighter ${isDone ? 'text-gray-600 line-through' : ''}`}>{ex.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-sky-400 font-bold uppercase text-xs">{ex.sets} Sets</span>
                             <Info size={14} className="text-white/20" />
                          </div>
                        </div>
                        <CheckCircle2 onClick={(e) => { e.stopPropagation(); toggleExercise(exerciseKey, ex.name); }} className={`transition-all ${isDone ? "text-sky-400 scale-110" : "text-white/10"}`} size={32} />
                      </div>
                      {isExpanded && details && (
                        <div className="p-6 pt-0 border-t border-white/5 text-sm text-gray-400">
                          <div className="text-sky-400 font-black uppercase text-[10px] mb-2">Ari's Cue</div>
                          {details.form}
                          <button onClick={() => setShowChat(true)} className="flex items-center gap-2 text-sky-400 font-black uppercase text-[10px] mt-4">
                            <MessageCircle size={12} /> Ask Ari more
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* --- FLOATING ELEMENTS --- */}
        <AnimatePresence>
          {!showChat && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setShowChat(true)} className="fixed bottom-8 right-6 z-[190] w-14 h-14 bg-sky-400 rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle size={22} className="text-black" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-2xl flex flex-col">
               <div className="flex justify-between p-6 border-b border-white/10 items-center">
                 <div className="flex items-center gap-2">
                   <Sparkles className="text-sky-400" />
                   <span className="font-black uppercase tracking-widest">Ari AI</span>
                 </div>
                 <X onClick={() => setShowChat(false)} className="cursor-pointer" />
               </div>
               <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
                 <Loader2 className="animate-spin text-sky-400 mb-4" size={40} />
                 <h2 className="text-2xl font-black uppercase italic">Ari is getting ready...</h2>
                 <p className="text-gray-500 text-sm mt-2">Connecting to my fitness brain. I'll be able to answer your technique questions soon!</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SUCCESS OVERLAY --- */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] bg-black/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl">
               <Trophy size={60} className="text-sky-400 mb-6" />
               <h2 className="text-6xl font-black italic uppercase tracking-tighter">Workout Done!</h2>
               <p className="text-sky-400 font-bold uppercase tracking-widest mb-10">You're one step closer to your goals.</p>
               <button onClick={() => { setShowSuccess(false); setShowWorkouts(false); setCompleted([]); }} className="px-12 py-6 bg-white text-black font-black rounded-full uppercase italic">Go Home</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- TIMER OVERLAY --- */}
        <AnimatePresence>
          {timeLeft !== null && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 p-6 z-[200]">
              <div className="max-w-4xl mx-auto bg-sky-400 text-black p-4 rounded-3xl flex justify-between items-center shadow-xl">
                <div className="flex items-center gap-4 px-4">
                  <Clock className="animate-pulse" />
                  <span className="text-2xl font-black italic">{timeLeft}s Rest</span>
                </div>
                <button onClick={() => setTimeLeft(null)} className="bg-black text-white px-6 py-2 rounded-full font-black uppercase text-xs">Skip</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
