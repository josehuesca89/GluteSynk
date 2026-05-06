import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";

// Ensure these imports match your AriLogic.ts exactly
import {
  copy,
  clientPrograms,
  trainingSchedules,
  languageNames,
} from './AriLogic';

const App = () => {
  console.log("Checking logic: App Component Started");

  const [lang, setLang] = useState<"en" | "es">("en");
  const t = copy?.[lang] || copy?.en || { heroText: "Welcome", cta1: "Start" };

  // Safety check for clientPrograms
  const programs = clientPrograms || [];
  const [activeProgramId, setActiveProgramId] = useState(programs[0]?.id || 1);
  const [trainingFrequency, setTrainingFrequency] = useState<2|3|4|5>(5);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const activeProgram = programs.find((p) => p.id === activeProgramId) || programs[0];

  // Logic to handle button clicks
  const handleProgramClick = (id: number, days: number) => {
    console.log(`Checking logic: Button ${id} clicked`);
    setActiveProgramId(id);
    setTrainingFrequency(days as any);
  };

  useEffect(() => {
    console.log("Checking logic: App is interactive and hydrated");
  }, []);

  return (
    <div className="min-h-screen bg-[#050a08] text-white">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          autoPlay loop muted playsInline
          src="https://videos.pexels.com/video-files/4367572/4367572-hd_1920_1080_30fps.mp4"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content Container - MUST be relative and high z-index */}
      <div className="relative z-50 flex flex-col min-h-screen">
        
        {/* Navigation */}
        <nav className="p-6 flex justify-between items-center bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Zap className="text-sky-400" />
            <span className="font-black text-2xl tracking-tighter">GLUTE<span className="text-sky-300">SYNC</span></span>
          </div>
          <select 
            className="bg-white/10 p-2 rounded-lg"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
          >
            <option value="en" className="bg-black">English</option>
            <option value="es" className="bg-black">Español</option>
          </select>
        </nav>

        {/* Hero Section */}
        <section className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black italic uppercase leading-none"
          >
            GLUTE<span className="text-sky-300">SYNC</span>
          </motion.h1>
          <p className="text-xl mt-4 max-w-xl font-bold text-gray-300">{t.heroText}</p>
          <button 
            onClick={() => console.log("Checking logic: Hero CTA clicked")}
            className="mt-8 px-8 py-4 bg-sky-300 text-black font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform"
          >
            {t.cta1}
          </button>
        </section>

        {/* Programs Section */}
        <section className="p-8 max-w-6xl mx-auto w-full mb-20">
          <h2 className="text-3xl font-black mb-8 uppercase italic">Choose Your Path</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => (
              <button
                key={program.id}
                onClick={() => handleProgramClick(program.id, program.days)}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  activeProgramId === program.id 
                    ? "bg-sky-500/30 border-sky-400 scale-[1.02]" 
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <span className="text-sky-400 text-xs font-bold uppercase">{program.days} Days</span>
                <h3 className="text-xl font-black">{program.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{activeProgramId === program.id ? activeProgram?.outcome : program.goal}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
