import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-zinc-950 text-slate-100 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦍</span> {/* Replace with your actual logo image later */}
            <span className="font-black text-xl tracking-wider text-orange-500">
              GLUTESYNC
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <a href="#dashboard" className="hover:text-orange-500 transition-colors">Dashboard</a>
            <a href="#workouts" className="hover:text-orange-500 transition-colors">Workouts</a>
            <a href="#ebooks" className="hover:text-orange-500 transition-colors">Guides & Ebooks</a>
            <button className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold px-4 py-2 rounded-lg transition-all transform active:scale-95">
              Join Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 pt-2 pb-4 space-y-3 shadow-xl">
          <a href="#dashboard" className="block text-lg py-2 hover:text-orange-500" onClick={() => setIsOpen(false)}>Dashboard</a>
          <a href="#workouts" className="block text-lg py-2 hover:text-orange-500" onClick={() => setIsOpen(false)}>Workouts</a>
          <a href="#ebooks" className="block text-lg py-2 hover:text-orange-500" onClick={() => setIsOpen(false)}>Guides & Ebooks</a>
          <button className="w-full bg-orange-500 text-zinc-950 font-bold py-3 rounded-xl transition-colors">
            Join Now
          </button>
        </div>
      )}
    </nav>
  );
}
