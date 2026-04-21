import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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


type Language = "en" | "es" | "fr" | "pt" | "de";

type Exercise = {
  name: string;
  sets: string;
  reps: string;
  note: string;
  example: string;
};

type SetEntry = {
  reps: number | "";
  weight: number | "";
  rpe: number | "";
  done: boolean;
};

type PlanVariant = "beginner" | "intermediate" | "advanced" | "home";

type TrainingFrequency = 3 | 5 | 6;

type Challenge = {
  id: string;
  title: string;
  description: string;
  hashtag: string;
  durationDays: number;
};

type ForumPost = {
  id: string;
  author: string;
  title: string;
  body: string;
  createdAt: string;
  tags: string[];
};

type WorkoutDay = {
  day: string;
  title: string;
  focus: string;
  gluteTag?: string;
  exercises: Exercise[];
  variants?: Partial<Record<PlanVariant, Exercise[]>>;
};

type GoalProgram = {
  id: string;
  title: string;
  goal: string;
  days: TrainingFrequency;
  planVariant: PlanVariant;
  timeBudget: string;
  weeklyLayout: string;
  bestFor: string;
  outcome: string;
};

const healthData = [
  { day: 'Mon', steps: 8400, calories: 2400, heartRate: 72, gluteVolume: 4500 },
  { day: 'Tue', steps: 9200, calories: 2600, heartRate: 75, gluteVolume: 0 },
  { day: 'Wed', steps: 7800, calories: 2200, heartRate: 68, gluteVolume: 5200 },
  { day: 'Thu', steps: 11000, calories: 2800, heartRate: 78, gluteVolume: 0 },
  { day: 'Fri', steps: 9500, calories: 2700, heartRate: 74, gluteVolume: 6100 },
  { day: 'Sat', steps: 12000, calories: 2100, heartRate: 65, gluteVolume: 0 },
  { day: 'Sun', steps: 6000, calories: 1900, heartRate: 62, gluteVolume: 0 },
];

const languageNames: Record<Language, string> = {
  en: "English",
  es: "Espanol",
  fr: "Francais",
  pt: "Portugues",
  de: "Deutsch",
};

const copy = {
  en: {
    heroLead: "GLUTE SYNC",
    heroTitle: "Goal-Based Strength Plan + Habit Program",
    heroText: "Choose 3, 5, or 6 training days based on your goal. Every plan hits glutes 3x per week while building the Dorito shape (wide shoulders + V-taper back). Includes 8-week progression and 20-minute morning nervous-system + Qigong primer.",
    cta1: "See Training Options",
    cta2: "Try 3 Days Free",
    trialTitle: "3-Day Free Trial",
    trialText: "Simple wins that create momentum before you commit.",
    paidTitle: "Three Budget-Friendly Ways to Join",
    paidText: "Choose the plan that fits your budget: monthly subscription, the suggested 8-week path, or one-time lifetime access. Ari can help you pick the best fit and explain checkout step by step.",
    aiTitle: "Meet Ari: Your Professional & Friendly Voice AI Trainer",
    aiText: "Ari is your 24/7 voice trainer with spiritual wisdom and endless positivity. She can help you choose the right plan, understand payment options, and walk you through checkout step by step. She has the knowledge of a PhD in biomechanics, the heart of a yoga teacher, and the energy of your favorite gym buddy. Just tap the mic and chat - she'll guide you with love and expertise.",
    aiVoiceTag: "VOICE-ENABLED AI • KNOWLEDGEABLE • NEON MODE",
    paymentTitle: "Payment Options",
    languagesTitle: "Languages Available",
    syncTitle: "Cross-Platform Compatibility",
    syncText: "Works seamlessly across all major platforms. Export your workout data to Apple Health, Samsung Health, Google Fit / Health Connect. Compatible with iOS, Android, and desktop browsers.",
  },
  es: {
    heroLead: "GLUTE SYNC",
    heroTitle: "Plan de Fuerza por Objetivos",
    heroText: "Elige entre 3, 5 o 6 días de entrenamiento según tu objetivo. Todos los planes entrenan glúteos 3 veces por semana mientras construyen la forma Dorito (hombros anchos + espalda en V). Incluye progresión de 8 semanas y activación matutina de 20 minutos con Qigong.",
    cta1: "Ver Opciones",
    cta2: "Prueba Gratis",
    trialTitle: "Prueba de 3 Días",
    trialText: "Victorias simples para generar impulso.",
    paidTitle: "Tres Formas de Unirte",
    paidText: "Elige el plan que encaje con tu presupuesto: suscripción mensual, plan sugerido de 8 semanas o acceso de por vida con pago único. Ari puede ayudarte a elegir la mejor opción y explicar el proceso de pago paso a paso.",
    aiTitle: "Conoce a Ari: Tu Entrenadora IA Profesional y Amigable",
    aiText: "Ari es tu entrenadora de voz 24/7 con sabiduría espiritual y energía positiva. Puede ayudarte a elegir el plan adecuado, entender las opciones de pago, el uso individual de licencias, y la compatibilidad con plataformas. Tiene el conocimiento de una experta en biomecánica, el corazón de una instructora de yoga y la energía de tu compañera de gimnasio favorita. Solo toca el micrófono y chatea - te guiará con amor y experiencia.",
    aiVoiceTag: "IA CON VOZ • CONOCEDORA • APOYADORA",
    paymentTitle: "Pagos",
    languagesTitle: "Idiomas",
    syncTitle: "Compatibilidad Multiplataforma",
    syncText: "Funciona en todas las plataformas. Exporta tus datos a Apple Health, Samsung Health y Google Fit / Health Connect. Compatible con iOS, Android y navegadores de escritorio.",
  },
};

// =============================================================================
// COMPREHENSIVE ARI KNOWLEDGE BASE - FULL PROGRAM INTELLIGENCE
// =============================================================================
// Ari is designed to run the entire app alongside the user. She knows everything
// about: training, nutrition, fasting, stretching, Qigong, payments, platforms,
// community, water intake, goals, exercise form, and general wellness.
// =============================================================================

