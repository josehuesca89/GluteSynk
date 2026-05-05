import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from "recharts";
import {
  Zap,
  Sparkles,
  ChevronRight,
  Coffee,
  Flame,
  CheckCircle2,
  Moon,
  Brain,
  Clock,
  Sun,
  Apple,
  Smartphone,
  Activity,
  Dumbbell,
  Heart,
  Share2
} from "lucide-react";

// The Local Files
import {
  copy,
  ariKnowledgeBase,
  clientPrograms,
  trainingSchedules,
  languageNames,
  healthData
} from './AriLogic';

// Types for your state
type Language = 'en' | 'es';
type PlanVariant = 'beginner' | 'intermediate' | 'advanced';
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
  // These keep track of the user's settings
  const [lang, setLang] = useState<Language>("en");
  const t = copy[lang as keyof typeof copy] || copy.en;
  const [activeProgramId, setActiveProgramId] = useState(clientPrograms[1].id); 
  const [trainingFrequency, setTrainingFrequency] = useState<TrainingFrequency>(5);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Reference knowledge base
  const _knowledge = ariKnowledgeBase;
  void _knowledge;
  
  // FIX: Using displayedWorkouts instead of 'workouts'
  const displayedWorkouts = trainingSchedules[trainingFrequency as keyof typeof trainingSchedules] || [];
  const activeProgram = clientPrograms.find((program) => program.id === activeProgramId) ?? clientPrograms[1];

  useEffect(() => {
    setSelectedDayIndex((current) => Math.min(current, Math.max(0, displayedWorkouts.length - 1)));
  }, [displayedWorkouts.length]);

  const workoutsKey = "glutesync.workouts.v1";

  const parseSets = (sets: string): number => {
    const n = Number.parseInt(sets, 10);
    return Number.isFinite(n) ? n : 3;
  };

  const makeDefaultSetEntries = (sets: string): SetEntry[] =>
    Array.from({ length: parseSets(sets) }).map(() => ({ reps: "", weight: "", rpe: "", done: false }));

  const [tracking, setTracking] = useState<Record<string, SetEntry[]>>(() => {
    try {
      const raw = localStorage.getItem(workoutsKey);
      return raw ? (JSON.parse(raw) as Record<string, SetEntry[]>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(workoutsKey, JSON.stringify(tracking));
    } catch {
      // ignore
    }
  }, [tracking]);

  const exerciseKey = (dayIndex: number, exerciseName: string) => `${dayIndex}::${exerciseName}`;

  const ensureTracking = useCallback(
    (dayIndex: number, ex: Exercise) => {
      const key = exerciseKey(dayIndex, ex.name);
      if (tracking[key]) return;
      setTracking((prev) => ({ ...prev, [key]: makeDefaultSetEntries(ex.sets) }));
    },
    [tracking]
  );

  useEffect(() => {
    // FIX: Use displayedWorkouts here
    const day = displayedWorkouts[selectedDayIndex];
    if (!day || !day.exercises) return;
    day.exercises.forEach((ex: Exercise) => ensureTracking(selectedDayIndex, ex));
  }, [selectedDayIndex, displayedWorkouts, ensureTracking]);

  return (
    <div className="min-h-screen bg-[#050a08] text-gray-100 font-sans selection:bg-sky-500/30">
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay loop muted playsInline preload="metadata"
            poster="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=90&w=2400"
          >
            <source src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        
        <nav className="relative z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="font-black tracking-tighter text-2xl italic text-white uppercase">GLUTE<span className="text-sky-300">SYNC</span></span>
            </div>
            <select 
              className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white"
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code} className="bg-black">{name}</option>
              ))}
            </select>
          </div>
        </nav>

        <section className="relative flex-grow flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center relative z-20">
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              <button className="px-10 py-5 bg-sky-300 text-black font-black rounded-full text-xl uppercase tracking-widest flex items-center gap-2 justify-center">
                {t.cta1} <ChevronRight />
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-12">Program Dashboard</h2>
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
                  activeProgramId === program.id ? "bg-sky-500/20 border-sky-400" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="text-sky-400 text-xs font-black uppercase mb-1">{program.days} Days</div>
                <h3 className="text-xl font-black text-white">{program.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{program.goal}</p>
              </button>
            ))}
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-black mb-4">Plan Outcome</h3>
            <p className="text-gray-400">{activeProgram.outcome}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
