import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ArrowLeft, CheckCircle2, Info } from "lucide-react";
import { copy, clientPrograms, trainingSchedules, ariKnowledgeBase } from './AriLogic';
import { useLocalStorage } from "./useLocalStorage"; 

const App = () => {
  const [lang, setLang] = useLocalStorage<"en" | "es">("glutesync_lang", "en");
  const [activeId, setActiveId] = useLocalStorage("glutesync_active_id", clientPrograms[0].id);
  const [showWorkouts, setShowWorkouts] = useState(false); 
  const [completed, setCompleted] = useLocalStorage<string[]>("glutesync_completed", []);
  
  // NEW: State to track which exercise card is expanded
  const [expandedEx, setExpandedEx] = useState<string | null>(null);

  const speakCoaching = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "es" ? "es-MX" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const toggleExercise = (exerciseKey: string, name: string) => {
    const isNowCompleted = !completed.includes(exerciseKey);
    setCompleted(prev => isNowCompleted ? [...prev, exerciseKey] : prev.filter(id => id !== exerciseKey));
    if (isNowCompleted) {
      speakCoaching(lang === "en" ? `Great job on the ${name}!` : `¡Buen trabajo con ${name}!`);
    }
  };

  const t = copy[lang] || copy.en;
  const activeProgram = clientPrograms.find(p => p.id === activeId) || clientPrograms[0];
  const currentSchedule = (trainingSchedules as any)[activeProgram.planVariant];
  const workoutList = currentSchedule?.workouts || [];

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
                {workoutList.length > 0 ? (
                  workoutList.map((ex: any, i: number) => {
                    const exerciseKey = `${activeId}-${ex.name}`;
                    const isDone = completed.includes(exerciseKey);
                    const isExpanded = expandedEx === exerciseKey;
                    const details = (ariKnowledgeBase.exercises as any)[ex.name];

                    return (
                      <div key={i} className={`group rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-sky-950/20 border-sky-400/50' : 'bg-white/5 border-white/10'}`}>
                        {/* Header Area */}
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
                              e.stopPropagation(); // Prevents opening the info card when just checking the box
                              toggleExercise(exerciseKey, ex.name);
                            }}
                            className={`transition-all duration-500 ${isDone ? "text-sky-400 scale-125 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" : "text-white/10 hover:text-white/30"}`} 
                            size={32}
                          />
                        </div>

                        {/* Expandable Form Cues */}
                        <AnimatePresence>
                          {isExpanded && details && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-white/5"
                            >
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
                  })
                ) : (
                  <p className="text-center text-gray-500 font-black uppercase tracking-widest py-20">No routine found.</p>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