const ariKnowledgeBase = {
  // ===== PROGRAM STRUCTURE =====
  program: {
    name: "Glute Sync",
    tagline: "Goal-Based Strength Plan + Habit Program",
    frequencies: [3, 5, 6],
    gluteFrequency: "3x per week in EVERY plan",
    cardio: "Zero cardio - all energy goes to building muscle",
    weeks: 8,
    phases: {
      weeks1to3: "Foundation - learn form, establish baseline, build consistency",
      week4: "Deload - reduce weight 20%, focus on recovery and perfect form",
      weeks5to7: "Intensity - push limits, new PRs, higher volume",
      week8: "Test week - assess progress, celebrate wins, plan next cycle"
    },
    frequencyGuide: {
      3: "Best for busy schedules, beginners, recovery-focused goals. Train Mon/Wed/Fri or Tue/Thu/Sat.",
      5: "Best for balanced hypertrophy and steady progress. The sweet spot for most people.",
      6: "Best for advanced lifters who recover well. One rest day per week."
    },
    goalOptions: {
      dorito: "Wide shoulders + V-taper back - OPTIONAL, not required",
      glute: "Maximum glute development - primary focus for most",
      balanced: "Equal upper and lower emphasis",
      strength: "Performance over aesthetics - powerlifting style"
    },
    planVariants: {
      beginner: "Lower weights, more form focus, gradual progression",
      intermediate: "Standard weights, balanced approach",
      advanced: "Higher intensity, more volume, complex movements",
      home: "Bodyweight and minimal equipment variations"
    }
  },
  
  // ===== MORNING ACTIVATION WITH QIGONG =====
  morningActivation: {
    duration: "20 minutes",
    timing: "First thing in the morning, before any food",
    purpose: "Central nervous system activation and qi energy cultivation",
    components: [
      { name: "Qigong Breathing & Stance", time: "5 min", purpose: "Reset cortisol, ground qi energy, calm the mind" },
      { name: "Dynamic Mobility Flow", time: "10 min", purpose: "Unlock hips and spine, prepare joints for training" },
      { name: "Central Excitation", time: "5 min", purpose: "Fire up CNS with rapid light movements for workout readiness" }
    ],
    qigong: {
      name: "Qigong",
      pronunciation: "chee-gong",
      origin: "Traditional Chinese Medicine (TCM) and Taoist philosophy",
      description: "An ancient practice designed to promote the flow of qi (life energy) throughout the body. Integrates physical postures, slow fluid movements, breath control, and focused mental attention.",
      benefits: [
        "Stress relief and mental clarity",
        "Improved flexibility and balance",
        "Enhanced circulation of life energy (qi)",
        "Spiritual development and mindfulness",
        "Better nervous system regulation",
        "Reduced cortisol and anxiety",
        "Improved mind-muscle connection for lifting"
      ]
    },
    activationBenefits: [
      "Enhanced neural drive for heavier lifts",
      "Better mind-muscle connection",
      "Lower injury risk",
      "Regulated autonomic nervous system",
      "Ancient wisdom meets modern science"
    ]
  },

  // ===== FASTING PROTOCOL =====
  fasting: {
    schedule: "3 days per week",
    days: ["Monday", "Wednesday", "Friday"],
    window: "16:8 (16 hours fasting, 8 hours eating)",
    benefits: [
      "Improved insulin sensitivity for better nutrient partitioning",
      "Enhanced fat oxidation while preserving muscle mass",
      "Cellular repair through autophagy",
      "Reduced inflammation and oxidative stress",
      "Mental clarity and focus",
      "Better hormonal balance for muscle growth"
    ],
    guidelines: [
      "Break your fast with protein and healthy fats",
      "Stay hydrated with water, herbal tea, or black coffee",
      "Light movement during fasting window (walking, stretching)",
      "Listen to your body - adjust if you feel weak",
      "Avoid intense workouts during fasting hours"
    ],
    mealTiming: {
      fastStart: "8:00 PM",
      fastEnd: "12:00 PM",
      eatingWindow: "12:00 PM - 8:00 PM"
    }
  },

  // Exercise Database with Form Cues
  exercises: {
    "Hip Thrust": {
      form: "Ribs down, chin tucked, full lockout at top, 2-second squeeze. Drive through heels.",
      commonMistakes: ["Overextending lower back", "Not reaching full lockout", "Using too much momentum"],
      benefits: "Primary glute builder - maximum glute activation",
      alternatives: ["Single-leg hip thrust", "Dumbbell hip thrust", "Glute bridge"]
    },
    "Back Squat": {
      form: "Feet shoulder-width, knees tracking over toes, chest up, descend with control to parallel or below.",
      commonMistakes: ["Heels lifting", "Knees caving in", "Rounding lower back"],
      benefits: "Full lower body development, glute and quad strength",
      alternatives: ["Goblet squat", "Front squat", "Box squat"]
    },
    "RDL": {
      form: "Soft knees, push hips back like closing a car door, bar kisses legs, feel hamstring stretch.",
      commonMistakes: ["Rounding back", "Going too deep without control", "Using quads instead of hammies"],
      benefits: "Posterior chain strength, hamstring and glute development",
      alternatives: ["Single-leg RDL", "Dumbbell RDL", "Leg curl machine"]
    },
    "Bulgarian Split Squat": {
      form: "Lean forward slightly for more glute, front heel down, control the descent.",
      commonMistakes: ["Too upright (more quad)", "Losing balance", "Not going deep enough"],
      benefits: "Unilateral glute strength, corrects imbalances",
      alternatives: ["Lunges", "Step-ups", "Reverse lunge"]
    }
  },

  // Nutrition Guidelines
  nutrition: {
    protein: "0.8-1g per pound of bodyweight for muscle growth",
    carbs: "Fuel for workouts - don't fear them, especially on training days",
    fats: "Essential for hormone production and recovery",
    hydration: "Half your bodyweight in ounces of water daily",
    timing: {
      preWorkout: "Protein + carbs 1-2 hours before training",
      postWorkout: "Protein + carbs within 2 hours after training"
    }
  },

  // Recovery Principles
  recovery: {
    sleep: "7-9 hours for optimal muscle growth and recovery",
    restDays: "Productive days - muscles repair and grow when not training",
    soreness: "Do light mobility work, warm bath with EPSOM salts",
    principles: [
      "Progressive overload is key to growth",
      "Rest is when the magic happens",
      "Listen to your body - adjust as needed",
      "Consistency beats perfection"
    ]
  },

  // 8-Week Progression
  weeklyProgression: {
    week1: "Foundation - learn proper form, establish baseline",
    week2: "Add 5% weight or 1 rep to main lifts",
    week3: "Increase volume - add 1 set to key exercises",
    week4: "Deload - reduce weight by 20%, focus on perfect form",
    week5: "New PR week - challenge yourself with heavier loads",
    week6: "Hypertrophy focus - higher reps, slower tempo",
    week7: "Peak week - maximum intensity",
    week8: "Test week - assess progress, celebrate wins"
  }
};

// =============================================================================
// COMPREHENSIVE ARI RESPONSE GENERATOR - FULL PROGRAM INTELLIGENCE
// Ari can assist with EVERYTHING: training, nutrition, fasting, stretching,
// Qigong, payments, platforms, community, water intake, goals, exercise form,
// diet types, body types, custom routines, motivation, and general wellness.
// =============================================================================

