import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";

// CRITICAL: Ensure these paths are exactly correct for your new /src structure
import { copy, clientPrograms, languageNames } from './AriLogic';

const App = () => {
  // 1. Initial State with safety fallbacks
  const [lang, setLang] = useState<"en" | "es">("en");
  const [activeId, setActiveId] = useState(clientPrograms?.[0]?.id || 1);

  // 2. Safety check: If AriLogic failed to load, don't crash the app
  const t = copy?.[lang] || { heroText: "GluteSync", cta1: "Get Started" };
  const programs = clientPrograms || [];

  const handleButtonClick = (id: number) => {
    console.log("Button Clicked! ID:", id);
    setActiveId(id);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      
{/* 1. BACKGROUND LAYER - Added pointer-events-none to stop it from blocking clicks */}
<div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
  <video
    className="absolute inset-0 h-full w-full object-cover opacity-40"
    autoPlay loop muted playsInline
    src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4"
  />
  <div className="absolute inset-0 bg-black/40" />
</div>

{/* 2. CONTENT LAYER - Using your branding */}
<section className="relative z-50 flex-grow flex flex-col items-center justify-center text-center px-4">
  <motion.h1 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-7xl md:text-9xl font-black italic uppercase leading-none"
  >
    GLUTE<span className="text-sky-300">SYNC</span>
  </motion.h1>
  <p className="text-xl mt-4 max-w-xl font-bold text-gray-300">{t.heroText}</p>
  
  {/* Added a console log here to test responsiveness */}
  <button 
    onClick={() => {
      console.log("Button is working!");
      document.getElementById('programs')?.scrollIntoView({behavior: 'smooth'});
    }}
    className="relative z-[60] mt-8 px-10 py-5 bg-sky-300 text-black font-black rounded-full uppercase tracking-widest hover:bg-white transition-all active:scale-95"
  >
    {t.cta1}
  </button>
</section>

      {/* INTERACTIVE UI LAYER (z-50) */}
      <main className="relative z-50 min-h-screen flex flex-col">
        
        {/* Navigation */}
        <nav className="p-6 flex justify-between items-center backdrop-blur-md bg-black/30">
          <div className="flex items-center gap-2">
            <Zap className="text-sky-400 w-8 h-8" />
            <span className="text-2xl font-black italic tracking-tighter uppercase">
              GLUTE<span className="text-sky-400">SYNC</span>
            </span>
          </div>
          
          <select 
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
            value={lang}
            onChange={(e) => setLang(e.target.value as "en" | "es")}
          >
            <option value="en" className="bg-black">English</option>
            <option value="es" className="bg-black">Español</option>
          </select>
        </nav>

        {/* Hero Section */}
        <section className="flex-grow flex flex-col items-center justify-center px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black italic uppercase leading-[0.8]"
          >
            THE <span className="text-sky-400">METHOD</span>
          </motion.h1>
          <p className="mt-6 text-lg md:text-xl font-medium text-gray-300 max-w-2xl">
            {t.heroText}
          </p>
          <button 
            onClick={() => document.getElementById('programs')?.scrollIntoView({behavior: 'smooth'})}
            className="mt-10 px-10 py-5 bg-sky-400 text-black font-black rounded-full uppercase tracking-widest hover:bg-white transition-colors"
          >
            {t.cta1}
          </button>
        </section>

        {/* Program Selector */}
        <section id="programs" className="p-6 md:p-12 max-w-6xl mx-auto w-full pb-24">
          <div className="grid md:grid-cols-2 gap-4">
            {programs.map((p) => (
              <button
                key={p.id}
                onClick={() => handleButtonClick(p.id)}
                className={`p-8 rounded-3xl border-2 text-left transition-all duration-300 ${
                  activeId === p.id 
                    ? "bg-sky-500/20 border-sky-400 ring-4 ring-sky-400/20" 
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="text-sky-400 font-bold text-xs uppercase mb-2">{p.days} Day Split</div>
                <h3 className="text-2xl font-black uppercase italic">{p.title}</h3>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">{p.goal}</p>
              </button>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;
