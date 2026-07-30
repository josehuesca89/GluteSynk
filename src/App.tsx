import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ArrowLeft, CheckCircle2, Clock, Trophy, Flame, MessageCircle, X, Send, Loader2, Sparkles, Volume2, Dumbbell, BookOpen, Apple, Activity } from "lucide-react";
import { clientPrograms, trainingSchedules } from "./AriLogic";
import { useLocalStorage } from "./useLocalStorage"; 
import Gallery from "./components/Gallery"; // Fixed import: removed curly braces
import Navbar from "./components/Navbar"; // Integrated the new Navbar component
import { appAgent } from "./agent/AppAgent";

const WORKER_URL = "https://muddy-water-57d2.josehuesca89.workers.dev/";

const App = () => {
  const [lang] = useLocalStorage<"en" | "es">("glutesync_lang", "en");
  const [activeId, setActiveId] = useLocalStorage("glutesync_active_id", clientPrograms[0].id);
  const [completed, setCompleted] = useLocalStorage<string[]>("glutesync_completed", []);
  const [totalWorkouts, setTotalWorkouts] = useLocalStorage("glutesync_total_stats", 0);
  const [streak, setStreak] = useLocalStorage("glutesync_streak", 0);
  const [lastDate, setLastDate] = useLocalStorage<string | null>("glutesync_last_date", null);

  const [showWorkouts, setShowWorkouts] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [libraryFilter, setLibraryFilter] = useState<"all" | "workout" | "meal" | "stretch">("all");

  const activeProgram = clientPrograms.find(p => p.id === activeId) ?? clientPrograms[0];
  const workoutList = (trainingSchedules as any)[activeProgram.planVariant]?.workouts ?? [];

  // --- VOICE FUNCTION ---
  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "es" ? "es-MX" : "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [lang]);

  // --- REST TIMER LOGIC ---
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      const doneTimer = setTimeout(() => {
        speakText(lang === "en" ? "Rest over! Get back to it." : "¡Descanso terminado! Dale.");
        setTimeLeft(null);
      }, 0);
      return () => clearTimeout(doneTimer);
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, lang, speakText]);

  // SECURED CHAT HANDLER
  const handleChat = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Fast bilingual triage: billing disputes/refunds/legal go straight to
    // a human-handoff message instead of letting the LLM improvise on
    // money questions. Everything else still gets the full Ari response.
    const triage = appAgent.handleSupportMessage(userMsg.content, lang);
    if (triage.classification.escalate) {
      setMessages([...newMessages, { role: "assistant", content: triage.reply }]);
      setIsTyping(false);
      return;
    }

    try {
      const data = await appAgent.retry(
        async () => {
          const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: newMessages,
              lang: lang
            })
          });
          const json = await res.json();
          if (json.error) throw new Error(json.error);
          return json;
        },
        { attempts: 2, context: "ari-chat-worker" }
      );

      setMessages([...newMessages, { role: "assistant", content: data.content }]);
      speakText(data.content);
    } catch (e: any) {
      setMessages([...newMessages, { role: "assistant", content: `Ari is offline: ${e.message}` }]);
    } finally { setIsTyping(false); }
  };

  const toggleExercise = (key: string, name: string) => {
    const isNowDone = !completed.includes(key);
    const newCompleted = isNowDone ? [...completed, key] : completed.filter(id => id !== key);
    setCompleted(newCompleted);
    
    if (isNowDone) {
      speakText(lang === 'en' ? `Nice set of ${name}` : `¡Buen set de ${name}!`);
      
      const allKeys = workoutList.map((ex: any) => `${activeId}-${ex.name}`);
      if (allKeys.every((k: string) => newCompleted.includes(k))) {
        setShowSuccess(true);
        const today = new Date().toDateString();
        setTotalWorkouts(totalWorkouts + 1);
        if (lastDate !== today) { setStreak(streak + 1); setLastDate(today); }
        speakText(lang === 'en' ? "Workout complete! You are a beast!" : "¡Entrenamiento terminado! Eres una fiera.");
      } else {
        setTimeLeft(60);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden antialiased">
      {/* Background Video Layer */}
      <div className="fixed inset-0 z-0 opacity-25 pointer-events-none mix-blend-lighten">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover" src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-zinc-950" />
      </div>

      <main className="relative z-50 flex flex-col min-h-screen">
        <Navbar />

        {/* Structural Container */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            {!showWorkouts ? (
              <motion.section key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-grow flex flex-col items-center justify-center text-center py-12">
                
                {/* Stats Header Badge */}
                <div className="flex gap-4 mb-6 bg-zinc-900/80 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-inner">
                  <div className="flex items-center gap-2"><Trophy size={14} className="text-sky-400" /><span className="text-[10px] font-black uppercase tracking-widest">{totalWorkouts} Workouts</span></div>
                  <div className="flex items-center gap-2"><Flame size={14} className="text-orange-500" /><span className="text-[10px] font-black uppercase tracking-widest text-orange-400">{streak} Day Streak</span></div>
                </div>

                {/* Typography Header Title */}
                <h1 className="text-5xl md:text-8xl font-black italic uppercase mb-8 leading-tight tracking-tight max-w-4xl">
                  {activeProgram.title}
                </h1>

                {/* Prominent Action Button Target */}
                <button 
                  onClick={() => setShowWorkouts(true)} 
                  className="px-14 py-5 bg-sky-400 text-black font-black rounded-full uppercase italic mb-14 shadow-xl shadow-sky-400/20 hover:bg-sky-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Start Workout
                </button>
                
                {/* Unified Main Selection Cards Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-14">
                  {clientPrograms.map((p) => {
                    const isActive = activeId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActiveId(p.id)}
                        className={`relative group p-6 rounded-3xl border text-left transition-all duration-300 overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[160px] ${
                          isActive
                            ? "border-sky-400 bg-gradient-to-br from-sky-400/20 to-zinc-900/50 shadow-[0_0_25px_rgba(56,189,248,0.15)]"
                            : "border-white/5 bg-zinc-900/30 hover:border-white/20 hover:bg-zinc-900/60"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex justify-between items-start w-full relative z-10">
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-sky-400 group-hover:scale-110 transition-transform duration-300">
                            <Zap size={20} className={isActive ? "fill-sky-400 animate-pulse" : ""} />
                          </div>
                          {isActive && (
                            <span className="text-[10px] bg-sky-400 text-black font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md shadow-sky-400/20">
                              Active Plan
                            </span>
                          )}
                        </div>

                        <div className="mt-8 relative z-10">
                          <div className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white group-hover:text-sky-400 transition-colors duration-300">
                            {p.title}
                          </div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 mt-1.5 flex items-center gap-1">
                            <span>View Routine</span>
                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Age-Friendly Library Section Layout Block */}
                <div className="w-full border-t border-white/10 pt-10 text-left">
                  <h2 className="text-3xl font-black italic uppercase tracking-tight mb-2">Library</h2>
                  <p className="text-white/50 text-sm mb-6 font-medium">Browse additional resources, custom nutritional guides, and recovery programs.</p>
                  
                  {/* Category Filtering Tab Menu Rows */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <button 
                      onClick={() => setLibraryFilter("all")}
                      className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                        libraryFilter === "all" 
                          ? "bg-white text-black border-white" 
                          : "bg-zinc-900/50 text-white/70 border-white/5 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <BookOpen size={14} />
                      <span>Show All</span>
                    </button>
                    
                    <button 
                      onClick={() => setLibraryFilter("workout")}
                      className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                        libraryFilter === "workout" 
                          ? "bg-sky-400 text-black border-sky-400 shadow-lg shadow-sky-400/10" 
                          : "bg-zinc-900/50 text-white/70 border-white/5 hover:border-sky-400/30 hover:text-sky-400"
                      }`}
                    >
                      <Dumbbell size={14} />
                      <span>Routines</span>
                    </button>

                    <button 
                      onClick={() => setLibraryFilter("meal")}
                      className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                        libraryFilter === "meal" 
                          ? "bg-orange-500 text-black border-orange-500 shadow-lg shadow-orange-500/10" 
                          : "bg-zinc-900/50 text-white/70 border-white/5 hover:border-orange-500/30 hover:text-orange-400"
                      }`}
                    >
                      <Apple size={14} />
                      <span>Meals & Diet</span>
                    </button>

                    <button 
                      onClick={() => setLibraryFilter("stretch")}
                      className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                        libraryFilter === "stretch" 
                          ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/10" 
                          : "bg-zinc-900/50 text-white/70 border-white/5 hover:border-purple-500/30 hover:text-purple-400"
                      }`}
                    >
                      <Activity size={14} />
                      <span>Recovery</span>
                    </button>
                  </div>

                  <Gallery key={libraryFilter} filter={libraryFilter} />
                </div>

              </motion.section>
            ) : (
              <motion.section key="workouts" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-4xl mx-auto py-12 pb-32">
                 <button onClick={() => setShowWorkouts(false)} className="mb-8 text-sky-400 font-black uppercase text-xs flex items-center gap-2 hover:text-white transition-colors"><ArrowLeft size={14}/> Back</button>
                 
                 <div className="space-y-4">
                   {workoutList.map((ex: any, i: number) => {
                     const key = `${activeId}-${ex.name}`;
                     const isDone = completed.includes(key);
                     return (
                       <div 
                         key={i} 
                         className={`relative overflow-hidden p-6 rounded-3xl border flex justify-between items-center transition-all duration-300 backdrop-blur-md ${
                           isDone 
                             ? 'border-emerald-500/30 bg-emerald-950/10 opacity-60' 
                             : 'border-white/5 bg-zinc-950/40 hover:border-white/15 hover:bg-zinc-900/40'
                         }`}
                       >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-3 rounded-2xl border transition-colors ${
                              isDone ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-white/5 text-sky-400 bg-white/5'
                            }`}>
                              <Dumbbell size={20} />
                            </div>

                            <div>
                              <div className={`text-2xl font-black uppercase italic tracking-tighter transition-colors ${
                                isDone ? 'text-zinc-500 line-through' : 'text-white'
                              }`}>
                                {ex.name}
                              </div>
                              <div className={`font-black uppercase text-[10px] tracking-widest mt-0.5 ${
                                isDone ? 'text-emerald-500/60' : 'text-sky-400'
                              }`}>
                                {ex.sets} Sets
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={() => toggleExercise(key, ex.name)} 
                            className="relative z-10 focus:outline-none group transform active:scale-95 transition-transform"
                            aria-label={`Mark ${ex.name} as complete`}
                          >
                            <CheckCircle2 
                              className={`transition-all duration-300 ${
                                isDone 
                                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' 
                                  : 'text-white/10 group-hover:text-white/30'
                              }`} 
                              size={36} 
                            />
                          </button>
                       </div>
                     );
                   })}
                 </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* --- CHAT MODAL --- */}
        {!showChat && <button onClick={() => setShowChat(true)} className="fixed bottom-8 right-6 w-16 h-16 bg-sky-400 rounded-full flex items-center justify-center shadow-lg shadow-sky-400/20 hover:scale-110 transition-all z-[200]"><MessageCircle size={24} className="text-black"/></button>}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[300] bg-black flex flex-col">
               <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md">
                 <div className="flex items-center gap-2 text-sky-400"><Sparkles size={20}/><span className="font-black uppercase tracking-widest">Ari AI</span></div>
                 <X onClick={() => setShowChat(false)} className="text-white/40 cursor-pointer hover:text-white transition-colors"/>
               </div>
               <div className="flex-grow overflow-y-auto p-6 space-y-4">
                 {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-sky-400 text-black rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                       {m.content}
                       {m.role === 'assistant' && <Volume2 size={14} className="mt-2 cursor-pointer opacity-50 hover:opacity-100" onClick={() => speakText(m.content)} />}
                     </div>
                   </div>
                 ))}
                 {isTyping && <div className="flex justify-start"><Loader2 className="animate-spin text-sky-400 m-4" /></div>}
               </div>
               <div className="p-6 border-t border-white/10 flex gap-4 bg-black">
                <input 
                  id="ari-chat-input"
                  name="ari-chat-input"
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()} 
                  placeholder="Ask Ari..." 
                  className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-sky-400" 
                />
                 <button onClick={handleChat} disabled={!input.trim() || isTyping} className="w-14 h-14 bg-sky-400 rounded-full flex items-center justify-center text-black shadow-lg shadow-sky-400/20 disabled:opacity-50 transition-all"><Send size={20}/></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Floating Glassmorphism Rest Timer Overlay */}
        <AnimatePresence>
          {timeLeft !== null && (
            <motion.div 
              initial={{ y: 60, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 60, opacity: 0 }} 
              className="fixed bottom-6 left-0 right-0 px-4 z-[250]"
            >
              <div className="max-w-xl mx-auto bg-zinc-950/40 border border-white/10 backdrop-blur-xl p-4 rounded-3xl flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4 px-3">
                  <div className="p-2.5 bg-sky-400/10 border border-sky-400/20 text-sky-400 rounded-2xl animate-pulse">
                    <Clock size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">
                      {timeLeft}s <span className="text-sky-400 text-lg">Rest</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">
                      Recover for your next set
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setTimeLeft(null)} 
                  className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-wider transition-all duration-200 transform active:scale-95 shadow-lg"
                >
                  Skip Rest
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SUCCESS OVERLAY --- */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
              <Trophy size={80} className="text-sky-400 mb-6 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" />
              <h2 className="text-6xl md:text-8xl font-black italic uppercase mb-8 leading-tight tracking-tighter">Workout<br/>Complete!</h2>
              <button onClick={() => { setShowSuccess(false); setShowWorkouts(false); setCompleted([]); }} className="px-12 py-6 bg-white text-black font-black rounded-full uppercase italic hover:scale-105 transition-all shadow-xl">Go Home</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
