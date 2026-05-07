import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ChevronRight, ArrowLeft, CheckCircle2,
  Clock, Trophy, Flame, MessageCircle, X, Send, Loader2, Sparkles, Info
} from "lucide-react";
import { copy, clientPrograms, trainingSchedules, ariKnowledgeBase } from "./AriLogic";
import { useLocalStorage } from "./useLocalStorage"; 

type Lang = "en" | "es";
interface ChatMessage { role: "user" | "assistant"; content: string; }

// --- WORKER URL (Replace with your actual URL) ---
const WORKER_URL = "https://muddy-water-57d2.josehuesca89.workers.dev/";

const App = () => {
  const [lang, setLang] = useLocalStorage<Lang>("glutesync_lang", "en");
  const [activeId, setActiveId] = useLocalStorage("glutesync_active_id", clientPrograms[0].id);
  const [completed, setCompleted] = useLocalStorage<string[]>("glutesync_completed", []);
  const [totalWorkouts, setTotalWorkouts] = useLocalStorage("glutesync_total_stats", 0);
  const [streak, setStreak] = useLocalStorage("glutesync_streak", 0);
  const [lastDate, setLastDate] = useLocalStorage<string | null>("glutesync_last_date", null);

  const [showWorkouts, setShowWorkouts] = useState(false);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const speakCoaching = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "es" ? "es-MX" : "en-US";
    window.speechSynthesis.speak(utterance);
  }, [lang]);

  useEffect(() => {
    if (timeLeft === 0) {
      speakCoaching(lang === "en" ? "Rest over!" : "¡Descanso terminado!");
      setTimeLeft(null);
    }
    if (!timeLeft) return;
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, lang, speakCoaching]);

  const activeProgram = clientPrograms.find(p => p.id === activeId) ?? clientPrograms[0];
  const workoutList = (trainingSchedules as any)[activeProgram.planVariant]?.workouts ?? [];

  const handleChat = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: input };
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
          systemPrompt: `You are Ari, an elite glute-focused fitness coach. Be direct and motivating. Lang: ${lang}. Stats: ${totalWorkouts} workouts.`
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I lost my connection! Try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleExercise = (exerciseKey: string, name: string) => {
    const isNowCompleted = !completed.includes(exerciseKey);
    const newCompleted = isNowCompleted ? [...completed, exerciseKey] : completed.filter(id => id !== exerciseKey);
    setCompleted(newCompleted);

    if (isNowCompleted) {
      const allKeys = workoutList.map((ex: any) => `${activeId}-${ex.name}`);
      if (allKeys.every(k => newCompleted.includes(k))) {
        setShowSuccess(true);
        setTotalWorkouts(totalWorkouts + 1);
        speakCoaching("Workout Complete!");
      } else {
        setTimeLeft(60);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
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
            <motion.section key="home" className="flex-grow flex flex-col items-center justify-center text-center px-6">
              <div className="flex gap-4 mb-6 bg-white/5 px-6 py-2 rounded-full border border-white/10">
                <span className="text-[10px] font-black uppercase text-sky-400">{totalWorkouts} Workouts</span>
                <span className="text-[10px] font-black uppercase text-orange-400">{streak} Day Streak</span>
              </div>
              <h1 className="text-7xl font-black italic uppercase mb-8">{activeProgram.title}</h1>
              <button onClick={() => setShowWorkouts(true)} className="px-12 py-6 bg-sky-400 text-black font-black rounded-full uppercase italic shadow-lg shadow-sky-400/20">Start Workout</button>
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
                     <div key={i} className={`bg-white/5 border rounded-3xl overflow-hidden transition-all ${isExpanded ? 'border-sky-400/50' : 'border-white/10'}`}>
                        <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setExpandedEx(isExpanded ? null : key)}>
                           <div>
                             <div className={`text-2xl font-black uppercase italic ${isDone ? 'text-gray-600 line-through' : ''}`}>{ex.name}</div>
                             <div className="text-sky-400 font-bold uppercase text-[10px]">{ex.sets} Sets</div>
                           </div>
                           <CheckCircle2 onClick={(e) => { e.stopPropagation(); toggleExercise(key, ex.name); }} className={isDone ? 'text-sky-400' : 'text-white/10'} size={32} />
                        </div>
                        {isExpanded && details && (
                          <div className="p-6 pt-0 border-t border-white/5">
                            <p className="text-sm text-gray-400 mt-4">{details.form}</p>
                            <button onClick={() => setShowChat(true)} className="mt-4 text-sky-400 font-black uppercase text-[10px] flex items-center gap-2"><MessageCircle size={12}/> Ask Ari</button>
                          </div>
                        )}
                     </div>
                   );
                 })}
               </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* --- CHAT MODAL --- */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[300] bg-black flex flex-col">
               <div className="p-6 border-b border-white/10 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-sky-400"><Sparkles size={20}/><span className="font-black uppercase">Ari AI</span></div>
                 <X onClick={() => setShowChat(false)} className="text-white/40 cursor-pointer"/>
               </div>
               <div className="flex-grow overflow-y-auto p-6 space-y-4">
                 {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-sky-400 text-black' : 'bg-white/10 text-white'}`}>{m.content}</div>
                   </div>
                 ))}
                 {isTyping && <Loader2 className="animate-spin text-sky-400" />}
               </div>
               <div className="p-6 border-t border-white/10 flex gap-4">
                 <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} placeholder="Ask me anything..." className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-sky-400" />
                 <button onClick={handleChat} className="w-14 h-14 bg-sky-400 rounded-full flex items-center justify-center text-black"><Send size={20}/></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- REST TIMER --- */}
        <AnimatePresence>
          {timeLeft !== null && (
            <div className="fixed bottom-0 left-0 right-0 p-6 z-[200]">
              <div className="max-w-4xl mx-auto bg-sky-400 text-black p-4 rounded-3xl flex justify-between items-center shadow-2xl">
                <div className="flex items-center gap-4 px-4"><Clock className="animate-pulse" /><span className="text-2xl font-black italic">{timeLeft}s Rest</span></div>
                <button onClick={() => setTimeLeft(null)} className="bg-black text-white px-6 py-2 rounded-full font-black uppercase text-xs">Skip</button>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* --- SUCCESS --- */}
        <AnimatePresence>
          {showSuccess && (
            <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
              <Trophy size={80} className="text-sky-400 mb-6" />
              <h2 className="text-6xl font-black italic uppercase mb-8">Workout Done!</h2>
              <button onClick={() => { setShowSuccess(false); setShowWorkouts(false); setCompleted([]); }} className="px-12 py-6 bg-white text-black font-black rounded-full uppercase italic">Go Home</button>
            </div>
          )}
        </AnimatePresence>

        {/* --- FLOATING BUBBLE --- */}
        {!showChat && <button onClick={() => setShowChat(true)} className="fixed bottom-8 right-6 w-16 h-16 bg-sky-400 rounded-full flex items-center justify-center shadow-lg shadow-sky-400/20"><MessageCircle size={24} className="text-black"/></button>}
      </main>
    </div>
  );
};

export default App;
