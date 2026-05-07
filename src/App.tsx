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
  // Use your existing local storage hooks
  const [lang, setLang] = useLocalStorage<Lang>("glutesync_lang", "en");
  const [activeId, setActiveId] = useLocalStorage("glutesync_active_id", clientPrograms[0].id);
  const [completed, setCompleted] = useLocalStorage<string[]>("glutesync_completed", []);
  const [totalWorkouts, setTotalWorkouts] = useLocalStorage("glutesync_total_stats", 0);
  const [streak, setStreak] = useLocalStorage("glutesync_streak", 0);
  const [lastDate, setLastDate] = useLocalStorage<string | null>("glutesync_last_date", null);

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
      <div className="fixed inset-0 z-0"><div className="absolute inset-0 bg-black/60 z-10" /><video className="w-full h-full object-cover opacity-30" autoPlay loop muted playsInline src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" /></div>
      <main className="relative z-50 min-h-screen flex flex-col">
        <nav className="p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-[100]">
          <div className="flex items-center gap-2"><Zap className="text-sky-400" /><span className="text-2xl font-black italic uppercase">GLUTE<span className="text-sky-400">SYNC</span></span></div>
          <div className="flex gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-xs font-black uppercase text-white/40">{lang === 'en' ? 'ES' : 'EN'}</button>
            {showWorkouts && <button onClick={() => setShowWorkouts(false)} className="text-sky-400 font-black uppercase text-sm">Back</button>}
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {!showWorkouts ? (
            <motion.section key="home" className="flex-grow flex flex-col items-center justify-center text-center px-6">
              <StatsBadge totalWorkouts={totalWorkouts} streak={streak} />
              <h1 className="text-7xl font-black italic uppercase mb-4">{activeProgram.title}</h1>
              <button onClick={() => setShowWorkouts(true)} className="px-12 py-6 bg-sky-400 text-black font-black rounded-full uppercase italic">{t.cta1}</button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 w-full max-w-4xl">
                {clientPrograms.map(p => (
                  <button key={p.id} onClick={() => setActiveId(p.id)} className={`p-6 rounded-3xl border-2 ${activeId === p.id ? "border-sky-400 bg-sky-400/10" : "border-white/10"}`}>
                    <div className="text-2xl font-black italic uppercase">{p.title}</div>
                  </button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section key="workouts" className="p-6 max-w-4xl mx-auto w-full pb-32">
              <h2 className="text-5xl font-black uppercase italic mb-10">{activeProgram.title}</h2>
              <div className="space-y-4">
                {workoutList.map((ex: any, i: number) => {
                  const exerciseKey = `${activeId}-${ex.name}`;
                  const isDone = completed.includes(exerciseKey);
                  const details = (ariKnowledgeBase.exercises as any)[ex.name];
                  return (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6">
                      <div className="flex justify-between items-center">
                        <div onClick={() => setExpandedEx(expandedEx === exerciseKey ? null : exerciseKey)} className="cursor-pointer">
                          <div className={`text-2xl font-black uppercase italic ${isDone ? 'text-gray-600 line-through' : ''}`}>{ex.name}</div>
                          <div className="text-sky-400 font-bold uppercase text-xs">{ex.sets} Sets</div>
                        </div>
                        <CheckCircle2 onClick={() => toggleExercise(exerciseKey, ex.name)} className={isDone ? "text-sky-400" : "text-white/10"} size={32} />
                      </div>
                      {expandedEx === exerciseKey && details && (
                        <div className="mt-4 pt-4 border-t border-white/5 text-sm text-gray-400">{details.form}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
export default App;
