import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";

// CRITICAL: Ensure these paths are exactly correct for your new /src structure
import { copy, clientPrograms, languageNames } from './AriLogic';

const App = () => {
  // 1. Initial State
  const [lang, setLang] = useState<"en" | "es">("en");
  const [activeId, setActiveId] = useState(clientPrograms?.[0]?.id || 1);

  // 2. Data Preparation (Logic stays ABOVE the return)
  const t = copy?.[lang] || { heroText: "GluteSync", cta1: "Get Started" };
  const programs = clientPrograms || [];
  const activeProgram = programs.find(p => p.id === activeId) || programs[0];

  const handleButtonClick = (id: number) => {
    console.log("Button Clicked! ID:", id);
    setActiveId(id);
    // Optional: Scroll back to top to see the change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* 1. BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          autoPlay loop muted playsInline
          src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. INTERACTIVE UI LAYER */}
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
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
            value={lang}
            onChange={(e) => setLang(e.target.value as "en" | "es")}
          >
            <option value="en" className="bg-black">English</option>
            <option value="es" className="bg-black">Español</option>
          </select>
        </nav>

        {/* HERO SECTION - Now updates based on activeProgram */}
        <section className="flex-grow flex flex-col items-center justify-center text-center px-4 min-h-[70vh]">
          <motion.h1 
            key={activeId} // Key forces animation to reset on change
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-9xl font-black italic uppercase leading-none"
          >
            {/* If a program is selected, show its title; otherwise show the brand */}
            {activeId ? activeProgram.title : "GLUTESYNC"}
          </motion.h1>
          
          <p className="text-xl mt-4 max-w-xl font-bold text-gray-300">
            {activeId ? activeProgram.goal : t.heroText}
          </p>
          
          <button 
            onClick={() => document.getElementById('programs')?.scrollIntoView({behavior: 'smooth'})}
            className="mt-8 px-10 py-5 bg-sky-300 text-black font-black rounded-full uppercase tracking-widest hover:bg-white transition-all active:scale-95"
          >
            {t.cta1}
          </button>
        </section>

        {/* PROGRAM SELECTOR SECTION */}
        <section id="programs" className="p-6 md:p-12 max-w-6xl mx-auto w-full pb-24 bg-black/20">
          <h2 className="text-3xl font-black uppercase italic mb-8 border-l-4 border-sky-400 pl-4">
            Select Your Plan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
