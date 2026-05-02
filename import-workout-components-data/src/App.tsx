import React, { useState } from 'react';
import { clientPrograms, trainingSchedules } from './AriLogic';
import { motion } from 'framer-motion'; // If you are using animations
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from "recharts";
import {
  copy,
  ariKnowledgeBase,
  getAriResponse,
  clientPrograms,
  trainingSchedules,
  languageNames,
  healthData
} from './AriLogic';
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
  Share2,
  Mic,
  Scale,
  ShieldCheck
} from "lucide-react";
import { AriVoiceAssistant } from './components/AriVoiceAssistant';

type Language = "en" | "es";
const App = () => {
  // This tells the app which program to show first (the Beginner one)
  const [activeProgramId, setActiveProgramId] = useState("1");
  
  // This finds the full data for the selected program
  const activeProgram = clientPrograms.find(p => p.id === activeProgramId) || clientPrograms[0];

  // These keep track of the user's settings
  const [trainingFrequency, setTrainingFrequency] = useState(activeProgram?.days || 3);
  const [planVariant, setPlanVariant] = useState(activeProgram?.planVariant || 'beginner');
  const [lang, setLang] = useState<Language>("en");
  const t = copy[lang as keyof typeof copy] || copy.en;
  const [isPro, setIsPro] = useState(false);
  const [planVariant, setPlanVariant] = useState<PlanVariant>("intermediate");
  const [trainingFrequency, setTrainingFrequency] = useState<TrainingFrequency>(5);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [activeProgramId, setActiveProgramId] = useState(clientPrograms[1].id);
  
  // Reference knowledge base for Ari's responses (used in getAriResponse)
  const _knowledge = ariKnowledgeBase;
  void _knowledge;
  
  void isPro;
  void setIsPro;
  void notifEnabled;
  void setNotifEnabled;
  void activeChallengeId;
  void setActiveChallengeId;
  void activeProgramId;
  
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const displayedWorkouts = trainingSchedules[trainingFrequency];
  const activeProgram = clientPrograms.find((program) => program.id === activeProgramId) ?? clientPrograms[1];

  useEffect(() => {
    setSelectedDayIndex((current) => Math.min(current, displayedWorkouts.length - 1));
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
    const day = workouts[selectedDayIndex];
    if (!day) return;
    day.exercises.forEach((ex) => ensureTracking(selectedDayIndex, ex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayIndex]);

  const updateSetEntry = (dayIndex: number, exName: string, setIndex: number, patch: Partial<SetEntry>) => {
    const key = exerciseKey(dayIndex, exName);
    setTracking((prev) => {
      const existing = prev[key] ?? [];
      const next = existing.map((s, i) => (i === setIndex ? { ...s, ...patch } : s));
      return { ...prev, [key]: next };
    });
  };
  void updateSetEntry;

  // Community data types (used for challenge/forum structure)
  const _sampleChallenge: Challenge = {
    id: "c1",
    title: "8-Week Glute Streak",
    description: "Complete all 3 glute sessions weekly",
    hashtag: "#GluteSyncStreak",
    durationDays: 56,
  };
  const _samplePost: ForumPost = {
    id: "p1",
    author: "Ari (Coach)",
    title: "Welcome!",
    body: "Share your goals!",
    createdAt: "Today",
    tags: ["intro"],
  };
  void _sampleChallenge;
  void _samplePost;

  return (
    <div className="min-h-screen bg-[#050a08] text-gray-100 font-sans selection:bg-sky-500/30">
      {/* Hero with Gym Background - high-contrast sky theme */}
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=90&w=2400"
          >
            <source
              src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        {/* Softer overlay for cleaner readability without extra brightness */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/82 via-black/58 to-black/12" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(100,116,139,0.08)_0%,rgba(0,0,0,0)_60%)]" />
        
        {/* Navigation */}
        <nav className="relative z-50 w-full bg-black/78 backdrop-blur-xl border-b border-slate-300/15">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shadow-[0_0_16px_rgba(148,163,184,0.24)]">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="font-black tracking-tighter text-2xl italic text-slate-50 uppercase">GLUTE<span className="text-sky-200">SYNC</span></span>
            </div>
            <div className="flex items-center gap-4">
              <select 
                className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 ring-pink-500/50 text-white transition-all hover:bg-white/20"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code} className="bg-[#111]">{name}</option>
                ))}
              </select>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative flex-grow flex items-center justify-center pt-24 pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center relative z-20 px-4">
            <div className="mx-auto max-w-4xl rounded-[3rem] border border-slate-200/10 bg-black/58 px-6 py-10 md:px-10 md:py-12 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-none">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-100 to-sky-100 text-slate-900 px-6 py-2 rounded-full text-xs font-black tracking-[0.2em] mb-8 shadow-[0_0_18px_rgba(148,163,184,0.18)] uppercase"
             >
               <Sparkles className="w-4 h-4" /> {t.heroLead}
             </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-8xl md:text-[11rem] font-black tracking-tighter mb-6 leading-[0.78] italic uppercase drop-shadow-[0_10px_22px_rgba(0,0,0,0.8)]"
            >
              <span
                className="block text-slate-50"
                style={{ WebkitTextStroke: "0.8px rgba(15,23,42,0.55)" }}
              >
                GLUTE
              </span>
              <span
                className="block text-sky-200 drop-shadow-[0_0_14px_rgba(125,211,252,0.28)]"
                style={{ WebkitTextStroke: "0.8px rgba(15,23,42,0.55)" }}
              >
                SYNC
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl text-slate-100 mb-12 max-w-2xl mx-auto leading-tight font-black drop-shadow-[0_5px_14px_rgba(0,0,0,0.75)] border-l-4 border-slate-300/50 pl-8 text-left bg-black/62 py-5 rounded-r-3xl"
            >
              {t.heroText}
            </motion.p>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-col sm:flex-row items-center justify-center gap-8"
             >
                 <button className="w-full sm:w-auto px-14 py-7 bg-gradient-to-r from-sky-300 to-slate-100 hover:from-sky-200 hover:to-white text-slate-950 font-black rounded-full transition-all shadow-[0_0_34px_rgba(148,163,184,0.2)] hover:shadow-[0_0_48px_rgba(125,211,252,0.22)] hover:-translate-y-1 flex items-center justify-center gap-3 group text-2xl uppercase tracking-widest">
                 {t.cta1} <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
               </button>
                 <button className="w-full sm:w-auto px-14 py-7 bg-black/32 backdrop-blur-xl hover:bg-slate-200/10 text-slate-50 font-black rounded-full transition-all border-4 border-slate-200/30 hover:border-slate-100 text-2xl uppercase tracking-widest shadow-[0_0_26px_rgba(148,163,184,0.12)]">
                 {t.cta2}
               </button>
             </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-24 flex flex-wrap justify-center gap-6"
              >
                {[
                  { label: "Members", value: "50K+", icon: "👥" },
                  { label: "Success", value: "87%", icon: "⚡" },
                  { label: "AI Support", value: "24/7", icon: "🧠" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-200/8 border-2 border-slate-200/15 p-8 rounded-[40px] backdrop-blur-xl group hover:bg-slate-100/10 transition-all duration-300 cursor-default min-w-[200px]">
                    <div className="text-4xl font-black text-sky-200 group-hover:text-white mb-1">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-200/75 group-hover:text-white/80 font-black">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Morning Activation Routine with Qigong */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1a1a2e] to-[#252542]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 text-orange-400 mb-4 font-bold tracking-widest text-sm uppercase">
                <Coffee className="w-5 h-5" /> Ancient Wisdom Meets Modern Science
              </div>
              <h2 className="text-4xl font-bold mb-6">20-Min Morning Activation with Qigong</h2>
              
              {/* Qigong Explanation */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
                <h3 className="text-xl font-bold mb-3 text-purple-300">What is Qigong?</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  <span className="text-purple-400 font-semibold">Qigong</span> (pronounced "chee-gong") is an ancient practice rooted in Traditional Chinese Medicine (TCM) and Taoist philosophy, designed to promote the flow of <span className="text-purple-400 font-semibold">qi</span>, or life energy, throughout the body.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  It integrates physical postures, slow fluid movements, breath control, and focused mental attention to improve overall health and longevity. Qigong is often practiced for stress relief, flexibility, balance, and spiritual development.
                </p>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed">
                Before you check your phone, wake up your central nervous system. This isn't cardio; it's a software update for your muscles to ensure maximum recruitment during your lifting sessions.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Qigong Breathing & Stance", time: "5 Min", desc: "Reset cortisol levels and ground your qi energy." },
                  { title: "Dynamic Mobility Flow", time: "10 Min", desc: "Unlock hips and spine with fluid movements." },
                  { title: "Central Excitation", time: "5 Min", desc: "Rapid light movements to fire up CNS." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-orange-500/30 text-orange-400 rounded-xl flex items-center justify-center font-bold shrink-0">
                      {i+1}
                    </div>
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        {item.title} <span className="text-xs text-orange-500/60">— {item.time}</span>
                      </h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-sky-500/30 to-orange-500/30 p-1 rounded-3xl">
              <div className="bg-[#1a1a2e] p-8 rounded-[1.4rem] border border-white/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" /> Why This Matters
                </h3>
                <ul className="space-y-4">
                  {[
                    "Enhanced neural drive for heavier lifts",
                    "Better mind-muscle connection (MMC)",
                    "Lower injury risk via improved proprioception",
                    "Regulated autonomic nervous system",
                    "Ancient wisdom meets modern science",
                    "Stress relief and mental clarity from Qigong practice"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fasting Section - NEW */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#252542] to-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-purple-500/20"
            >
              <Moon className="w-4 h-4" /> Metabolic Optimization
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Intermittent Fasting Protocol 🌙</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Fast 3 days per week with a 16:8 window to supercharge your results. This isn't about restriction—it's about transformation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Why Fast */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                Why Fasting Matters
              </h3>
              <div className="space-y-4">
                {[
                  "Improved insulin sensitivity for better nutrient partitioning into muscle",
                  "Enhanced fat oxidation while preserving lean muscle mass",
                  "Cellular repair through autophagy - your body's cleanup process",
                  "Reduced inflammation and oxidative stress for faster recovery",
                  "Mental clarity and focus - many report better workout mindsets",
                  "Better hormonal balance for optimal muscle growth"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fasting Schedule */}
            <div className="bg-gradient-to-br from-sky-500/10 to-cyan-500/10 rounded-3xl p-8 border border-sky-500/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Your 3-Day Weekly Schedule
              </h3>
              
              <div className="mb-6 p-6 bg-black/30 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Fasting Days</span>
                  <span className="text-lg font-bold text-sky-400">Mon • Wed • Fri</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Fasting Window</span>
                  <span className="text-lg font-bold text-sky-400">16:8 Protocol</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Eating Window</span>
                  <span className="text-lg font-bold text-sky-400">12 PM - 8 PM</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Break your fast with protein and healthy fats",
                  "Stay hydrated with water, herbal tea, or black coffee",
                  "Light movement during fasting window (walking, stretching)",
                  "Listen to your body - adjust if you feel weak",
                  "Avoid intense workouts during fasting hours"
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-6 h-6 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i+1}
                    </div>
                    <span className="text-sm text-gray-300">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6 text-center">Daily Fasting Timeline</h3>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-sky-500" />
              <div className="space-y-8">
                {[
                  { time: "8:00 PM", day: "Day 1", event: "Last meal - eating window closes", icon: <Moon className="w-5 h-5" />, circleClass: "from-sky-500 to-sky-600" },
                  { time: "12:00 AM", day: "Midnight", event: "Deep fasting phase - autophagy begins", icon: <Brain className="w-5 h-5" />, circleClass: "from-pink-500 to-pink-600" },
                  { time: "7:00 AM", day: "Morning", event: "Morning activation routine (fasted)", icon: <Sun className="w-5 h-5" />, circleClass: "from-orange-500 to-orange-600" },
                  { time: "12:00 PM", day: "Noon", event: "Break fast with protein + healthy fats", icon: <CheckCircle2 className="w-5 h-5" />, circleClass: "from-cyan-500 to-cyan-600" },
                  { time: "8:00 PM", day: "Evening", event: "Eating window closes again", icon: <Moon className="w-5 h-5" />, circleClass: "from-sky-500 to-sky-600" },
                ].map((item, i) => (
                  <div key={i} className={`relative flex items-center gap-6 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className="text-2xl font-bold text-white">{item.time}</div>
                      <div className="text-sm text-gray-500">{item.day}</div>
                      <div className="text-gray-300 mt-1">{item.event}</div>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.circleClass} rounded-full flex items-center justify-center text-white shrink-0 z-10`}>
                      {item.icon}
                    </div>
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Ecosystem & Platform Compatibility Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#252542]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.syncTitle}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t.syncText}</p>
            <div className="flex justify-center gap-8 mt-8 opacity-60">
              <div className="flex flex-col items-center gap-2">
                <Apple className="w-10 h-10" />
                <span className="text-xs">Health</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Smartphone className="w-10 h-10" />
                <span className="text-xs">Samsung</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Activity className="w-10 h-10" />
                <span className="text-xs">Google Fit</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-sky-500" /> Glute Training Volume
                  </h3>
                  <p className="text-sm text-gray-500">Weekly progressive overload tracker</p>
                </div>
                <div className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-xs font-bold">
                  +12.5% this week
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthData}>
                    <defs>
                      <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px'}}
                      itemStyle={{color: '#0ea5e9'}}
                    />
                    <Area type="monotone" dataKey="gluteVolume" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Resting Heart Rate</div>
                    <div className="text-2xl font-bold">64 <span className="text-sm font-normal text-gray-500">BPM</span></div>
                  </div>
                </div>
                <div className="h-12 flex items-end gap-1">
                  {[40, 55, 45, 60, 50, 40, 45, 65, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-red-500/30 rounded-t-sm" style={{height: `${h}%`}} />
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Daily Activity</div>
                    <div className="text-2xl font-bold">9,420 <span className="text-sm font-normal text-gray-500">Steps</span></div>
                  </div>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[84%]" />
                </div>
                <div className="flex justify-between text-[10px] mt-2 text-gray-500 font-bold uppercase">
                  <span>Target: 10k</span>
                  <span>84% Complete</span>
                </div>
              </div>

              <button className="w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl flex items-center justify-center gap-3 transition-all">
                <Share2 className="w-5 h-5 text-sky-400" />
                <span className="font-bold">Share to Health Apps</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Goal Paths */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-black mb-4">Programs for Every Goal and Schedule</h2>
            <p className="text-gray-400 max-w-3xl leading-relaxed">
              Pick the path that matches your time, energy, and outcome. Each option is built to give clients more control over their week while keeping the same clear training standard.
            </p>
          </div>
          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 px-5 py-4">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400 mb-1">Selected path</div>
            <div className="text-xl font-black text-white">{activeProgram.title}</div>
            <div className="text-sm text-gray-300">{activeProgram.timeBudget}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-6">
          <div className="grid md:grid-cols-2 gap-5">
            {clientPrograms.map((program) => {
              const isActive = program.id === activeProgramId;

              return (
                <motion.button
                  key={program.id}
                  type="button"
                  onClick={() => {
                    setActiveProgramId(program.id);
                    setTrainingFrequency(program.days);
                    setPlanVariant(program.planVariant);
                  }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`text-left rounded-[2rem] border p-6 transition-all ${
                    isActive
                      ? "bg-sky-500/15 border-sky-400 shadow-[0_0_40px_rgba(14,165,233,0.18)]"
                      : "bg-white/5 border-white/10 hover:border-sky-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400 mb-2">
                        {program.days}-day path
                      </div>
                      <h3 className="text-2xl font-black mb-2 text-white">{program.title}</h3>
                    </div>
                    <div className="rounded-full border border-sky-500/20 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-400">
                      {program.timeBudget}
                  
</div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{program.goal}</p>
                </motion.button>
              );
            })}
          </div>
          
          {/* This is a placeholder for your right column if you have one, or just close the grid */}
          <div className="bg-white/5 rounded-[2rem] border border-white/10 p-8">
             <h4 className="text-lg font-black mb-2">Plan Details</h4>
             <p className="text-sm text-gray-400">{activeProgram.outcome}</p>
          </div>
        </div>
      </section>
    </div> // Closes the main container
  );
};

export default App;
