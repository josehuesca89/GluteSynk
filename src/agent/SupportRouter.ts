// src/agent/SupportRouter.ts
//
// Honest scope: this is a fast, client-side triage layer. It uses keyword
// matching (not a real ML classifier) to guess intent, decide when a human
// should step in, and hand back a quick bilingual acknowledgment. It is
// NOT a replacement for the real Ari chat, which already calls your
// Cloudflare Worker (a real LLM backend) for the actual detailed answer —
// this just runs first so you can:
//   - instantly flag things that need a human (refunds, chargebacks,
//     account/billing disputes) instead of letting the LLM improvise on
//     money questions
//   - give a bilingual "on it" reply while the full chat response loads
//   - collect lightweight analytics on what customers actually ask about

import type { Lang, SupportCategory, SupportClassification, SupportReply } from "./types";

interface CategoryRule {
  category: SupportCategory;
  en: RegExp;
  es: RegExp;
}

const RULES: CategoryRule[] = [
  {
    category: "payments",
    en: /price|pricing|cost|pay|payment|subscription|refund|charge|billing|cancel|checkout|paypal|apple pay|google pay|dispute|chargeback/i,
    es: /precio|costo|pago|pagar|suscripci[oó]n|reembolso|cobro|facturaci[oó]n|cancelar|devoluci[oó]n/i,
  },
  {
    category: "meal",
    en: /meal|food|diet|calorie|calories|protein|macro|recipe|nutrition|eat|fasting/i,
    es: /comida|dieta|caloria|prote[ií]na|receta|nutrici[oó]n|comer|ayuno/i,
  },
  {
    category: "exercise",
    en: /exercise|workout|rep|reps|set|sets|form|squat|lunge|glute|stretch|sore|injury|hurt/i,
    es: /ejercicio|entrenamiento|repetici[oó]n|serie|sentadilla|estocada|gl[uú]teo|estiramiento|dolor|lesi[oó]n/i,
  },
  {
    category: "routine_change",
    en: /change my (routine|plan|program|schedule|frequency)|switch to|different (plan|program|schedule)|(3|5|6) day/i,
    es: /cambiar mi (rutina|plan|programa|horario)|cambiar a|(3|5|6) d[ií]as/i,
  },
  {
    category: "technical",
    en: /bug|crash|glitch|not working|won'?t load|error|broken|stuck|frozen/i,
    es: /error|falla|no funciona|no carga|roto|atascado|congelado/i,
  },
];

// Things a keyword-matcher should never be trusted to resolve on its own.
const ESCALATION_TRIGGERS: RegExp =
  /refund|chargeback|dispute|fraud|unauthorized charge|cancel my subscription|legal|lawsuit|reembolso|contracargo|fraude|cargo no autorizado|cancelar mi suscripci[oó]n|demanda/i;

const CANNED_REPLIES: Record<SupportCategory, Record<Lang, string>> = {
  payments: {
    en: "I can help with billing questions. Let me pull that up for you.",
    es: "Puedo ayudarte con preguntas de facturación. Déjame revisar eso.",
  },
  meal: {
    en: "Great question about nutrition — let's find you the right answer.",
    es: "Buena pregunta sobre nutrición — busquemos la respuesta correcta.",
  },
  exercise: {
    en: "Got it, a training question. Let's sort out your form or plan.",
    es: "Entendido, una pregunta de entrenamiento. Vamos a resolver tu forma o plan.",
  },
  routine_change: {
    en: "Sure, I can help you adjust your routine. One moment.",
    es: "Claro, puedo ayudarte a ajustar tu rutina. Un momento.",
  },
  technical: {
    en: "Sorry about that — let's get this fixed. Logging the details now.",
    es: "Lamento eso — vamos a solucionarlo. Registrando los detalles ahora.",
  },
  general: {
    en: "On it — let me get you an answer.",
    es: "Enseguida — déjame conseguirte una respuesta.",
  },
};

const ESCALATION_REPLY: Record<Lang, string> = {
  en: "This needs a real person to look at — I'm flagging it for our support team and they'll follow up with you directly.",
  es: "Esto necesita que una persona lo revise — lo estoy marcando para nuestro equipo de soporte, quienes te contactarán directamente.",
};

export function classify(message: string): SupportClassification {
  const trimmed = message.trim();

  if (ESCALATION_TRIGGERS.test(trimmed)) {
    const matchedRule = RULES.find((r) => r.en.test(trimmed) || r.es.test(trimmed));
    return {
      category: matchedRule?.category ?? "payments",
      confidence: 0.9,
      escalate: true,
      escalationReason: "Matched a billing/legal/dispute trigger — routed to a human by policy.",
    };
  }

  for (const rule of RULES) {
    if (rule.en.test(trimmed) || rule.es.test(trimmed)) {
      return { category: rule.category, confidence: 0.7, escalate: false };
    }
  }

  return { category: "general", confidence: 0.3, escalate: false };
}

export function route(message: string, lang: Lang = "en"): SupportReply {
  const classification = classify(message);
  const reply = classification.escalate
    ? ESCALATION_REPLY[lang]
    : CANNED_REPLIES[classification.category][lang];
  return { classification, reply };
}

interface SupportLogEntry extends SupportReply {
  message: string;
  timestamp: number;
}

const SUPPORT_LOG_KEY = "glutesync_agent_support_log";
const MAX_SUPPORT_LOG = 30;

/** Lightweight local analytics: what are people actually asking about? */
export function logSupportInteraction(message: string, result: SupportReply) {
  try {
    const raw = localStorage.getItem(SUPPORT_LOG_KEY);
    const log: SupportLogEntry[] = raw ? JSON.parse(raw) : [];
    log.unshift({ ...result, message, timestamp: Date.now() });
    if (log.length > MAX_SUPPORT_LOG) log.length = MAX_SUPPORT_LOG;
    localStorage.setItem(SUPPORT_LOG_KEY, JSON.stringify(log));
  } catch {
    // Non-critical — never let logging break the support flow.
  }
}

export function getSupportLog(): SupportLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(SUPPORT_LOG_KEY) ?? "[]");
  } catch {
    return [];
  }
}
