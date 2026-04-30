import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  copy, 
  ariKnowledgeBase, 
  getAriResponse, 
  type WorkoutDay, 
  type PlanVariant, 
  type TrainingFrequency, 
  type Exercise, 
  type SetEntry, 
  type GoalProgram, 
  type Challenge, 
  type ForumPost 
} from './AriLogic';
import {
  Dumbbell, 
  Apple, 
  Smartphone, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Coffee,
  Scale,
  Flame,
  Activity,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Waves,
  Sun,
  Moon,
  Clock,
  Brain
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// Ari Voice Assistant Component
type Language = "en" | "es";
const AriVoiceAssistant = ({ lang }: { lang: Language }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'user' | 'ari', text: string}>>([
    { type: 'ari', text: "Hey there! I'm Ari, your 24/7 AI trainer. I'm here to run the entire Glute Sync program alongside you. I can help with absolutely everything: training (exercise form, workout structure, home or gym options), nutrition (meal plans, all diet types, macros), fasting schedules, stretching routines, morning Qigong activation, water intake tracking, choosing the right plan, payment and checkout process, platform compatibility, community features, motivation, and everyday conversations. Just tap the microphone or type a message - I'm always here for you!" }
  ]);
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: new () => ISpeechRecognition; webkitSpeechRecognition?: new () => ISpeechRecognition }).SpeechRecognition || 
                                    (window as unknown as { webkitSpeechRecognition?: new () => ISpeechRecognition }).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = lang === 'es' ? 'es-ES' : 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcriptResult = event.results[current][0].transcript;
          setTranscript(transcriptResult);
          
          if (event.results[current].isFinal) {
            handleUserInput(transcriptResult);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [lang]);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Young woman voice: higher pitch, warm and friendly
    utterance.rate = 1.1;  // Slightly faster for energy
    utterance.pitch = 1.35;  // Higher pitch for youthful, attractive sound
    utterance.volume = 0.95; // Clear and confident
    
    // Try to get a young, friendly female voice
    const voices = synthRef.current.getVoices();
    const youngFemaleVoice = voices.find(v => {
      const n = v.name.toLowerCase();
      return (
        n.includes('young') ||
        n.includes('female') ||
        n.includes('samantha') ||
        n.includes('victoria') ||
        n.includes('serena') ||
        n.includes('zira') ||
        n.includes('sarah') ||
        n.includes('emma') ||
        n.includes('jessica') ||
        n.includes('monica') ||
        n.includes('aria') ||
        n.includes('google us english a')
      );
    });
    if (youngFemaleVoice) utterance.voice = youngFemaleVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [voiceEnabled]);

  const handleUserInput = useCallback((input: string) => {
    setConversationHistory(prev => [...prev, { type: 'user', text: input }]);
    setTranscript("");
    
    // Smart AI response - faster and more accurate
    setTimeout(() => {
      const response = getAriResponse(input);
      setConversationHistory(prev => [...prev, { type: 'ari', text: response }]);
      speak(response);
    }, 500); // Even faster response time
  }, [speak]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const toggleVoice = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setVoiceEnabled(!voiceEnabled);
    setIsSpeaking(false);
  }, [voiceEnabled]);

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="aspect-[9/16] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[3rem] border-[6px] border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between px-8 pt-4 pb-2">
          <span className="text-xs text-gray-500">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 bg-gray-600 rounded-sm" />
          </div>
        </div>
        
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
               <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-black text-lg ${isSpeaking ? 'animate-pulse' : ''}`}>
                 A
               </div>
               {(isSpeaking || isListening) && (
                 <div className="absolute inset-0 rounded-full border-2 border-pink-400 animate-ping" />
               )}
             </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                Ari 
                {isSpeaking && <Volume2 className="w-4 h-4 text-sky-400" />}
              </div>
              <div className="text-xs text-sky-400">
                {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Voice AI • Online"}
              </div>
            </div>
          </div>
          <button 
            onClick={toggleVoice}
            className={`p-2 rounded-full ${voiceEnabled ? 'bg-sky-500/20 text-sky-400' : 'bg-gray-700 text-gray-400'}`}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-center h-24">
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div 
                  key="listening"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1"
                >
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-sky-400 rounded-full"
                      animate={{
                        height: [16, 32, 16],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              ) : isSpeaking ? (
                <motion.div 
                  key="speaking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-teal-400 rounded-full"
                      animate={{
                        height: [20, 40, 20],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        delay: i * 0.08,
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 text-sm text-center"
                >
                  <Waves className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>Tap mic to speak to Ari</span>

    bestFor: "Clients who want steady muscle gain with a manageable weekly rhythm.",
    outcome: "The main path for bala
  {
    id: "glute-specialization",
    title: "Glute Specialization",
    goal: "You want the most direct glute growth focus inside a structured week.",
    days: 5,
    planVariant: "advanced",
    timeBudget: "60-75 min per session",
    weeklyLayout: "Mon / Tue / Thu / Fri / Sat",
    bestFor: "Clients who want three hard glute exposures and high weekly effort.",
    outcome: "Built for progressive overload and visible lower-body emphasis.",
  },
  {
    id: "strength-first",
    title: "Strength First",
    goal: "You want cleaner technique, heavier compounds, and more performance focus.",
    days: 5,
    planVariant: "advanced",
    timeBudget: "55-70 min per session",
    weeklyLayout: "Mon / Tue / Thu / Fri / Sat",
    bestFor: "Clients who enjoy tracking loads and pushing big lifts.",
    outcome: "More force, better control, and strong foundations.",
  },
  {
    id: "home-travel",
    title: "Home and Travel",
    goal: "You need a plan that works anywhere without losing progress.",
    days: 3,
    planVariant: "home",
    timeBudget: "30-40 min per session",
    weeklyLayout: "Mon / Wed / Sat",
    bestFor: "Travel weeks, apartment training, and low-equipment setups.",
    outcome: "Low friction with enough volume to stay on track.",
  },
  {
    id: "maximum-structure",
    title: "Maximum Structure",
    goal: "You want a highly structured week and recover well from frequent training.",
    days: 6,
    planVariant: "advanced",
    timeBudget: "45-70 min per session",
    weeklyLayout: "Mon / Tue / Wed / Thu / Fri / Sat",
    bestFor: "Advanced trainees who want high frequency with one full rest day.",
    outcome: "Maximum glute stimulus (3x/week) + Dorito upper body focus with one rest day.",
  },
];

const App = () => {
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

                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{program.goal}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {program.weeklyLayout.split(" / ").map((part) => (
                      <span
                        key={part}
                        className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-300"
                      >
                        {part.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-2">Best for</div>
                    <div className="text-sm text-gray-200 leading-relaxed mb-3">{program.bestFor}</div>
                    <div className="text-xs text-sky-300 font-medium">{program.outcome}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:sticky lg:top-6 h-fit"
          >
            <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Your current setup</div>
                <div className="text-xl font-black text-white">{trainingFrequency} days per week</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 mb-2">Weekly rhythm</div>
                <div className="text-sm text-gray-200 leading-relaxed">{activeProgram.weeklyLayout}</div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 mb-2">Why this fits</div>
                <div className="text-sm text-gray-200 leading-relaxed">{activeProgram.goal}</div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 mb-2">Who it serves</div>
                <div className="text-sm text-gray-200 leading-relaxed">{activeProgram.bestFor}</div>
              </div>
            </div>

                <button
              type="button"
              onClick={() => {
                setTrainingFrequency(activeProgram.days);
                setPlanVariant(activeProgram.planVariant);
              }}
               className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-black transition-all hover:from-cyan-300 hover:to-sky-300 hover:shadow-[0_0_40px_rgba(14,165,233,0.3)]"
            >
              Use this schedule
            </button>
          </motion.div>
        </div>
      </section>

      {/* Workout Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold mb-4">Goal-Based Split Structure</h2>
            <p className="text-gray-400">Zero cardio. Maximum hypertrophy. Choose 3, 5, or 7 training days based on your goal, with glute emphasis built in and tracking included.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-400">8</div>
              <div className="text-[10px] uppercase font-bold text-gray-500">Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-400">{trainingFrequency}</div>
              <div className="text-[10px] uppercase font-bold text-gray-500">Days/Wk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-400">0</div>
              <div className="text-[10px] uppercase font-bold text-gray-500">Cardio</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80 shrink-0 bg-white/5 rounded-[2rem] p-6 border border-white/10 h-fit sticky top-6">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Training frequency</div>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {([3, 5, 6] as TrainingFrequency[]).map((days) => (
                <button
                  key={days}
                  onClick={() => setTrainingFrequency(days)}
                    className={`px-3 py-3 rounded-2xl text-xs font-black border transition-all ${
                    trainingFrequency === days
                       ? "bg-gradient-to-r from-cyan-400 to-sky-400 text-black border-cyan-300 shadow-lg shadow-cyan-500/20"
                       : "bg-black/30 text-gray-200 border-white/10 hover:border-cyan-400/40"
                  }`}
                >
                  {days}D
                </button>
              ))}
            </div>

            <div className="mb-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-1">Best fit</div>
              <div className="text-sm text-gray-200 leading-relaxed">{ariKnowledgeBase.program.frequencyGuide[trainingFrequency]}</div>
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Plans for everyone</div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: "beginner", label: "Beginner" },
                { key: "intermediate", label: "Intermediate" },
                { key: "advanced", label: "Advanced" },
                { key: "home", label: "Home" },
              ] as Array<{ key: PlanVariant; label: string }>).map((v) => (
                <button
                  key={v.key}
                  onClick={() => setPlanVariant(v.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-black border transition-all ${
                    planVariant === v.key
                       ? "bg-gradient-to-r from-cyan-400 to-sky-400 text-black border-cyan-300"
                       : "bg-black/30 text-gray-200 border-white/10 hover:border-cyan-400/40"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-black/30 border border-white/10">
              <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Tracking</div>
              <div className="text-sm text-gray-300 leading-relaxed">
                Track sets, reps, weight, and RPE for each exercise. Your entries are saved locally on this device.
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Select day</div>
              <div className="grid grid-cols-3 gap-2">
                {displayedWorkouts.map((d, i) => (
                  <button
                    key={d.day}
                    onClick={() => setSelectedDayIndex(i)}
                    className={`py-2 rounded-xl text-xs font-black border transition-all ${
                      selectedDayIndex === i
                        ? "bg-gradient-to-r from-cyan-400 to-sky-300 text-black border-cyan-200"
                        : "bg-black/30 text-gray-200 border-white/10 hover:border-cyan-400/40"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
          {displayedWorkouts.map((day, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-[2rem] p-8 border border-white/10 hover:border-sky-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-sky-400 font-bold mb-1">{day.day}</h3>
                  <h4 className="text-2xl font-bold">{day.title}</h4>
                </div>
                {day.gluteTag && (
                  <span className="bg-sky-500/20 text-sky-400 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-sky-500/20">
                    {day.gluteTag}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-6 italic">"{day.focus}"</p>

              {!!day.variants?.[planVariant] && (
                <div className="mb-6 p-4 rounded-2xl bg-black/30 border border-white/10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                    {planVariant} option
                  </div>
                  <div className="space-y-3">
                    {day.variants[planVariant]!.map((ex, i) => (
                      <div key={i} className="text-xs">
                        <div className="font-bold text-gray-100">{ex.name}</div>
                        <div className="text-gray-500">{ex.sets} x {ex.reps} • {ex.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {day.exercises.map((ex, i) => (
                  <div key={i} className="relative pl-6 border-l border-white/10">
                    <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-sky-500" />
                    <div className="font-bold text-lg mb-1">{ex.name}</div>
                    <div className="flex gap-3 text-xs font-bold uppercase tracking-widest text-sky-500/60 mb-2">
                      <span>{ex.sets} Sets</span>
                      <span>{ex.reps} Reps</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{ex.note}</p>
                    <div className="text-[10px] text-gray-600 font-medium">{ex.example}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* Ari Voice AI Trainer Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
               className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-sky-500/20"
            >
              <Mic className="w-4 h-4" /> {t.aiVoiceTag || "VOICE-ENABLED AI"}
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">{t.aiTitle}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              {t.aiText}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-[2rem] p-8 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-black">Ari's Magical Abilities ✨</h3>
                  </div>
                 <ul className="space-y-4">
                   {[
                     { icon: "🎯", text: "Real-time form corrections with love & precision" },
                     { icon: "📊", text: "Reads your Health data to personalize your journey" },
                     { icon: "🗣️", text: "Natural conversations—she's like your gym bestie" },
                     { icon: "💡", text: "Instant exercise swaps that fit your vibe" },
                     { icon: "🔥", text: "Cheerleader energy when you need that extra push" },
                     { icon: "🌙", text: "Spiritual wellness + sleep recovery wisdom" },
                     { icon: "🧘‍♀️", text: "Mindful movement guidance & meditation tips" },
                     { icon: "💖", text: "Always positive, always in your corner" },
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 font-medium">
                       <span className="text-xl">{item.icon}</span>
                       {item.text}
                     </li>
                   ))}
                 </ul>
               </div>

              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Try saying...</h4>
                <div className="space-y-3">
                  {sampleVoiceCommands.map((cmd, i) => (
                    <div 
                      key={i}
                       className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all group cursor-pointer"
                    >
                       <div className="w-10 h-10 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-black transition-all">
                        <Mic className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white">"{cmd.command}"</div>
                        <div className="text-xs text-gray-500">{cmd.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <AriVoiceAssistant lang={lang} />
          </div>
        </div>
      </section>

      {/* Visual Library (No Faces) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center">Movement Visuals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "The Hip Thrust", img: "https://images.unsplash.com/photo-1574673139054-94865fff025e?auto=format&fit=crop&q=80&w=400" },
            { label: "Back Squat Depth", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400" },
            { label: "B-Stance RDL", img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=400" },
            { label: "The Kettlebell Swing", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400" },
            { label: "Bulgarian Stance", img: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&q=80&w=400" },
            { label: "Shoulder Press", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400" },
            { label: "Lat Activation", img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=400" },
            { label: "The Pushup", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400" },
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[4/5] bg-white/5 rounded-3xl overflow-hidden mb-3 border border-white/10 group-hover:border-sky-500/50 transition-all">
                <img src={item.img} alt={item.label} className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-75 group-hover:scale-105 transition-all" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meal Prep Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 italic">Fuel the Sync</h2>
            <p className="text-gray-400">Body-type specific meal preps for Men & Women.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                type: "The Ectomorph", 
                title: "Build & Maintain", 
                desc: "High calorie, high carb to support energy during heavy glute days.", 
                icon: <Zap className="w-6 h-6" />,
                plan: "40% Carb / 30% Protein / 30% Fat"
              },
              { 
                type: "The Mesomorph", 
                title: "Athletic Optimization", 
                desc: "Balanced macros to maintain lean mass while growing glute tissue.", 
                icon: <Activity className="w-6 h-6" />,
                plan: "35% Carb / 35% Protein / 30% Fat"
              },
              { 
                type: "The Endomorph", 
                title: "Sculpt & Define", 
                desc: "Lower carb, higher healthy fats to manage insulin and support recovery.", 
                icon: <Scale className="w-6 h-6" />,
                plan: "25% Carb / 40% Protein / 35% Fat"
              }
            ].map((meal, i) => (
              <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-sky-500/20 transition-all group">
                <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {meal.icon}
                </div>
                <h3 className="text-xl font-bold mb-1">{meal.type}</h3>
                <h4 className="text-xs text-sky-500 font-bold uppercase tracking-widest mb-4">{meal.title}</h4>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{meal.desc}</p>
                <div className="p-4 bg-black/40 rounded-2xl text-[10px] font-black tracking-tighter text-gray-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-sky-500" /> RECOMMENDED RATIO: {meal.plan}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paid Plan / Pricing with PayPal */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-12 rounded-[3rem] border-2 border-sky-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <ShieldCheck className="w-16 h-16 text-sky-500/20" />
            </div>
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-300 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-sky-500/20"
              >
                <Sparkles className="w-4 h-4" /> Flexible, Budget-Friendly Access
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.paidTitle}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{t.paidText}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  name: "Monthly Subscription",
                  price: "$19/mo",
                  note: "Best if you want the lowest entry point and full flexibility.",
                  badge: "Most flexible",
                  bullets: ["Cancel anytime", "Pay month to month", "Keep full program access while subscribed"],
                },
                {
                  name: "8-Week Plan",
                  price: "$49 one-time",
                  note: "Our suggested option for most clients. It is the easiest way to stay committed for the full 8-week cycle.",
                  badge: "Suggested",
                  bullets: ["One focused 8-week push", "Great balance of cost and structure", "Ideal for visible momentum"],
                },
                {
                  name: "One-Time Payment",
                  price: "$97 one-time",
                  note: "Best value if you want everything unlocked for life with no recurring billing.",
                  badge: "Best value",
                  bullets: ["Lifetime access", "No subscriptions", "Everything included forever"],
                },
              ].map((plan, i) => (
                <div key={i} className="p-7 rounded-[2rem] bg-white/5 border border-white/10 hover:border-sky-400/30 transition-all shadow-2xl shadow-black/20">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-full">{plan.badge}</span>
                    <div className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">{plan.price}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">{plan.note}</p>
                  <div className="space-y-3">
                    {plan.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-200 leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-5">
                <div className="text-xs font-black uppercase tracking-widest text-sky-400 mb-2">What Every Plan Includes</div>
                {[
                  "8-Week Periodized Growth Plan",
                  "Ari Voice AI Trainer",
                  "Health Sync (Apple Health, Samsung Health, Google Fit)",
                  "Advanced Meal Prep Video Guides",
                  "Priority Community Support",
                  "Voice-Activated Workouts",
                  "Smart Notification System",
                  "Rep & Set Tracking Dashboard",
                  "Multi-Language Support",
                  "Intermittent Fasting Protocol Guide",
                  "Single User License - Personal Use Only",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center gap-6">
                <div className="p-8 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 rounded-3xl text-center border border-sky-500/20">
                  <div className="text-sm text-sky-300 font-bold uppercase mb-2 tracking-widest">Simple, Secure Checkout</div>
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">Pick Your Pace</div>
                  <div className="text-sm text-gray-400 mb-4">Monthly for flexibility, 8 weeks for commitment, or one-time for lifetime value.</div>
                  <div className="flex items-center justify-center gap-2 text-xs text-sky-300 font-bold bg-sky-500/10 px-4 py-2 rounded-full w-fit mx-auto">
                    <ShieldCheck className="w-4 h-4" /> Cancel Anytime on Monthly • Money-Back Guarantee
                  </div>
                </div>
                <button className="w-full py-5 bg-gradient-to-r from-cyan-400 to-sky-400 text-black font-black rounded-full hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20 group">
                  <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" /> Choose Your Plan
                </button>
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">PayPal</div>
                    <span className="text-xs text-gray-400 font-medium">Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold text-xs">Credit</div>
                    <span className="text-xs text-gray-400 font-medium">Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold text-xs">Apple</div>
                    <span className="text-xs text-gray-400 font-medium">Pay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs text-[10px]">Google</div>
                    <span className="text-xs text-gray-400 font-medium">Pay</span>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500">
                  All payments are processed securely through PayPal, Google Pay, and major payment providers. Each purchase is for one individual user only. Cancel monthly subscription anytime with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Challenges Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-300 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-sky-500/20"
            >
              <Share2 className="w-4 h-4" /> Join the Movement
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Community & Challenges 🌟</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Connect with thousands of lifters worldwide. Share your wins, get feedback, and stay accountable.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-sky-400 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Active Challenges</h3>
                </div>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">3 Live Now</span>
              </div>
              <div className="space-y-4">
                {[
                  { title: "8-Week Glute Streak", desc: "Complete all 3 glute sessions weekly", participants: "2,847", hashtag: "#GluteSyncStreak" },
                  { title: "Perfect Form Week", desc: "Post 1 form video per session", participants: "1,523", hashtag: "#FormFirst" },
                  { title: "Morning Activation Challenge", desc: "20-min CNS primer every AM", participants: "3,102", hashtag: "#WakeUpStrong" },
                ].map((challenge, i) => (
                  <div key={i} className="p-5 bg-black/30 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">{challenge.title}</h4>
                      <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-full">{challenge.hashtag}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{challenge.desc}</p>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                      <span>👥 {challenge.participants} participants</span>
                    <span className="text-sky-500">Join Now →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-sky-400 rounded-full flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Community Forum</h3>
                </div>
                <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full">Live</span>
              </div>
              <div className="space-y-4 mb-6">
                {[
                  { author: "Ari (Coach)", title: "Welcome! Share your goals + level", tags: ["intro", "goals"], time: "Today" },
                  { author: "Sarah M.", title: "Week 3 transformation photos!", tags: ["progress", "motivation"], time: "2h ago" },
                  { author: "Mike T.", title: "Meal prep ideas for ectomorphs?", tags: ["nutrition", "help"], time: "5h ago" },
                  { author: "Jessica L.", title: "How to activate glutes better?", tags: ["form", "technique"], time: "1d ago" },
                ].map((post, i) => (
                  <div key={i} className="p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-sky-400 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                          {post.author[0]}
                        </div>
                        <span className="text-sm font-bold text-gray-300">{post.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">{post.time}</span>
                    </div>
                    <h4 className="font-medium text-white mb-2">{post.title}</h4>
                    <div className="flex gap-2">
                      {post.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold rounded-xl border border-cyan-500/30 transition-all">
                Create New Post
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3">Share Your Journey 📱</h3>
              <p className="text-gray-400 max-w-xl mx-auto">Connect your social accounts and share your progress automatically. Tag #GluteSync to join the global community!</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {["Instagram", "TikTok", "YouTube", "Twitter"].map((social, i) => (
                <button key={i} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm transition-all flex items-center gap-2 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full group-hover:scale-110 transition-transform" />
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Smart Notifications Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-sky-500/20"
                >
                  <Activity className="w-4 h-4" /> Smart Reminders
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Consistent, Stay Connected 🔔</h2>
                <p className="text-gray-400 max-w-xl mx-auto">Ari sends personalized notifications to keep you motivated and on track—no spam, just what you need.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: "🌅", title: "Morning Activation", desc: "7 AM reminder for your 20-min CNS primer" },
                  { icon: "💪", title: "Workout Time", desc: "Gentle nudge before your scheduled session" },
                  { icon: "🍽️", title: "Meal Prep Alerts", desc: "Weekly prep day reminders with tips" },
                  { icon: "🧘‍♀️", title: "Recovery Check-ins", desc: "Rest day stretches & breathing exercises" },
                  { icon: "🎯", title: "Progress Celebrations", desc: "Milestone achievements & win shares" },
                  { icon: "🌙", title: "Wind-Down Time", desc: "Evening relaxation & sleep prep" },
                ].map((notif, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all">
                    <div className="text-2xl">{notif.icon}</div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{notif.title}</h4>
                      <p className="text-sm text-gray-500">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-black font-bold rounded-2xl transition-all shadow-xl shadow-cyan-500/20">
                  Enable Notifications
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-black/25 hover:bg-cyan-500/10 text-white font-bold rounded-2xl transition-all border border-cyan-400/20 hover:border-cyan-300/40">
                  Customize Schedule
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-6">
                Control all notifications in settings. Turn off anytime. We respect your peace. 🙏
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tighter">GLUTE SYNC</span>
          </div>
          <p className="text-sm text-gray-600">Built with 💖 for the heavy lifters. Zero cardio. Powered by Ari. © 2024 Glute Sync Inc.</p>
          <div className="flex gap-6">
            <Share2 className="w-5 h-5 text-gray-600 hover:text-pink-400 cursor-pointer transition-colors" />
            <Smartphone className="w-5 h-5 text-gray-600 hover:text-pink-400 cursor-pointer transition-colors" />
            <Apple className="w-5 h-5 text-gray-600 hover:text-pink-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
