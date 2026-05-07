import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ArrowLeft, CheckCircle2, Info, Clock, Trophy, Flame } from "lucide-react";
import { copy, clientPrograms, trainingSchedules, ariKnowledgeBase } from './AriLogic';
import { useLocalStorage } from "./useLocalStorage";

const App = () => {
  const [lang, setLang] = useLocalStorage<"en" | "es">("glutesync_lang", "en");
  const [activeId, setActiveId] = useLocalStorage("glutesync_active_id", clientPrograms[0].id);
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [completed, setCompleted] = useLocalStorage<string[]>("glutesync_completed", []);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- NEW LOGIC EXPANSION STATES ---
  const [totalWorkouts, setTotalWorkouts] = useLocalStorage("glutesync_total_stats", 0);
  const [streak, setStreak] = useLocalStorage("glutesync_streak", 0);
  const [lastDate, setLastDate] = useLocalStorage<string | null>("glutesync_last_date", null);

  // 1. Define Voice function
  const speakCoaching = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "es" ? "es-MX" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // 2. Timer logic
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      speakCoaching(lang === "en" ? "Rest over. Get back to work!" : "Descanso terminado. ¡A darle!");
      setTimeLeft(null);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, lang]);

  const activeProgram = clientPrograms.find(p => p.id === activeId) || clientPrograms[0];
  const currentSchedule = (trainingSchedules as any)[activeProgram.planVariant];
  const workoutList = currentSchedule?.workouts || [];

  // 3. Updated Toggle function with Progress Tracking
  const toggleExercise = (exerciseKey: string, name: string) => {
    const isNowCompleted = !completed.includes(exerciseKey);
    const newCompleted = isNowCompleted
      ? [...completed, exerciseKey]
      : completed.filter(id => id !== exerciseKey);

    setCompleted(newCompleted);

    if (isNowCompleted) {
      const allExerciseKeys = workoutList.map((ex: any) => `${activeId}-${ex.name}`);
      const isWorkoutFinished = allExerciseKeys.every(key => newCompleted.includes(key));

      if (isWorkoutFinished) {
        setTimeLeft(null);
        setShowSuccess(true);

        // --- STATS UPDATE LOGIC ---
        const today = new Date().toDateString();
        setTotalWorkouts(prev => prev + 1);

        if (lastDate !== today) {
          setStreak(prev => prev + 1);
          setLastDate(today);
        }

        // --- DYNAMIC COACHING ---
        let speech = "";
        const nextTotal = totalWorkouts + 1;

        if (nextTotal === 1) {
          speech = lang === "en" ? "First workout down! The journey starts now." : "¡Primer entrenamiento listo! El viaje comienza ahora.";
        } else if (nextTotal % 5 === 0) {
          speech = lang === "en" ? `That's ${nextTotal} workouts! Your consistency is unmatched.` : `¡Ya son ${nextTotal} entrenamientos! Tu consistencia no tiene rival.`;
        } else {
          speech = lang === "en" ? "Workout complete! You're building the body you want." : "¡Entrenamiento completado! Estás construyendo el cuerpo que quieres.";
        }
        speakCoaching(speech);

      } else {
        speakCoaching(lang === "en" ? `Great job on the ${name}!` : `¡Buen trabajo con ${name}!`);
        setTimeLeft(60);
      }
    } else {
      setTimeLeft(null);
    }
  };

  const t = copy[lang] || copy.en;

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <video className="w-full h-full object-cover opacity-30" autoPlay loop muted playsInline src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <main className="relative z-50 min-h-screen flex flex-col">
        <nav className="p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-[100]">
          <div className="flex items-center gap-2">
            <Zap className="text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
            <span className="text-2xl font-black italic uppercase tracking-tighter">GLUTE<span className="text-sky-400">SYNC</span></span>
          </div>
          {showWorkouts && (
            <button onClick={() => setShowWorkouts(false)} className="flex items-center gap-2 text-sm font-black uppercase text-sky-400">
              <ArrowLeft size={16} /> {lang === 'en' ? 'Back' : 'Volver'}
            </button>
          )}
        </nav>

        <AnimatePresence mode="wait">
          {!showWorkouts ? (
            <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col items-center justify-center text-center px-6 py-12">

              {/* --- PROGRESS PEEK --- */}
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

              <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-4">{activeProgram.title}</h1>
              <p className="text-xl text-sky-400/80 font-bold uppercase tracking-widest mb-10">{activeProgram.goal}</p>

              <button onClick={() => setShowWorkouts(true)} className="px-12 py-6 bg-sky-400 text-black font-black rounded-full uppercase italic flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                {t.cta1} <ChevronRight />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 max-w-4xl w-full">
                {clientPrograms.map((p) => (
                  <button key={p.id} onClick={() => setActiveId(p.id)} className={`p-6 rounded-3xl border-2 transition-all duration-300 ${activeId === p.id ? "bg-sky-500/20 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]" : "bg-white/5 border-white/10"}`}>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-1">{p.days} Days</div>
                    <div className="text-2xl font-black uppercase italic tracking-tighter">{p.title}</div>
                  </button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section key="workouts" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-6 md:p-12 max-w-4xl mx-auto w-full pb-32">
              <h2 className="text-5xl font-black uppercase italic mb-2 tracking-tighter">{activeProgram.title}</h2>
              <p className="text-sky-400 font-bold uppercase tracking-widest text-xs mb-10">{currentSchedule?.title}</p>

              <div className="space-y-4">
                {workoutList.map((ex: any, i: number) => {
                  const exerciseKey = `${activeId}-${ex.name}`;
                  const isDone = completed.includes(exerciseKey);
                  const isExpanded = expandedEx === exerciseKey;
                  const details = (ariKnowledgeBase.exercises as any)[ex.name];

                  return (
                    <div key={i} className={`group rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-sky-950/20 border-sky-400/50' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => setExpandedEx(isExpanded ? null : exerciseKey)}>
                        <div className="flex-grow">
                          <div className={`font-black text-2xl uppercase italic tracking-tighter transition-all ${isDone ? 'text-gray-600 line-through' : 'text-white'}`}>
                            {ex.name}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sky-400 text-xs font-black uppercase tracking-widest">{ex.sets} Sets</span>
                            {!isDone && <Info size={14} className="text-white/20 group-hover:text-sky-400 transition-colors" />}
                          </div>
                        </div>
                        <CheckCircle2
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExercise(exerciseKey, ex.name);
                          }}
                          className={`transition-all duration-500 ${isDone ? "text-sky-400 scale-125 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" : "text-white/10 hover:text-white/30"}`}
                          size={32}
                        />
                      </div>

                      <AnimatePresence>
                        {isExpanded && details && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5">
                            <div className="p-6 bg-black/40 space-y-4">
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-2">Ari's Form Cue</div>
                                <p className="text-sm text-gray-300 leading-relaxed font-medium">{details.form}</p>
                              </div>
                              {details.commonMistakes && (
                                <div className="mt-4">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">
                                    Watch Out
                                  </div>
                                  <ul className="space-y-2">
                                    {details.commonMistakes.map((mistake: string, idx: number) => (
                                      <li key={idx} className="text-sm text-gray-400 flex gap-2">
                                        <span className="text-red-400">•</span> {mistake}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* --- TIMER OVERLAY --- */}
        <AnimatePresence>
          {timeLeft !== null && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-0 left-0 right-0 p-6 z-[200] bg-gradient-to-t from-black via-black to-transparent"
            >
              <div className="max-w-4xl mx-auto bg-sky-400 text-black p-4 rounded-3xl flex items-center justify-between shadow-[0_-10px_30px_rgba(56,189,248,0.3)]">
                <div className="flex items-center gap-4 px-4">
                  <Clock className="animate-pulse" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Rest Timer</div>
                    <div className="text-2xl font-black italic tracking-tighter">{timeLeft}s</div>
                  </div>
                </div>
                <button
                  onClick={() => setTimeLeft(null)}
                  className="bg-black text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SUCCESS OVERLAY --- */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-sky-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(56,189,248,0.5)]"
              >
                <Trophy size={48} className="text-black" />
              </motion.div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Workout Done!</h2>
              <p className="text-sky-400 font-bold uppercase tracking-widest mb-12">Building that body, one rep at a time.</p>
              <button
                onClick={() => { setShowSuccess(false); setShowWorkouts(false); setCompleted([]); }}
                className="px-12 py-6 bg-white text-black font-black rounded-full uppercase italic hover:scale-105 transition-all"
              >
                Go Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
