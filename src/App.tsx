import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { copy, clientPrograms, trainingSchedules } from './AriLogic';
import { useLocalStorage } from "./useLocalStorage"; 

const App = () => {
  const [lang, setLang] = useLocalStorage<"en" | "es">("glutesync_lang", "en");
  const [activeId, setActiveId] = useLocalStorage("glutesync_active_id", clientPrograms[0].id);
  const [showWorkouts, setShowWorkouts] = useState(false); 
  const [completed, setCompleted] = useLocalStorage<string[]>("glutesync_completed", []);

  // --- NEW CODE: 1. The Voice Function ---
  // This tells the browser how to speak (Ari's voice)
  const speakCoaching = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "es" ? "es-MX" : "en-US";
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
  };

  // --- NEW CODE: 2. The Updated Toggle Logic ---
  // This saves the checkmark AND triggers the voice
  const toggleExercise = (exerciseKey: string, exerciseName: string) => {
    const isNowCompleted = !completed.includes(exerciseKey);
    
    setCompleted(prev => 
      isNowCompleted ? [...prev, exerciseKey] : prev.filter(id => id !== exerciseKey)
    );

    if (isNowCompleted) {
      const message = lang === "en" 
        ? `Great job on the ${exerciseName}!` 
        : `¡Buen trabajo con ${exerciseName}!`;
      speakCoaching(message);
    }
  };

  const t = copy[lang] || copy.en;
  const activeProgram = clientPrograms.find(p => p.id === activeId) || clientPrograms[0];
  const workoutData = trainingSchedules[activeProgram.days] || [];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video className="w-full h-full object-cover opacity-30" autoPlay loop muted playsInline src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <main className="relative z-50 min-h-screen flex flex-col">
        <nav className="p-6 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Zap className="text-sky-400" />
            <span className="text-2xl font-black italic uppercase">GLUTE<span className="text-sky-400">SYNC</span></span>
          </div>
          {showWorkouts && (
            <button onClick={() => setShowWorkouts(false)} className="flex items-center gap-2 text-sm font-bold uppercase text-sky-400">
              <ArrowLeft size={16} /> Back
            </button>
          )}
        </nav>

        <AnimatePresence mode="wait">
          {!showWorkouts ? (
            /* HOME SCREEN */
            <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col items-center justify-center text-center px-6">
              <motion.h1 key={activeId} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-7xl md:text-9xl font-black italic uppercase">
                {activeProgram.title}
              </motion.h1>
              <p className="text-xl text-gray-400 font-bold mt-4">{activeProgram.goal}</p>
              
              <button onClick={() => setShowWorkouts(true)} className="mt-10 px-10 py-5 bg-sky-400 text-black font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                {t.cta1} <ChevronRight />
              </button>

              <div className="grid md:grid-cols-3 gap-4 mt-20 max-w-4xl w-full">
                {clientPrograms.map((p) => (
                  <button key={p.id} onClick={() => setActiveId(p.id)} className={`p-6 rounded-2xl border-2 transition-all ${activeId === p.id ? "bg-sky-500/20 border-sky-400" : "bg-white/5 border-white/10"}`}>
                    <div className="text-xs font-bold uppercase text-sky-400">{p.days} Days</div>
                    <div className="font-black uppercase italic">{p.title}</div>
                  </button>
                ))}
              </div>
            </motion.section>
          ) : (
            /* WORKOUT SCREEN */
            <motion.section key="workouts" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-6 md:p-12 max-w-4xl mx-auto w-full">
              <h2 className="text-4xl font-black uppercase italic mb-8">Your {activeProgram.days}-Day Routine</h2>
              <div className="space-y-6">
                {workoutData.map((day, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-sky-400/50 transition-colors">
                    <h3 className="text-2xl font-black text-sky-300 uppercase italic mb-4">{day.title || `Day ${idx + 1}`}</h3>
                    <div className="space-y-4">
                      {day.exercises?.map((ex, exIdx) => {
                        const exerciseKey = `${activeId}-${day.title}-${ex.name}`;
                        const isCompleted = completed.includes(exerciseKey);

                        return (
                          <div key={exIdx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                            <div>
                              <div className={`font-bold text-lg ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                                {ex.name}
                              </div>
                              <div className="text-sm text-gray-400">{ex.sets} Sets</div>
                            </div>
                            {/* --- 3. The Click Trigger --- */}
                            <CheckCircle2 
                              onClick={() => toggleExercise(exerciseKey, ex.name)}
                              className={`cursor-pointer transition-all ${isCompleted ? "text-sky-400 scale-110" : "text-white/20 hover:text-sky-400"}`} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