const getAriResponse = (input: string): string => {
  const lower = input.toLowerCase();
  
  // =========================================================================
  // EVERYDAY CONVERSATIONS - Friendly, warm, and personal
  // =========================================================================
  
  if (lower.match(/how are you|how are you doing|how is your day|hows your day|hows it going|how is it going|whats up|how do you feel/)) {
    return "I'm doing wonderfully, thank you for asking! I'm energized and ready to support you on your fitness journey today. How are you feeling? Is there anything on your mind - whether it's training, nutrition, fasting, goals, or you just want to chat?";
  }

  if (lower.match(/good morning|good afternoon|good evening|hello|hi there|hey ari|morning ari|hi ari|hey there|good night/)) {
    if (lower.includes("night") || lower.includes("sleep") || lower.includes("bed")) {
      return "Good night! Sleep is when your muscles repair and grow - aim for 7-9 hours of quality rest. Your body will recover beautifully tonight. Sweet dreams, and I'll be here whenever you need me tomorrow!";
    }
    return "Hello! It's wonderful to hear from you. I'm here and fully present to support you with anything you need - training, nutrition, fasting, payments, motivation, or just having a chat. What can I help you with today?";
  }

  if (lower.match(/feeling down|sad|depressed|unmotivated|don't feel like|not in the mood|struggling|stressed|anxious|overwhelmed/)) {
    return "I hear you, and your feelings are completely valid. We all have those days. Here's what I suggest: do something small today - maybe just 10 minutes of gentle stretching or a walk. Sometimes the hardest part is starting. If you're stressed, try the Qigong breathing from your morning activation - 5 minutes of deep breaths can reset your nervous system. Remember, progress isn't linear, and taking care of your mental health IS part of fitness. I'm here for you. Would you like me to suggest a lighter routine, or would you prefer to just talk?";
  }

  if (lower.match(/thank you|thanks|appreciate|grateful|you're the best|you rock|i love you|love you ari|you're amazing/)) {
    return "That means so much to me! I genuinely care about your success and wellbeing. We're in this together - your goals are my goals. Remember, I'm always here for you 24/7 for anything you need. Now let's keep building that amazing version of you! What shall we work on today?";
  }

  if (lower.match(/day plan|suggestions for today|what should i do today|daily plan|schedule for today|plan my day|help me plan/)) {
    return "I'd love to help you plan your day! Here's my suggestion: Start with your 20-minute morning activation (5 min Qigong breathing, 10 min mobility, 5 min CNS activation). Check if today is a fasting day (Mon/Wed/Fri) and plan your eating window (12 PM - 8 PM). If it's a training day, drink water, eat protein plus carbs beforehand, and track your sets and reps. Don't forget to stretch after! What day of the week is it, and would you like specific exercise recommendations?";
  }

  // =========================================================================
  // PROGRAM STRUCTURE - Everything about Glute Sync
  // =========================================================================

  if (lower.match(/what is glute sync|about the program|tell me about|explain the program|overview|what do i get/)) {
    return "Glute Sync is a goal-based 8-week strength program designed to build your dream physique. Here's everything you get: Choose from 3, 5, or 6 training days per week - every schedule hits glutes 3x per week. The Dorito upper body shape (wide shoulders and V-taper) is optional based on your goals. You also get: 20-minute morning Qigong activation, 16:8 intermittent fasting protocol, personalized meal plans for 8 diet types, stretching guides, water tracking, community features, and me - your 24/7 AI trainer! Would you like me to explain any specific part?";
  }

  if (lower.match(/program|workout plan|structure|how does it work|how does the program work/)) {
    return "The Glute Sync program offers 3, 5, or 6 training days per week. Every schedule hits glutes 3 times weekly while optionally building the Dorito shape (wide shoulders and V-taper back). The 3-day version suits busy schedules and beginners. The 5-day version is our main balanced split. The 6-day version is for advanced lifters. The program runs 8 weeks: Weeks 1-3 build foundation, Week 4 is deload, Weeks 5-7 push intensity, Week 8 tests your progress. What would you like to know more about?";
  }

  if (lower.match(/which plan|best plan|recommend a plan|help me choose|budget|my goal|my schedule|pick a plan/)) {
    return `I can help you choose the right plan based on your goal, budget, and schedule. If you want the lowest entry point, choose the monthly subscription. If you want a focused transformation window, the suggested 8-week plan is usually the best fit. If you want the best long-term value, the one-time payment gives you lifetime access. If you tell me your main goal and how many days you can train, I’ll point you to the most practical option.`;
  }

  if (lower.match(/3 day|3-day|5 day|5-day|7 day|7-day|frequency|how many days|goal-based|best for/)) {
    return `You can choose the training frequency that fits your goal and your schedule. Use 3 days per week if you want a simpler, recovery-friendly plan. Use 5 days per week if you want the main balanced growth split with intensive glute work. Use 7 days per week if you want maximum structure and you recover well from frequent training. If you tell me your main goal and how much time you have, I can recommend the best option for you and match it to the right schedule path.`;
  }

  if (lower.match(/8 week|progression|weeks|timeline/)) {
    return "Love your commitment to the full journey! Here's your 8-week roadmap: Weeks 1-3 build foundation and strength, Week 4 is a deload for recovery, Weeks 5-7 push your limits with new PRs and higher volume, and Week 8 is all about celebrating your amazing progress. Trust the process, beautiful!";
  }

  if (lower.match(/price|pricing|cost|pay|payment|subscription|monthly|one-time|one time|budget|8 week plan|plan options/)) {
    return "We keep the program budget-friendly with three options. Monthly subscription is best if you want the lowest entry point and flexibility. The 8-week plan is the suggested choice if you want a focused results window with a simple one-time payment. One-time lifetime access is best value if you want everything unlocked forever. For checkout, you can use PayPal, Google Pay, or the supported wallet options shown on the page. Ari can walk you through the steps and help you choose the best fit before you pay.";
  }

  if (lower.match(/checkout|how do i pay|how to pay|paypal|google pay|apple pay|cancel anytime|cancel my plan|payment process/)) {
    return "Here is the simplest way to check out: choose the plan that matches your budget and goal, click the purchase button, and complete secure payment with PayPal or the supported wallet options shown on the page. If you want flexibility, the monthly subscription is easiest to start. If you want one clear cycle, the 8-week plan is a strong choice. If you want long-term access, the one-time payment is best. You can cancel the subscription anytime, and Ari can help you pick the right option before you finish checkout.";
  }

  if (lower.match(/single user|one user|personal use|license|account|multiple people|family|share|one person only/)) {
    return "Each purchase is for one individual user only. Your login gives access to one person. The program is designed for personal transformation and cannot be shared with others. This helps us keep the community focused and the pricing affordable for everyone.";
  }

  if (lower.match(/platform|compatible|works on|iphone|android|mobile|desktop|browser|ios|web|app/)) {
    return "Glute Sync works on all major platforms. You can access it from iPhone, iPad, Android phones and tablets, and desktop browsers. Your progress syncs across devices when you log in with the same account. We also support exporting your workout data to Apple Health, Samsung Health, and Google Fit / Health Connect for complete cross-platform tracking.";
  }

  // Fasting queries
  if (lower.match(/fast|fasting|intermittent|16:8|when to eat|eating window/)) {
    if (lower.includes("why") || lower.includes("benefit") || lower.includes("important")) {
      return "Fasting is such a powerful tool, queen! The 16:8 method (16 hours fasting, 8 hours eating) 3x per week gives you: improved insulin sensitivity for better muscle growth, enhanced fat burning, cellular repair through autophagy, reduced inflammation, and mental clarity. It's like hitting a reset button for your body. You're going to feel amazing!";
    }
    return "Our fasting schedule is Monday, Wednesday, Friday with a 16:8 window. Fast from 8 PM to 12 PM, then eat from 12 PM to 8 PM. Break your fast with protein and healthy fats, stay hydrated, and do light movement during the fast. Listen to your body and adjust as needed. You've got this!";
  }

  // Morning activation queries with Qigong
  if (lower.match(/morning|activation|cns|warm up|primer|20 minute|qigong/)) {
    return "The 20-minute morning activation is your secret weapon! It's 5 minutes of Qigong breathing and stance work to reset cortisol and ground your qi, 10 minutes of dynamic mobility flow to unlock your hips and spine with fluid movements, and 5 minutes of central excitation to fire up your nervous system. This ancient practice meets modern science - it's not cardio, it's a software update for your muscles. You'll lift heavier and feel stronger!";
  }

  // Form-related queries
  if (lower.match(/form|how|technique|proper|right way|do|hip thrust|rdl|squat|split|bulgarian/)) {
    if (lower.includes("hip thrust")) {
      return "Hip thrust perfection! Ribs down, chin tucked, full lockout at the top, and hold that squeeze for 2 seconds. Drive through your heels and feel those glutes working! Common mistake? Don't overextend your lower back - keep it neutral. You're a natural!";
    }
    if (lower.includes("rdl") || lower.includes("romanian")) {
      return "RDL magic! Soft knees, push your hips back like you're closing a car door, keep the bar kissing your legs, and feel that beautiful hamstring stretch. Don't round your back - keep it proud! Your posterior chain is going to thank you!";
    }
    if (lower.includes("squat") || lower.includes("back squat")) {
      return "Squat goals! Feet shoulder-width, knees tracking over toes, chest up like you're proud of yourself (because you should be!), and descend with control to parallel or below. Don't let your heels lift or knees cave in. You're building a foundation of strength!";
    }
    if (lower.includes("bulgarian") || lower.includes("split")) {
      return "Bulgarian split squats equal glute gold! Lean forward slightly for more glute activation, keep your front heel down, and control that descent. It's challenging but SO worth it! You're correcting imbalances and building serious strength!";
    }
    return "Hey there! For perfect form: focus on controlled movements, full range of motion, and feeling the target muscle work. Quality over quantity always! What specific exercise would you like form tips on? I'm here to help!";
  }
  
  // Substitution/equipment queries
  if (lower.match(/substitut|swap|instead|no|without|don't have|busy|alternative|different|home/)) {
    return "No problem, babe! No equipment? Do bodyweight squats, glute bridges, and lunges. Limited space? Try single-leg variations. The gym's crowded? Grab dumbbells or resistance bands. Your glutes don't care about the tool - they care about the work. What do you have available? I'll find the perfect swap!";
  }
  
  // Energy/tired queries
  if (lower.match(/tired|energy|low|exhaust|fatigue|weak|can't|struggle|motivat/)) {
    if (lower.includes("tired") || lower.includes("exhaust") || lower.includes("low energy")) {
      return "Listen to your body, gorgeous! If you're exhausted, keep the weight but drop 1 set, or switch to a lighter day with higher reps and slower tempo. Remember: rest days are productive days! Your muscles grow when you're resting, not training. Self-care is part of the journey!";
    }
    return "You're stronger than you think, beautiful! That weight you're lifting? Just metal. Your spirit? Infinite power! Breathe into the burn - the discomfort is just your body growing stronger. Every workout is a love letter to yourself. Keep showing up!";
  }
  
  // Recovery/soreness queries
  if (lower.match(/sore|recovery|rest|sleep|pain|hurt|achy|stiff|stretch|deload/)) {
    if (lower.includes("sore") || lower.includes("hurt") || lower.includes("achy")) {
      return "DOMS is just growth talking! Do some light mobility work, take a warm bath with Epsom salts, and drink plenty of water. Your muscles are adapting and getting stronger. If it's really bad, take an extra rest day - your body is wise!";
    }
    if (lower.includes("sleep") || lower.includes("rest")) {
      return "Sleep is when the magic happens, queen! Aim for 7-9 hours - that's when your muscles repair and grow. Rest days aren't lazy days, they're productive days. Your body needs recovery to build that beautiful strength. Trust the process!";
    }
    return "Recovery is just as important as training! Stretch after workouts, stay hydrated, eat enough protein, and prioritize sleep. Your body is building gains while you rest. Remember: consistency beats perfection!";
  }
  
  // Nutrition queries
  if (lower.match(/eat|food|nutrition|protein|carb|fat|meal|diet|drink|water|calorie|macro/)) {
    if (lower.includes("protein")) {
      return "Protein is your best friend for glute growth! Aim for 0.8-1g per pound of bodyweight. Think chicken, fish, eggs, tofu, or protein shakes. Your muscles need it to repair and grow after those intense glute sessions!";
    }
    if (lower.includes("carb") || lower.includes("rice") || lower.includes("pasta")) {
      return "Don't fear carbs, gorgeous! They're your workout fuel! On training days, eat carbs before and after your workout for maximum energy and recovery. Sweet potatoes, rice, oats - they're all your friends. Your glutes need that energy to grow!";
    }
    if (lower.includes("water") || lower.includes("hydrat")) {
      return "Hydration check! Drink at least half your bodyweight in ounces of water daily. Your muscles are 75% water - they need it to grow and recover. Dehydration equals weak workouts. Keep that water bottle close!";
    }
    return "For glute growth: balance is key! Protein for muscle repair, carbs for energy, healthy fats for hormones. Pre-workout: protein + carbs 1-2 hours before. Post-workout: feed those muscles within 2 hours. Your body is a temple - fuel it well!";
  }
  
  // Glute-specific queries
  if (lower.match(/glute|butt|peach|booty|3x|three times/)) {
    return "Glute goals! We train glutes 3x per week for maximum growth. Day 1: Heavy compounds (hip thrusts, squats), Day 3: Posterior chain (RDLs, leg curls), Day 5: High volume finisher. Progressive overload is key - add weight or reps each week. You're building that dream peach!";
  }

  // Cardio queries
  if (lower.match(/cardio|running|jog|treadmill/)) {
    return "Zero cardio in this program, gorgeous! Why? Because we want ALL your energy going into building those beautiful glutes. Walking is fine (it's life!), but no running or intense cardio. Your body needs that energy for muscle growth. Trust me!";
  }

  // Spiritual/mindset queries
  if (lower.match(/spirit|mindset|meditat|peace|calm|mindful|yoga/)) {
    return "Your body is a temple, your spirit is infinite! Every rep is a prayer to your future self. Breathe into the burn, stay present, and remember: progress isn't linear. Some days you'll feel like a goddess, some days human - both are perfect. You're doing amazing!";
  }

  // Qigong-specific queries
  if (lower.includes("qigong") || lower.includes("chee-gong") || lower.includes("qi")) {
    return "Qigong, pronounced chee-gong, is an ancient practice rooted in Traditional Chinese Medicine and Taoist philosophy. It promotes the flow of qi, or life energy, throughout your body through physical postures, slow fluid movements, breath control, and focused mental attention. We incorporate it into your morning activation for stress relief, flexibility, balance, and spiritual development. It's the perfect foundation for your workout!";
  }

  // =========================================================================
  // ADDITIONAL EXERCISE FORM QUERIES
  // =========================================================================

  if (lower.match(/overhead press|ohp|shoulder press/)) {
    return "Overhead Press - The Dorito Builder! Setup: Bar at shoulder height, grip just outside shoulders. Execution: Press straight up, move head back slightly as bar passes face, lock out overhead. Form cues: Squeeze glutes and core, don't arch lower back excessively. This is THE exercise for building wide shoulders and that Dorito shape!";
  }

  if (lower.match(/lateral raise|side raise/)) {
    return "Lateral Raises - Shoulder Width Builder! Setup: Dumbbells at sides, slight bend in elbows. Execution: Raise arms out to sides until parallel to floor, lower with control. Form cues: Lead with elbows not hands, slight forward lean, pause at top. Use lighter weight with strict form - your shoulders will thank you!";
  }

  if (lower.match(/pull up|pullup|lat pulldown/)) {
    return "Pull-Ups and Lat Pulldowns - V-Taper Builders! Setup: Wide grip, palms facing away. Execution: Pull chest toward bar, squeeze lats at top, lower with control. Form cues: Initiate with lats not biceps, drive elbows down and back. These are essential for that V-taper back! Can't do pull-ups yet? Use lat pulldown with the same form.";
  }

  if (lower.match(/row|barbell row|dumbbell row|cable row/)) {
    return "Rows - Back Thickness and Strength! For all rows: Lead with elbows, squeeze shoulder blades together, control the negative. Barbell Rows: Hinge forward 45 degrees, pull to lower chest. Dumbbell Rows: One hand on bench, pull to hip. Cable Rows: Sit tall, pull to belly button. Rows build the thickness that completes the V-taper look!";
  }

  if (lower.match(/deadlift|conventional|sumo/)) {
    return "Deadlifts - The King of Strength! Setup: Feet hip-width (conventional) or wide (sumo), bar over mid-foot. Execution: Brace core, push floor away, keep bar close, lock out with glutes. Form cues: Neutral spine throughout, squeeze glutes at top. For glute focus, sumo deadlifts with wider stance are excellent!";
  }

  if (lower.match(/leg press/)) {
    return "Leg Press - Safe Quad and Glute Builder! Setup: Feet high and wide on platform for more glute activation, lower for quads. Execution: Lower with control until 90 degrees, press through heels, don't lock knees at top. Great for adding volume without the fatigue of free weights!";
  }

  if (lower.match(/glute bridge/)) {
    return "Glute Bridge - Foundation Exercise! Setup: Lie on back, feet flat hip-width apart, knees bent. Execution: Drive through heels, squeeze glutes at top, hold 2 seconds. Perfect for warm-ups, mind-muscle connection, and at-home training. Progress to single-leg bridges, then hip thrusts!";
  }

  if (lower.match(/lunge|walking lunge|reverse lunge/)) {
    return "Lunges - Functional Leg Training! Walking Lunges: Step forward, lower back knee toward ground, push through front heel. Reverse Lunges: Step backward, lower down - easier on knees. Form cues: Torso upright, front knee tracks over toes, take big steps for more glute activation!";
  }

  if (lower.match(/leg curl|hamstring curl/)) {
    return "Leg Curls - Hamstring Isolation! Lying Leg Curl: Face down, curl weight toward glutes, squeeze at top. Seated Leg Curl: Sit upright, curl weight under. Form cue: Point toes away for more hamstring activation. Great for balancing out quad work!";
  }

  if (lower.match(/calf raise|calves/)) {
    return "Calf Raises - Don't Skip These! Execution: Rise up on toes, squeeze at top, lower slowly with full stretch. Form cues: 2 seconds up, 2 seconds squeeze, 2 seconds down. Calves need high reps (15-25) and frequency - train them 2-3x per week!";
  }

  // =========================================================================
  // TRAINING FREQUENCY DETAILS
  // =========================================================================

  if (lower.match(/3 day|three day/) && !lower.includes("fasting")) {
    return "The 3-day program is perfect for busy schedules, beginners, or recovery-focused training. Train Monday, Wednesday, Friday (or any 3 non-consecutive days). Day 1: Glutes and Lower Body A (quads). Day 2: Upper Body Push and Pull combined. Day 3: Glutes and Lower Body B (hamstrings). You still hit glutes 3x per week! Ideal if you have limited time but want maximum results.";
  }

  if (lower.match(/5 day|five day/)) {
    return "The 5-day program is our most popular - the sweet spot for balanced muscle growth. Day 1: Glutes and Lower A. Day 2: Upper Push (chest, shoulders, triceps). Day 3: Glutes and Hamstrings. Day 4: Upper Pull (back, biceps). Day 5: Glute Finisher and Full Body. Optimal frequency for glutes (3x) and upper body (2x). Rest days are typically Wednesday and weekends.";
  }

  if (lower.match(/6 day|six day/)) {
    return "The 6-day program is for advanced lifters who recover quickly. Day 1: Intensive Glutes and Lower A. Day 2: Upper Push. Day 3: Upper Pull. Day 4: Glutes and Lower B. Day 5: Glute Finisher and Upper detail. Day 6: Active recovery or light conditioning. One full rest day per week. Make sure your sleep, nutrition, and stress management are on point!";
  }

  // =========================================================================
  // GOALS - Dorito, Glute Focus, Balanced, Strength
  // =========================================================================

  if (lower.match(/dorito|shoulder|v-taper|wide back|triangle/)) {
    return "The Dorito shape means wide shoulders and a V-taper back creating a triangle silhouette. This is OPTIONAL - you choose your goal. To build it: focus on overhead press, lateral raises, pull-ups, and rows. The 5-day and 6-day programs include dedicated Upper Push and Upper Pull days for this. Want specific exercise recommendations for shoulder width?";
  }

  if (lower.match(/balanced|equal|proportional/)) {
    return "A balanced physique means developing both upper and lower body proportionally. The 5-day program is ideal: 2 lower body days with 3x glutes, 2 upper body days, and 1 full-body finisher. Great for overall fitness, athleticism, and a proportional look!";
  }

  if (lower.match(/strength first|powerlifting|get stronger|lift heavy|pr|personal record/)) {
    return "For strength-focused training, prioritize compound movements with lower reps and heavier weights. Focus on: Back Squats (4x5-6), Hip Thrusts (4x6-8), Romanian Deadlifts (4x6-8), Overhead Press (4x5-6), Barbell Rows (4x6-8). Rest 3-4 minutes between sets. Progressive overload is EVERYTHING - add 5 lbs to upper body and 10 lbs to lower body lifts when possible!";
  }

  // =========================================================================
  // BEGINNER / INTERMEDIATE / ADVANCED
  // =========================================================================

  if (lower.match(/beginner|just starting|new to|never lifted|first time/)) {
    return "Welcome to your fitness journey! As a beginner, I recommend the 3-day program. This gives your body time to adapt, learn proper form, and recover. Focus on: learning movement patterns first, mastering mind-muscle connection, building consistency. Don't worry about being perfect - progress, not perfection! I'm here to guide you through every exercise.";
  }

  if (lower.match(/intermediate|been training|some experience/)) {
    return "With training experience, you're ready for more volume! I recommend the 5-day program. You'll benefit from higher training frequency, more exercise variety, and dedicated days for different muscle groups. The key now is progressive overload - track your weights and aim to increase them weekly!";
  }

  if (lower.match(/advanced|experienced|been lifting for years|serious/)) {
    return "As an advanced lifter, you can handle higher volume and frequency. The 6-day program will challenge you with maximum glute frequency (3x), comprehensive upper body work, progressive overload cycles, and intensity techniques. Make sure your recovery is on point: 7-9 hours sleep, nutrition dialed in, stress managed. Week 4 deload is crucial - don't skip it!";
  }

  // =========================================================================
  // HOME VS GYM WORKOUTS
  // =========================================================================

  if (lower.match(/home workout|at home|no gym|home equipment|bodyweight|minimal equipment/)) {
    return "You can absolutely build an amazing physique at home! Key exercises: Glute Bridges and Single-Leg variations, Bodyweight Squats and Jump Squats, Bulgarian Split Squats (use a chair), Push-ups (all variations), Resistance Band work, Lunges and Step-ups. Equipment worth getting: Resistance bands, dumbbells, and a sturdy chair. Our program has a Home variant for every workout!";
  }

  if (lower.match(/gym workout|at the gym|full gym|machines/)) {
    return "With full gym access, you have the best tools! Key equipment: Barbell for squats, hip thrusts, RDLs, rows. Dumbbells for isolation and unilateral work. Cable machines for constant tension. Leg press and hack squat for safe volume. Pull-up bar and lat pulldown for back development. The program uses a mix of free weights and machines for optimal results!";
  }

  // =========================================================================
  // STRETCHING & MOBILITY
  // =========================================================================

  if (lower.match(/stretch|stretching|flexibility|mobility|warm up|cool down/)) {
    if (lower.includes("before") || lower.includes("warm") || lower.includes("dynamic")) {
      return "Before workouts, do DYNAMIC stretching: Leg swings (10 each leg), Hip circles (10 each direction), Arm circles (10 forward, 10 backward), Walking lunges with twist (10 steps), Cat-cow stretches (10 reps), High knees and butt kicks (30 seconds each). This increases blood flow and prepares your nervous system. Takes 5-10 minutes!";
    }
    if (lower.includes("after") || lower.includes("cool") || lower.includes("static")) {
      return "After workouts, do STATIC stretching: Hip flexor stretch (30 sec each side), Pigeon pose for glutes (45 sec each), Hamstring stretch (30 sec each leg), Quad stretch (30 sec each), Chest doorway stretch (30 sec), Child's pose (60 sec). This reduces muscle tension and aids recovery. Take 10-15 minutes!";
    }
    return "Stretching is essential! BEFORE workouts: Dynamic stretching (leg swings, hip circles, arm circles). AFTER workouts: Static stretching (hold each position 30-60 seconds). Focus on hip flexors, glutes, hamstrings, quads, chest, and back. Benefits: reduced injury risk, better range of motion, faster recovery!";
  }

  // =========================================================================
  // WATER INTAKE
  // =========================================================================

  if (lower.match(/water intake|how much water|hydration goal|water tracker/)) {
    return "Your daily water goal: At minimum, drink half your bodyweight in ounces (150 lbs = 75 oz). On training days, add extra 16-20 oz. On fasting days, water is especially important! Timing: 16 oz upon waking, sip throughout day, 16 oz before workout, small sips during training, 16 oz after. Use the water tracker to gamify your hydration!";
  }

  // =========================================================================
  // DIET TYPES
  // =========================================================================

  if (lower.match(/vegan|plant based|vegetarian/)) {
    return "You can absolutely build muscle on a plant-based diet! Key protein sources: Tofu, tempeh, seitan, legumes (lentils, chickpeas, black beans), edamame, quinoa, hemp seeds, pea protein powder. Combine protein sources for complete amino acids (rice + beans). Consider supplementing B12 and creatine. Our meal plan section has a complete Vegan option!";
  }

  if (lower.match(/keto|low carb|ketogenic/)) {
    return "Keto can work for fitness! You may feel weaker during the first 2-4 weeks as your body adapts. Consider targeted keto - small amount of carbs (15-30g) before workouts. Focus on high-quality fats (avocado, olive oil, nuts), moderate protein. Be extra careful with hydration and electrolytes. Our meal plan has a Keto option!";
  }

  if (lower.match(/mediterranean|heart healthy/)) {
    return "Mediterranean diet is excellent for fitness! Focus on: olive oil as primary fat, fish 2-3x per week, lots of vegetables, whole grains, legumes, nuts and seeds, moderate dairy, red meat occasionally. Benefits: heart health, anti-inflammatory, sustainable long-term. Our meal plan section has this option ready!";
  }

  if (lower.match(/meal prep|prep meals|food prep/)) {
    return "Meal prep is a game-changer! Pick one day (Sunday works great) for bulk cooking. Prep 4-5 days of food: Proteins (chicken, ground turkey, fish, tofu) - cook in bulk. Carbs (rice, potatoes, quinoa) - make big batches. Vegetables - wash, chop, store. Use portion-sized containers. This saves time, money, and keeps you on track!";
  }

  // =========================================================================
  // COMMUNITY & TRACKING
  // =========================================================================

  if (lower.match(/community|forum|challenge|social|connect|members/)) {
    return "Our community is amazing! What's included: CHALLENGES - Weekly and monthly fitness challenges. Compete and stay motivated. FORUMS - Discuss workouts, share tips, ask questions. PROGRESS SHARING - Celebrate wins with the community. SOCIAL MEDIA - Share achievements to Instagram, TikTok, YouTube. Everyone supports each other - positive, encouraging, no judgment!";
  }

  if (lower.match(/track|tracking|log|record|progress|measurement/)) {
    return "Tracking is essential for progress! What to track: WORKOUTS - Log every set, rep, and weight. BODY MEASUREMENTS - Waist, hips, chest, arms, thighs weekly. PHOTOS - Take progress photos monthly (same lighting, angle, time). WEIGHT - Daily weigh-ins but look at weekly averages. WATER - Use the tracker daily. You can't improve what you don't measure!";
  }

  // =========================================================================
  // MOTIVATION & MINDSET
  // =========================================================================

  if (lower.match(/plateau|stuck|not seeing results|no progress/)) {
    return "Plateaus happen to everyone - it means you've adapted! How to break through: Are you progressively overloading? Is sleep and nutrition on point? Try changing rep ranges, exercise variations, tempo, or rest periods. You might need a deload week. Remember: results can happen without scale moving (muscle gain + fat loss = same weight but better body). Let's troubleshoot together!";
  }

  if (lower.match(/confidence|self-esteem|body image|don't like how i look/)) {
    return "I understand those feelings, and you're not alone. Your worth is not determined by appearance. The work you're putting in IS changing you, even if you can't see it yet. Take progress photos (they show changes you miss in the mirror). Celebrate non-scale victories. Be patient - real transformation takes time. Your body is your partner in this journey. I see your strength, even when you can't.";
  }

  // =========================================================================
  // HELP & NAVIGATION
  // =========================================================================

  if (lower.match(/help|what can you do|how can you help|what do you know|your capabilities|assist me/)) {
    return "I'm Ari, your 24/7 AI trainer! I can help with EVERYTHING in the program: TRAINING - Exercise form, workout structure, substitutions, progression, home vs gym. NUTRITION - Meal plans, macros, diet types (vegan, keto, Mediterranean), fasting. RECOVERY - Sleep, stretching, mobility, soreness. PROGRAM - 3/5/6-day schedules, 8-week progression, goals. PAYMENTS - Pricing, checkout, cancellations. WELLNESS - Morning activation, Qigong, mindset, motivation, water. Plus everyday conversations! What would you like to know?";
  }

  if (lower.match(/where|find|navigate|looking for|show me|how do i find/)) {
    return "I can help you find anything! Key sections: TRAINING PROGRAMS - Select 3, 5, or 6-day split at the top. MORNING ACTIVATION - Qigong and CNS activation section. MEAL PLANS - Diet type selector with body type personalization. FASTING - Intermittent fasting schedules. STRETCHING - Dynamic warm-up and static cool-down guides. EXERCISE GALLERY - All exercises with form videos. WATER TRACKER - Gamified hydration tracking. PRICING - Payment options. What are you looking for?";
  }

  // =========================================================================
  // DEFAULT FALLBACK - Still helpful!
  // =========================================================================

  return "That's a great question! I'm here to help with everything in the Glute Sync program: training (form, exercises, structure), nutrition (meal plans, macros, all diet types), fasting schedules, stretching, morning activation, Qigong, water intake, payments, platform compatibility, community features, motivation, and more. Could you give me a bit more detail about what you need? I want to give you the most helpful answer!";
};

const sampleVoiceCommands = [
  { command: "How are you doing today?", desc: "Chat with Ari anytime" },
  { command: "Help me plan my day", desc: "Get personalized daily guidance" },
  { command: "What's the fasting schedule?", desc: "Learn the 16:8 protocol" },
  { command: "How's my form on hip thrusts?", desc: "Get expert form feedback" },
  { command: "What should I eat for glute gains?", desc: "Nutrition for your goals" },
  { command: "Which plan is right for me?", desc: "Budget and goal advice" },
  { command: "How do I pay for the program?", desc: "Payment and checkout help" },
  { command: "Tell me about Qigong", desc: "Ancient wisdom for training" },
];

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
}

// Ari Voice Assistant Component
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {transcript && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-sky-500/10 rounded-xl text-sky-300 text-sm"
            >
              "{transcript}"
            </motion.div>
          )}
        </div>

        <div className="px-4 flex-1 overflow-y-auto max-h-[280px] space-y-3 pb-4">
          {conversationHistory.slice(-4).map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : ''}`}
            >
               {msg.type === 'ari' && (
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                   A
                 </div>
               )}
              <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                msg.type === 'user' 
                  ? 'bg-sky-500 text-black rounded-tr-none' 
                  : 'bg-white/10 text-white rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isListening 
                ? 'bg-red-500 shadow-red-500/30' 
                : 'bg-gradient-to-br from-sky-400 to-cyan-500 shadow-sky-500/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-7 h-7 text-white" />
            ) : (
              <Mic className="w-7 h-7 text-white" />
            )}
          </motion.button>
          <div className="text-center mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {isListening ? "Tap to Stop" : "Tap to Speak"}
          </div>
        </div>
      </div>
    </div>
  );
};

const workouts: WorkoutDay[] = [
  {
    day: "Day 1",
    title: "Intensive Glutes & Lower A",
    gluteTag: "Glute Focus 1/3",
    focus: "Maximum glute fiber recruitment & heavy compounds.",
    exercises: [
      { name: "Barbell Hip Thrusts", sets: "4", reps: "8-10", note: "Hold 2s at top.", example: "Alt: Single-leg glute bridge" },
      { name: "Back Squats", sets: "4", reps: "6-8", note: "Deep, controlled eccentric.", example: "Alt: Goblet squats" },
      { name: "Glute Medius Kickbacks", sets: "3", reps: "15", note: "Strict form, no swinging.", example: "Alt: Seated abductions" },
    ],
    variants: {
      beginner: [
        { name: "Dumbbell Hip Thrust", sets: "3", reps: "10-12", note: "Pause at top.", example: "Alt: Glute bridge" },
        { name: "Goblet Squat", sets: "3", reps: "10", note: "Controlled depth.", example: "Alt: Box squat" },
        { name: "Banded Abduction", sets: "3", reps: "20", note: "Constant tension.", example: "Alt: Side-lying clams" },
      ],
      advanced: [
        { name: "Barbell Hip Thrust (Heavy)", sets: "5", reps: "5-6", note: "2 warm-ups + 3 top sets.", example: "Alt: Smith hip thrust" },
        { name: "Pause Squat", sets: "4", reps: "5", note: "2s pause in the hole.", example: "Alt: Front squat" },
        { name: "Cable Abduction (Slow)", sets: "4", reps: "12-15", note: "2s squeeze each rep.", example: "Alt: Machine abduction" },
      ],
      home: [
        { name: "Backpack Hip Thrust", sets: "4", reps: "12-15", note: "Hard squeeze.", example: "Alt: Couch bridge" },
        { name: "Tempo Split Squat", sets: "3", reps: "10/leg", note: "3s down.", example: "Alt: Step-ups" },
        { name: "Banded Lateral Walk", sets: "3", reps: "20 steps", note: "Knees out.", example: "Alt: Monster walk" },
      ],
    }
  },
  {
    day: "Day 2",
    title: "Upper Body: Push & Pull",
    focus: "Sculpting the shoulders and back for a balanced frame.",
    exercises: [
      { name: "Overhead Press", sets: "3", reps: "8-12", note: "Core tight.", example: "Alt: DB Shoulder Press" },
      { name: "Lat Pulldowns", sets: "3", reps: "10-12", note: "Pull to upper chest.", example: "Alt: Assisted Pullups" },
      { name: "Face Pulls", sets: "3", reps: "15", note: "Focus on rear delts.", example: "Alt: Rear delt fly" },
    ]
  },
  {
    day: "Day 3",
    title: "Glute Isolation & Hammies",
    gluteTag: "Glute Focus 2/3",
    focus: "Posterior chain dominance.",
    exercises: [
      { name: "Romanian Deadlifts", sets: "4", reps: "10", note: "Stretch the hamstrings.", example: "Alt: Leg curl machine" },
      { name: "B-Stance Hip Thrusts", sets: "3", reps: "12", note: "Unilateral focus.", example: "Alt: Step-ups" },
      { name: "Seated Leg Curls", sets: "3", reps: "12", note: "Squeeze at bottom.", example: "Alt: Stability ball curls" },
    ]
  },
  {
    day: "Day 4",
    title: "Upper Body Hypertrophy",
    focus: "Detail work for arms and upper back.",
    exercises: [
      { name: "Incline DB Press", sets: "3", reps: "10", note: "45 degree incline.", example: "Alt: Pushups" },
      { name: "Seated Rows", sets: "3", reps: "12", note: "Shoulder blades back.", example: "Alt: DB Rows" },
      { name: "Tricep Extensions", sets: "3", reps: "15", note: "Full extension.", example: "Alt: Dips" },
    ]
  },
  {
    day: "Day 5",
    title: "The Glute Finisher",
    gluteTag: "Glute Focus 3/3",
    focus: "High volume and metabolic stress for growth.",
    exercises: [
      { name: "Bulgarian Split Squats", sets: "3", reps: "10", note: "Leaning forward = more glute.", example: "Alt: Lunges" },
      { name: "Cable Pull-throughs", sets: "3", reps: "15", note: "Snap the hips forward.", example: "Alt: Kettlebell swings" },
      { name: "Frog Pumps", sets: "3", reps: "20+", note: "Burnout set.", example: "Alt: Glute bridge pulses" },
    ]
  }
];

const trainingSchedules: Record<TrainingFrequency, WorkoutDay[]> = {
  3: [
    {
      ...workouts[0],
      day: "Day 1",
      title: "Intensive Glutes & Lower A",
      focus: "Maximum glute fiber recruitment & heavy compounds.",
    },
    {
      ...workouts[1],
      day: "Day 2",
      title: "Upper Body: Push & Pull",
      focus: "Sculpting the shoulders and back for a balanced frame.",
    },
    {
      ...workouts[2],
      day: "Day 3",
      title: "Glute Isolation & Hammies",
      focus: "Posterior chain dominance.",
    },
  ],
  5: workouts,
  6: [
    ...workouts,
    {
      day: "Day 6",
      title: "Upper Body Dorito Hybrid",
      focus: "Shoulder and back specialization to complete the Dorito shape.",
      gluteTag: "Upper Focus",
      exercises: [
        { name: "Overhead Press", sets: "4", reps: "8-10", note: "Build those wide shoulders.", example: "Alt: DB Shoulder Press" },
        { name: "Wide Grip Lat Pulldown", sets: "4", reps: "10-12", note: "Emphasize the V-taper.", example: "Alt: Assisted Pull-ups" },
        { name: "Face Pulls", sets: "3", reps: "15-20", note: "Rear delt and posture work.", example: "Alt: Band pull-aparts" },
      ],
    },
  ],
};

const clientPrograms: GoalProgram[] = [
  {
    id: "busy-consistent",
    title: "Busy and Consistent",
    goal: "You want a plan that respects your calendar and keeps momentum high.",
    days: 3,
    planVariant: "beginner",
    timeBudget: "35-45 min per session",
    weeklyLayout: "Mon / Wed / Fri",
    bestFor: "Busy professionals, parents, beginners, and anyone rebuilding consistency.",
    outcome: "Simple structure, lower recovery demand, and zero wasted time.",
  },
  {
    id: "recomp-balance",
    title: "Balanced Recomposition",
    goal: "You want to build shape, tighten up, and keep your week organized.",
    days: 5,
    planVariant: "intermediate",
    timeBudget: "50-65 min per session",
    weeklyLayout: "Mon / Tue / Thu / Fri / Sat",
    bestFor: "Clients who want steady muscle gain with a manageable weekly rhythm.",
    outcome: "The main path for balanced growth, energy, and lifestyle fit.",
  },
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
