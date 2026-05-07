import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ArrowLeft, CheckCircle2, Clock, Trophy, Flame, MessageCircle, X, Send, Loader2, Sparkles, Volume2 } from "lucide-react";
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

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "es" ? "es-MX" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (timeLeft === 0) { speakText(lang === "en" ? "Rest over!" : "¡Descanso terminado!"); setTimeLeft(null); }
    if (!timeLeft) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, lang]);

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
          systemPrompt: `You are Ari, a fitness coach. Keep answers short. Lang: ${lang}.`
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch (e: any) {
      setMessages([...newMessages, { role: "assistant", content: `Offline: ${e.message}` }]);
    } finally { setIsTyping(false); }
  };

  const toggleExercise = (key: string) => {
    const isDone = !completed.includes(key);
    setCompleted(isDone ? [...completed, key] : completed.filter(id => id !== key));
    if (isDone) setTimeLeft(60);
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-30">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover" src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4" />
      </div>

      <main className="relative z-50 flex flex-col min-h-screen">
        <nav className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-[100]">
          <div className="flex items-center gap-2"><Zap className="text-sky-400" /><span className="text-2xl font-black italic uppercase">GLUTE<span className="text-sky-400">SYNC</span></span></div>
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-xs font-black text-white/40">{lang === 'en' ? 'ES' : 'EN'}</button>
        </nav>

        <AnimatePresence mode="wait">
          {!showWorkouts ? (
            <motion.section key="home" className="flex-grow flex flex-col items-center justify-center text-center px-6 py-12">
              <h1 className="text-6xl md:text-8xl font-black italic uppercase mb-8">{activeProgram.title}</h1>
              <button onClick={() => setShowWorkouts(true)} className="px-12 py-6 bg-sky-400 text-black font-black rounded-full uppercase italic mb-12">Start Workout</button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {clientPrograms.map(p => (
                  <button key={p.id} onClick={() => setActiveId(p.id)} className={`p-6 rounded-3xl border-2 transition-all ${activeId === p.id ? "border-sky-400 bg-sky-400/10" : "border-white/10"}`}>
                    <div className="text-xl font-black italic uppercase">{p.title}</div>
                  </button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section key="workouts" className="p-6 max-w-4xl mx-auto w-full">
               <button onClick={() => setShowWorkouts(false)} className="mb-8 text-sky-400 font-black uppercase text-xs flex items-center gap-2"><ArrowLeft size={14}/> Back</button>
               <div className="space-y-4">
                 {workoutList.map((ex: any, i: number) => {
                   const key = `${activeId}-${ex.name}`;
                   const isDone = completed.includes(key);
                   return (
                     <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center">
                        <div>
                          <div className={`text-2xl font-black uppercase italic ${isDone ? 'text-gray-600 line-through' : ''}`}>{ex.name}</div>
                          <div className="text-sky-400 font-bold uppercase text-[10px]">{ex.sets} Sets</div>
                        </div>
                        <CheckCircle2 onClick={() => toggleExercise(key)} className={isDone ? 'text-sky-400' : 'text-white/10'} size={32} />
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
                 {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-sky-400 text-black' : 'bg-white/10 text-white'}`}>
                       {m.content}
                       {m.role === 'assistant' && <Volume2 size={14} className="mt-2 cursor-pointer opacity-50" onClick={() => speakText(m.content)} />}
                     </div>
                   </div>
                 ))}
                 {isTyping && <Loader2 className="animate-spin text-sky-400 m-4" />}
               </div>
               <div className="p-6 border-t border-white/10 flex gap-4">
                 <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} placeholder="Ask Ari..." className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm" />
                 <button onClick={handleChat} className="w-14 h-14 bg-sky-400 rounded-full flex items-center justify-center text-black"><Send size={20}/></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {timeLeft !== null && (
          <div className="fixed bottom-6 left-6 right-6 z-[200] bg-sky-400 text-black p-4 rounded-2xl flex justify-between items-center font-black uppercase">
            <span>Rest: {timeLeft}s</span>
            <button onClick={() => setTimeLeft(null)} className="text-[10px] border border-black px-2 py-1 rounded">Skip</button>
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
