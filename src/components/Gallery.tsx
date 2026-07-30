import { useState } from 'react';
import { X, Clock, Activity, BookOpen, Dumbbell, Apple, Heart } from 'lucide-react';

interface GalleryItem {
  id: number;
  type: 'workout' | 'meal' | 'stretch';
  title: string;
  duration?: string;
  difficulty?: string;
  info?: string;
  macro?: string;
  target?: string;
  img: string;
  description: string;
  steps: string[];
}

const galleryData: GalleryItem[] = [
  // --- WORKOUTS ---
  { 
    id: 1, 
    type: 'workout', 
    title: 'Glute Isolation Burn', 
    duration: '35 min', 
    difficulty: 'Intermediate', 
    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500',
    description: 'A laser-focused routine built specifically to target the gluteus maximus and medius using sustained time-under-tension.',
    steps: ['10 Glute Bridges (Hold 2s at top)', '15 Donkey Kicks per side', '12 Fire Hydrants with pulses', 'Repeat for 3-4 rounds']
  },
  { 
    id: 2, 
    type: 'workout', 
    title: 'Lower Body Power Build', 
    duration: '50 min', 
    difficulty: 'Advanced', 
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
    description: 'Heavy strength day designed to build dense muscle mass and raw power through foundational compound movements.',
    steps: ['Goblet Squats (4 sets x 8 reps)', 'Romanian Deadlifts (4 sets x 10 reps)', 'Walking Lunges (3 sets x 12 steps)', 'Rest 90 seconds between sets']
  },
  { 
    id: 3, 
    type: 'workout', 
    title: 'Home Booty Band Express', 
    duration: '20 min', 
    difficulty: 'Beginner', 
    img: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=500',
    description: 'No gym required. This high-paced burnout routine relies entirely on resistance bands to fire up the lower body layout.',
    steps: ['Banded Lateral Walks (20 steps left/right)', 'Banded Squat to Abduction (15 reps)', 'Seated Banded Abductions (30 reps)', 'Complete with minimal rest']
  },

  // --- MEALS ---
  { 
    id: 4, 
    type: 'meal', 
    title: 'High-Protein Proats', 
    info: '420 kcal', 
    macro: '35g Protein', 
    img: 'https://images.unsplash.com/photo-1517686469429-8faf88b9f7af?w=500',
    description: 'The ultimate morning fuel. Complex carbohydrates blended smoothly with fast-absorbing whey protein for elite muscle recovery.',
    steps: ['Microwave 1/2 cup of rolled oats with water/milk', 'Stir in 1 scoop of your favorite protein powder', 'Top with a handful of fresh berries', 'Drizzle 1 tsp of honey or almond butter']
  },
  { 
    id: 5, 
    type: 'meal', 
    title: 'Post-Workout Fuel Bowl', 
    info: '580 kcal', 
    macro: '45g Protein', 
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    description: 'A clean, nutrient-dense muscle-building balance consisting of lean poultry, easily digestible white rice, and micro-nutrients.',
    steps: ['150g Grilled chicken breast cubed', '1 cup of steamed Jasmine rice', 'Side of air-fried broccoli or asparagus', 'Season with coconut aminos or hot sauce']
  },
  { 
    id: 6, 
    type: 'meal', 
    title: 'Lean Green Power Salad', 
    info: '310 kcal', 
    macro: '28g Protein', 
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    description: 'A crisp, low-calorie volume meal packed tight with plant-based fibers, healthy fats, and clean protein macros.',
    steps: ['Base of chopped kale and baby spinach', 'Top with 100g of grilled shrimp or lean tofu', 'Add 1/4 sliced avocado and cucumber slices', 'Toss lightly with lemon juice and olive oil']
  },

  // --- STRETCHES ---
  { 
    id: 7, 
    type: 'stretch', 
    title: 'Deep Hip Opener Flow', 
    duration: '12 min', 
    target: 'Flexibility', 
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    description: 'Targets tight hip flexors and deep glute channels to dramatically optimize overall athletic range of motion.',
    steps: ['Pigeon Pose (Hold 60s per side)', 'Lizard Lunge with gentle rotation', 'Frog Pose dynamic rocks', 'Focus on deep, deep belly breathing']
  },
  { 
    id: 8, 
    type: 'stretch', 
    title: 'Lower Back Relief', 
    duration: '10 min', 
    target: 'Recovery', 
    img: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=500',
    description: 'Decompresses the lumbar spine and releases unwanted tension trailing down from long hours or hard loading days.',
    steps: ['Childs Pose into Cobra stretch flow', 'Cat-Cow fluid movements (10 reps)', 'Supine Spinal Twist (45s per side)', 'Keep movements soft and controlled']
  },
  { 
    id: 9, 
    type: 'stretch', 
    title: 'Full Body Reset', 
    duration: '15 min', 
    target: 'Mobility', 
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500',
    description: 'An all-encompassing fluid mobility scheme to lubricate stiff joints and jumpstart whole-body blood circulation.',
    steps: ['Deep Bodyweight Squat hold (60s)', 'Worlds Greatest Stretch (5 reps per side)', 'Downward Dog to Cobra transitions', 'Shake out limbs fully upon completion']
  },
];

