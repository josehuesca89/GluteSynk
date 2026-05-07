import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ArrowLeft, CheckCircle2, Info, Clock } from "lucide-react";
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

  // 3. Updated Toggle function with Success Detection
  const toggleExercise = (exerciseKey: string, name: string) => {
    const isNowCompleted = !completed.includes(exerciseKey);
    
    // Calculate the updated completed list to check for workout finish
    const newCompleted = isNowCompleted 
      ? [...completed, exerciseKey] 
      : completed.filter(id => id !== exerciseKey);
    
    setCompleted(newCompleted);
    
    if (isNowCompleted) {
      // Check if all exercises in the current list are finished
      const allExerciseKeys = workoutList.map((ex: any) => `${activeId}-${ex.name}`);
      const isWorkoutFinished = allExerciseKeys.every(key => newCompleted.includes(key));

      if (isWorkoutFinished) {
        setTimeLeft(null); // Stop any active timer
        setShowSuccess(true);
        speakCoaching(lang === "en" 
          ? "Workout complete! Amazing job today. You are getting stronger every single day!" 
          : "¡Entrenamiento completado! Increíble trabajo hoy. ¡Te estás volviendo más fuerte cada día!");
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
      {/* Background Video */}
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
                                <div>
                                  <div className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Watch Out For</div>
                                  <ul className="text-sm text-gray-400 space-y-1 italic">
                                    {details.commonMistakes.map((m: string, idx: number) => (
                                      <li key={idx}>• {m}</li>
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

        {/* Floating Rest Timer */}
        <AnimatePresence>
          {timeLeft !== null && (
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
              <div className="bg-sky-500 text-black p-4 rounded-3xl shadow-[0_10px_30px_rgba(56,189,248,0.4)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-black/20 p-2 rounded-full animate-pulse">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest leading-none">Rest Period</div>
                    <div className="text-2xl font-black italic tracking-tighter leading-none">
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </div>
                  </div>
                </div>
                <button onClick={() => setTimeLeft(null)} className="bg-black text-white px-4 py-2 rounded-full text-xs font-black uppercase">
                  Skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUCCESS MODAL */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                className="bg-sky-500 text-black p-8 rounded-[40px] w-full max-w-sm text-center shadow-[0_20px_50px_rgba(56,189,248,0.5)]"
              >
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-sky-400" size={40} />
                </div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Crushed It!</h2>
                <p className="font-bold uppercase tracking-widest text-[10px] mb-8 opacity-80">{activeProgram.title} Complete</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/10 p-4 rounded-2xl">
                    <div className="text-2xl font-black italic">{workoutList.length}</div>
                    <div className="text-[10px] font-bold uppercase opacity-60">Exercises</div>
                  </div>
                  <div className="bg-black/10 p-4 rounded-2xl">
                    <div className="text-2xl font-black italic">100%</div>
                    <div className="text-[10px] font-bold uppercase opacity-60">Complete</div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowWorkouts(false);
                    setShowSuccess(false);
                    setCompleted([]); // Resets circles for the next session
                  }}
                  className="w-full py-4 bg-black text-white font-black rounded-full uppercase italic hover:scale-105 transition-all"
                >
                  Return to Home
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
