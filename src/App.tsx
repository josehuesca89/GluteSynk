import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ArrowLeft, CheckCircle2, Clock, Trophy, Flame, MessageCircle, X, Send, Loader2, Sparkles, Info } from "lucide-react";
import { copy, clientPrograms, trainingSchedules, ariKnowledgeBase } from "./AriLogic";
import { useLocalStorage } from "./useLocalStorage"; 

const WORKER_URL = "https://muddy-water-57d2.josehuesca89.workers.dev/";

const App = () => {
  const [lang, setLang] = useLocalStorage<"en" | "es">("glutesync_lang", "en");
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
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const activeProgram = clientPrograms.find(p => p.id === activeId) ?? clientPrograms[0];
  const workoutList = (trainingSchedules as any)[activeProgram.planVariant]?.workouts ?? [];

  const handleChat = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: `You are Ari, an elite glute coach. Lang: ${lang}.`
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch (e: any) {
      setMessages([...newMessages, { role: "assistant", content: `Ari is offline: ${e.message}` }]);
    } finally { setIsTyping(false); }
  };

  const toggleExercise = (key: string, name: string) => {
    const isNowDone = !completed.includes(key);
    const newCompleted = isNowDone ? [...completed, key] : completed.filter(id => id !== key);
    setCompleted(newCompleted);
    if (isNowDone) {
      const allKeys = workoutList.map((ex: any) => `${activeId}-${ex.name}`);
      if (allKeys.every(k => newCompleted.includes(k))) {
        setShowSuccess(true);
        setTotalWorkouts(totalWorkouts + 1);
      } else { setTimeLeft(60); }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-30">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover" src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" />
      </div>

      <main className="relative z-50 flex flex-col min-h-screen">
        <nav className="p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-[100]">
          <div className="flex items-center gap-2"><Zap className="text-sky-400" /><span className="text-2xl font-black italic uppercase">GLUTE<span className="text-sky-400">SYNC</span></span></div>
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-xs font-black text-white/40">{lang === 'en' ? 'ES' : 'EN'}</button>
        </nav>

        <AnimatePresence mode="wait">
          {!showWorkouts ? (
            <motion.section key="home" className="flex-grow flex flex-col items-center justify-center text-center px-6 py-12">
              <div className="flex gap-4 mb-6 bg-white/5 px-6 py-2 rounded-full border border-white/10">
                <span className="text-[10px] font-black uppercase text-sky-400">{totalWorkouts} Workouts</span>
                <span className="text-[10px] font-black uppercase text-orange-400">{streak} Day Streak</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase mb-8 leading-tight">{activeProgram.title}</h1>
              <button onClick={() => setShowWorkouts(true)} className="px-12 py-6 bg-sky-400 text-black font-black rounded-full uppercase italic mb-12">Start Workout</button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {clientPrograms.map(p => (
                  <button key={p.id} onClick={() => setActiveId(p.id)} className={`p-6 rounded-3xl border-2 transition-all ${activeId === p.id ? "border-sky-400 bg-sky-400/10" : "border-white/10"}`}>
                    <div className="text-xl font-black italic uppercase">{p.title}</div>
                    <div className="text-[10px] text-sky-400 font-bold uppercase mt-1">{p.days} Days</div>
                  </button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section key="workouts" className="p-6 max-w-4xl mx-auto w-full pb-32">
               <button onClick={() => setShowWorkouts(false)} className="mb-8 text-sky-400 font-black uppercase text-xs flex items-center gap-2"><ArrowLeft size={14}/> Back</button>
               <div className="space-y-4">
                 {workoutList.map((ex: any, i: number) => {
                   const key = `${activeId}-${ex.name}`;
                   const isDone = completed.includes(key);
                   const isExpanded = expandedEx === key;
                   const details = (ariKnowledgeBase.exercises as any)[ex.name];
                   return (
                     <div key={i} className={`bg-white/5 border rounded-3xl transition-all ${isExpanded ? 'border-sky-400/50' : 'border-white/10'}`}>
                        <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setExpandedEx(isExpanded ? null : key)}>
                           <div>
                             <div className={`text-2xl font-black uppercase italic ${isDone ? 'text-gray-600 line-through' : ''}`}>{ex.name}</div>
                             <div className="text-sky-400 font-bold uppercase text-[10px]">{ex.sets} Sets</div>
                           </div>
                           <CheckCircle2 onClick={(e) => { e.stopPropagation(); toggleExercise(key, ex.name); }} className={isDone ? 'text-sky-400' : 'text-white/10'} size={32} />
                        </div>
                        {isExpanded && details && (
                          <div className="p-6 pt-0 border-t border-white/5"><p className="text-sm text-gray-400 mt-4">{details.form}</p></div>
                        )}
                     </div>
                   );
                 })}
               </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* --- CHAT --- */}
        {!showChat && <button onClick={() => setShowChat(true)} className="fixed bottom-8 right-6 w-16 h-16 bg-sky-400 rounded-full flex items-center justify-center shadow-lg"><MessageCircle size={24} className="text-black"/></button>}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[300] bg-black flex flex-col">
               <div className="p-6 border-b border-white/10 flex justify-between items-center"><span className="font-black uppercase text-sky-400">Ari AI</span><X onClick={() => setShowChat(false)} className="text-white/40 cursor-pointer"/></div>
               <div className="flex-grow overflow-y-auto p-6 space-y-4">
                 {messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-sky-400 text-black' : 'bg-white/10 text-white'}`}>{m.content}</div></div>))}
                 {isTyping && <Loader2 className="animate-spin text-sky-400 m-4" />}
               </div>
               <div className="p-6 border-t border-white/10 flex gap-4">
                 <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} placeholder="Ask Ari..." className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-sky-400" />
                 <button onClick={handleChat} className="w-14 h-14 bg-sky-400 rounded-full flex items-center justify-center text-black"><Send size={20}/></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
export default App;