// Age-friendly mapping object for clear iconography and presentation names
const categoryMapping = {
  all: { label: "All Content", color: "bg-white text-black border-white", icon: BookOpen },
  workout: { label: "Workouts & Routines", color: "bg-sky-400 text-black border-sky-400", icon: Dumbbell },
  meal: { label: "Meals & Nutrition", color: "bg-orange-500 text-black border-orange-500", icon: Apple },
  stretch: { label: "Recovery & Stretches", color: "bg-purple-500 text-white border-purple-500", icon: Heart }
};

interface GalleryProps {
  filter?: "all" | "workout" | "meal" | "stretch";
}

export default function Gallery({ filter = "all" }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>(filter);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredData = activeFilter === 'all' 
    ? galleryData 
    : galleryData.filter(item => item.type === activeFilter);

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Age-Friendly Visual Layout Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 justify-start">
        {(Object.keys(categoryMapping) as Array<keyof typeof categoryMapping>).map((type) => {
          const config = categoryMapping[type];
          const IconComponent = config.icon;
          const isSelected = activeFilter === type;
          
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border duration-200 ${
                isSelected 
                  ? config.color + " shadow-xl" 
                  : "bg-zinc-900/50 text-white/70 border-white/5 hover:bg-zinc-900/80 hover:text-white"
              }`}
            >
              <IconComponent size={15} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Card Layout with Enhanced Text Spacing & Readability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="group border border-white/10 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer flex flex-col h-full"
          >
            <div className="relative h-52 w-full overflow-hidden bg-white/5">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-zinc-900/90 text-white border border-white/10 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md backdrop-blur-sm">
                {item.type}
              </span>
            </div>
            
            <div className="p-6 text-left flex flex-col flex-grow justify-between">
              <h3 className="font-black text-2xl italic uppercase tracking-tight text-white leading-tight group-hover:text-sky-400 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 mt-4 pt-4 border-t border-white/5">
                <span className="text-sky-400 bg-sky-400/10 px-2 py-1 rounded-md">{item.duration || item.info}</span>
                <span className="text-white/60 bg-white/5 px-2 py-1 rounded-md">{item.difficulty || item.macro || item.target}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- ACCESSIBLE DETAILS BACKDROP MODAL --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Header Sticky Banner */}
            <div className="relative h-56 w-full shrink-0 bg-zinc-800">
              <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors backdrop-blur-sm shadow-lg border border-white/10"
                aria-label="Close modal window"
              >
                <X size={20} />
              </button>
              <span className="absolute bottom-4 left-5 bg-sky-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg font-sans">
                {selectedItem.type}
              </span>
            </div>

            {/* Scrollable Context Body to prevent cut-offs on small screens */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <h3 className="text-3xl font-black italic uppercase tracking-tight text-white mb-2 leading-none">
                {selectedItem.title}
              </h3>

              {/* High Contrast Badges */}
              <div className="flex gap-4 mb-5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{selectedItem.duration || selectedItem.info}</span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                  <Activity size={14} />
                  <span>{selectedItem.difficulty || selectedItem.macro || selectedItem.target}</span>
                </div>
              </div>

              {/* Accessible Summary Text */}
              <p className="text-white/80 text-base leading-relaxed mb-6 font-medium">
                {selectedItem.description}
              </p>

              {/* Big Target Execution Steps */}
              <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">
                How to execute:
              </h4>
              <ul className="space-y-3">
                {selectedItem.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-sm text-white/90 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 border border-sky-400/20 text-xs font-black text-sky-400">
                      {idx + 1}
                    </span>
                    <span className="font-semibold leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
