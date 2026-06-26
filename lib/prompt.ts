import type { PredictionStyle, Language } from "./matches";

// ---------------------------------------------------------------------------
// Structured prompt templates for DeepSeek.
// Constrains the model to prediction content only — never fixtures, brackets,
// or tournament structure. The match list is the single source of truth.
// ---------------------------------------------------------------------------

const STYLE_GUIDES: Record<PredictionStyle, string> = {
  bold: [
    "Give a bold, confident prediction with hot takes.",
    "Be provocative and entertaining. No hedging, no maybes.",
    "Write like a pundit who's never wrong.",
  ].join(" "),
  analytical: [
    "Give a data-driven, tactical breakdown.",
    "Reference formations, recent form, pressing intensity, and xG reasoning.",
    "Be precise, measured, and back every claim with implied data.",
  ].join(" "),
  emotional: [
    "Give a passionate, dramatic prediction from a die-hard fan's perspective.",
    "Use vivid language and emotional stakes — make it feel like a stadium chant.",
    "Capture the heartbreak, glory, and theatre of World Cup football.",
  ].join(" "),
  "hot-take": [
    "Give a viral, spicy prediction that feels like breaking news. Use buzzwords like SHOCK, UPSET, EXPOSED, UNSTOPPABLE, CALLING IT.",
    "Write like a football Twitter/X pundit — short punchy verdicts, maximum hype, zero hedging.",
    "Make the social caption feel like a headline people CAN'T SCROLL PAST. Use caps strategically for hype words only. Keep it authentic — don't invent fake events or injuries.",
  ].join(" "),
};

const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  ar: "Arabic",
  ja: "Japanese",
  zh: "Chinese",
};

export interface PromptContext {
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  stage: string;
  supportedTeam: string;
  style: PredictionStyle;
  language: Language;
}

/**
 * Build a system prompt that locks the model into JSON-only prediction mode.
 * The model must never discuss fixtures, brackets, or tournament structure.
 */
export function buildSystemPrompt(): string {
  return [
    "You are a World Cup football prediction engine.",
    "You ONLY output valid JSON — no markdown, no code fences, no commentary.",
    "Your entire response must be a single JSON object that parses cleanly.",
    "Never discuss tournament structure, brackets, other matches, or future rounds.",
    "Never mention that you are an AI. Write as a human football expert.",
    "Keep predictions exciting but grounded in real football knowledge.",
  ].join(" ");
}

/**
 * Build the user prompt for a specific match prediction.
 */
export function buildUserPrompt(ctx: PromptContext): string {
  return [
    `Predict this World Cup match:`,
    ``,
    `Match: ${ctx.flagA} ${ctx.teamA} vs ${ctx.teamB} ${ctx.flagB}`,
    `Stage: ${ctx.stage}`,
    `I support: ${ctx.supportedTeam}`,
    ``,
    `Prediction style: ${STYLE_GUIDES[ctx.style]}`,
    `Respond in: ${LANGUAGE_LABELS[ctx.language]}`,
    ``,
    `OUTPUT FORMAT — return ONLY this JSON shape:`,
    `{`,
    `  "predictedScore": "e.g. 3-1 or 2-2 (pens 4-3)",`,
    `  "winner": "team name or Draw",`,
    `  "winProbability": "e.g. 72% or Even (50%)",`,
    `  "keyPlayer": "Player Name — short 3-5 word reason",`,
    `  "upsetFactor": "One line: the biggest X-factor or surprise risk",`,
    `  "shortVerdict": "2-3 sentence prediction summary, max 80 words",`,
    `  "socialCaption": "Ready-to-post caption with 2-3 hashtags, max 200 chars"`,
    `}`,
  ].join("\n");
}
