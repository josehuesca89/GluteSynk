import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  ChevronRight,
} from "lucide-react";

// The Local Files - Ensure these match your actual AriLogic.ts exports exactly
import {
  copy,
  ariKnowledgeBase,
  clientPrograms,
  trainingSchedules,
  languageNames,
} from './AriLogic';

// Types for your state
type Language = 'en' | 'es';
type TrainingFrequency = 2 | 3 | 4 | 5;

interface SetEntry {
  reps: string;
  weight: string;
  rpe: string;
  done: boolean;
}

interface Exercise {
  name: string;
  sets: string;
}

const App = () => {
  // 1. State Management
  const [lang, setLang] = useState<Language>("en");
  const t = copy[lang as keyof typeof copy] || copy.en;
  
  // Defaulting to the first available program
  const [activeProgramId, setActiveProgramId] = useState(clientPrograms[0]?.id || 1); 
  const [trainingFrequency, setTrainingFrequency] = useState<TrainingFrequency>(5);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Constants
  const workoutsKey = "glutesync.workouts.v1";
  const displayedWorkouts = trainingSchedules[trainingFrequency as keyof typeof trainingSchedules] || [];
  const activeProgram = clientPrograms.find((p) => p.id === activeProgramId) ?? clientPrograms[0];

  // 2. Logic & Storage
  const [tracking, setTracking] = useState<Record<string, SetEntry[]>>(() => {
    try {
      const raw = localStorage.getItem(workoutsKey);
      return raw ? (JSON.parse(raw) as Record<string, SetEntry[]>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(workoutsKey, JSON.stringify(tracking));
  }, [tracking]);

  const parseSets = (sets: string): number => {
    const n = parseInt(sets, 10);
    return isFinite(n) ? n : 3;
  };

  const makeDefaultSetEntries = (sets: string): SetEntry[] =>
    Array.from({ length: parseSets(sets) }).map(() => ({ reps: "", weight: "", rpe: "", done: false }));

  const ensureTracking = useCallback((dayIndex: number, ex: Exercise) => {
    const key = `${dayIndex}::${ex.name}`;
    if (!tracking[key]) {
      setTracking((prev) => ({ ...prev, [key]: makeDefaultSetEntries(ex.sets) }));
    }
  }, [tracking]);

  useEffect(() => {
    const day = displayedWorkouts[selectedDayIndex];
    if (day?.exercises) {
      day.exercises.forEach((ex: Exercise) => ensureTracking(selectedDayIndex, ex));
    }
  }, [selectedDayIndex, displayedWorkouts, ensureTracking]);

  return (
    <div className="min-h-screen bg-[#050a08] text-gray-100 font-sans selection:bg-sky-500/30">
      <div className="relative min-h-screen flex flex-col">
        
        {/* BACKGROUND LAYER (z-0) */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay loop muted playsInline preload="metadata"
            poster="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400"
          >
            <source src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" type="video/mp4" />
          </video>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>

        {/* INTERACTIVE UI LAYER (z-20+) */}
        <nav className="relative z-30 w-full bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="font-black tracking-tighter text-2xl italic text-white uppercase">
                GLUTE<span className="text-sky-300">SYNC</span>
              </span>
            </div>
            
            <select 
              className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white cursor-pointer"
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code} className="bg-black">
                  {name as string}
                </option>
              ))}
            </select>
          </div>
        </nav>

        <section className="relative z-20 flex-grow flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-black italic uppercase leading-none"
            >
              <span className="block text-white">GLUTE</span>
              <span className="block text-sky-300">SYNC</span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 mt-6 max-w-2xl mx-auto font-bold">
              {t.heroText}
            </p>
            <div className="mt-12">
              <button 
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                className="px-10 py-5 bg-sky-300 text-black font-black rounded-full text-xl uppercase tracking-widest flex items-center gap-2 justify-center hover:bg-white transition-all transform active:scale-95"
              >
                {t.cta1} <ChevronRight />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* DASHBOARD SECTION */}
      <section className="relative z-30 py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-12 uppercase italic">Program Dashboard</h2>
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
          <div className="grid md:grid-cols-2 gap-4">
            {clientPrograms.map((program) => (
              <button
                key={program.id}
                onClick={() => {
                  setActiveProgramId(program.id);
                  setTrainingFrequency(program.days as TrainingFrequency);
                }}
                className={`p-6 rounded-3xl border text-left transition-all ${
                  activeProgramId === program.id 
                    ? "bg-sky-500/20 border-sky-400 ring-2 ring-sky-400" 
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="text-sky-400 text-xs font-black uppercase mb-1">{program.days} Days</div>
                <h3 className="text-xl font-black text-white">{program.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{program.goal}</p>
              </button>
            ))}
          </div>
          
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 h-fit">
            <h3 className="text-xl font-black mb-4 uppercase text-sky-300">Plan Outcome</h3>
            <p className="text-gray-300 leading-relaxed">
              {activeProgram?.outcome || "Select a program to see details."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
