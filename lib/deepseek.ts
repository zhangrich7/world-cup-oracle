import type { Match, PredictionStyle, Language } from "./matches";
import { buildSystemPrompt, buildUserPrompt, type PromptContext } from "./prompt";

// ---------------------------------------------------------------------------
// DeepSeek API client — OpenAI-compatible chat completions.
// Returns a validated prediction or a deterministic fallback.
// ---------------------------------------------------------------------------

const API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const MAX_TOKENS = 600;
const TEMPERATURE = 0.8;

export interface Prediction {
  predictedScore: string;
  winner: string;
  winProbability: string;
  keyPlayer: string;
  upsetFactor: string;
  shortVerdict: string;
  socialCaption: string;
}

const REQUIRED_FIELDS: (keyof Prediction)[] = [
  "predictedScore",
  "winner",
  "winProbability",
  "keyPlayer",
  "upsetFactor",
  "shortVerdict",
  "socialCaption",
];

// ---------------------------------------------------------------------------
// Deterministic fallback — same inputs always produce the same prediction.
// Uses DJB2 hash so we never call Math.random() in prediction code.
// ---------------------------------------------------------------------------

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

const KEY_PLAYER_POOL: Record<string, string[]> = {
  France: ["Mbappé — pace on the counter", "Griezmann — creative link-up play", "Tchouaméni — midfield dominance"],
  Brazil: ["Vinícius Jr — unstoppable 1v1", "Rodrygo — clinical in the box", "Alisson — wall in goal"],
  Argentina: ["Messi — still the magician", "Álvarez — relentless pressing", "Enzo Fernández — tempo controller"],
  Germany: ["Musiala — dribbling through lines", "Wirtz — chance creation machine", "Kimmich — set-piece delivery"],
  Spain: ["Lamine Yamal — teenage sensation", "Rodri — midfield metronome", "Olmo — late runs into the box"],
  England: ["Bellingham — box-to-box engine", "Kane — penalty-box predator", "Saka — cut inside and fire"],
  Peru: ["Lapadula — aerial threat", "Cueva — dead-ball specialist", "Advíncula — overlapping runs"],
  Egypt: ["Salah — king of the right wing", "Marmoush — form of his life", "Elneny — shield for the backline"],
  "Saudi Arabia": ["Al-Dawsari — big-game player", "Al-Shehri — poacher's instinct", "Al-Owais — shot-stopper"],
  Japan: ["Mitoma — dribbling wizard", "Kubo — through-ball artist", "Tomiyasu — defensive rock"],
  Uruguay: ["Valverde — long-range rockets", "Núñez — chaos in the box", "Araújo — defensive wall"],
  Canada: ["Davies — turbo left-back", "David — ice-cold finisher", "Buchanan — tricky winger"],
};

const UPSET_POOL = [
  "Set pieces could flip this match in an instant.",
  "The referee's card tolerance will shape the tempo.",
  "One early goal could force a tactical rethink.",
  "Weather conditions favour the more physical side.",
  "A red card or VAR intervention could change everything.",
  "The midfield press intensity will decide the turnovers.",
  "Late substitutions might be the difference-maker.",
  "Penalty shootout experience heavily favours one side.",
  "Travel fatigue from the group stage could show late.",
  "The crowd energy gives a measurable home-style advantage.",
];

const VERDICT_TEMPLATES = [
  "{winner} enters as the narrow favourite based on {reason}. Expect a tight contest where {upsetFactor}.",
  "This one swings toward {winner}. {reason} gives them the edge, but {upsetFactor}",
  "A fascinating tactical battle. {winner} should prevail thanks to {reason}, though {upsetFactor}",
];

const REASONS = [
  "superior squad depth and recent form",
  "tactical flexibility and set-piece threat",
  "individual brilliance in the final third",
  "defensive solidity and transition speed",
  "midfield control and possession dominance",
];

function buildFallback(match: Match, supportedTeam: string, style: PredictionStyle): Prediction {
  const opponent = match.teamA === supportedTeam ? match.teamB : match.teamA;
  const seed = djb2(`${match.id}:${supportedTeam}:${style}`);
  const isDraw = seed % 7 === 0;

  // Deterministic score
  const baseA = 1 + (seed % 3);
  const baseB = (seed >> 2) % 3;
  const scoreA = baseA >= baseB ? baseA : baseB;
  const scoreB = baseA >= baseB ? baseB : baseA;
  const scoreStr =
    supportedTeam === match.teamA
      ? isDraw
        ? `${scoreB}-${scoreB}`
        : `${scoreA}-${scoreB}`
      : isDraw
        ? `${scoreB}-${scoreB}`
        : `${scoreB}-${scoreA}`;

  const winner = isDraw ? "Draw" : supportedTeam;
  const prob = isDraw
    ? "Even (50%)"
    : `${55 + (seed % 25)}%`;

  // Key player from pool or generic
  const pool = KEY_PLAYER_POOL[supportedTeam] ?? [
    `${supportedTeam}'s star forward — match-winner potential`,
    `The midfield engine for ${supportedTeam}`,
    `${supportedTeam}'s defensive leader`,
  ];
  const keyPlayer = pick(pool, seed);

  const upsetFactor = pick(UPSET_POOL, seed >> 3);
  const reason = pick(REASONS, seed >> 5);

  let shortVerdict = pick(VERDICT_TEMPLATES, seed >> 7)
    .replace("{winner}", winner)
    .replace("{reason}", reason)
    .replace("{upsetFactor}", upsetFactor);

  // Build social caption
  const tags = ["#WorldCup2026", `#${supportedTeam.replace(/\s+/g, "")}`, "#FIFA"];
  const captionStyles: Record<PredictionStyle, string> = {
    bold: `${winner === "Draw" ? "Draw incoming!" : `${supportedTeam} takes this!`} 🔥 ${shortVerdict.split(".")[0]}. ${tags.join(" ")}`,
    analytical: `Our model gives ${winner === "Draw" ? "a deadlock" : supportedTeam} the edge. ${shortVerdict.split(".")[0]}. ${tags.join(" ")}`,
    emotional: `I'M SAYING IT NOW — ${winner === "Draw" ? "THIS IS TOO CLOSE TO CALL" : supportedTeam.toUpperCase() + " WINS"}! 😤 ${shortVerdict.split(".")[0]}. ${tags.join(" ")}`,
  };

  const caption = captionStyles[style];

  return {
    predictedScore: scoreStr,
    winner,
    winProbability: prob,
    keyPlayer,
    upsetFactor,
    shortVerdict: shortVerdict.trim(),
    socialCaption: caption,
  };
}

// ---------------------------------------------------------------------------
// Main client
// ---------------------------------------------------------------------------

function validatePrediction(raw: unknown): Prediction | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (typeof obj[field] !== "string" || !(obj[field] as string).trim()) {
      return null;
    }
  }
  return {
    predictedScore: (obj.predictedScore as string).trim(),
    winner: (obj.winner as string).trim(),
    winProbability: (obj.winProbability as string).trim(),
    keyPlayer: (obj.keyPlayer as string).trim(),
    upsetFactor: (obj.upsetFactor as string).trim(),
    shortVerdict: (obj.shortVerdict as string).trim(),
    socialCaption: (obj.socialCaption as string).trim(),
  };
}

export interface PredictResult {
  prediction: Prediction;
  source: "ai" | "fallback";
}

/**
 * Generate a match prediction via DeepSeek.
 * On any failure (network, invalid JSON, missing fields), returns a
 * deterministic fallback prediction instead of throwing.
 */
export async function predictMatch(
  match: Match,
  supportedTeam: string,
  style: PredictionStyle,
  language: Language
): Promise<PredictResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // If no API key, skip straight to fallback
  if (!apiKey) {
    console.warn("DeepSeek: no API key configured, using fallback prediction.");
    return {
      prediction: buildFallback(match, supportedTeam, style),
      source: "fallback",
    };
  }

  const ctx: PromptContext = {
    teamA: match.teamA,
    teamB: match.teamB,
    flagA: match.flagA,
    flagB: match.flagB,
    stage: match.stage,
    supportedTeam,
    style,
    language,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(ctx) },
        ],
        response_format: { type: "json_object" },
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "unknown");
      console.error(`DeepSeek API error ${response.status}:`, errText.slice(0, 300));
      return {
        prediction: buildFallback(match, supportedTeam, style),
        source: "fallback",
      };
    }

    const completion = await response.json();
    const rawContent: string | undefined = completion.choices?.[0]?.message?.content;

    if (!rawContent) {
      console.error("DeepSeek: empty response body.");
      return {
        prediction: buildFallback(match, supportedTeam, style),
        source: "fallback",
      };
    }

    // Try to parse JSON from the response
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      // The model might have wrapped JSON in markdown fences — try to extract
      const fenceMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (fenceMatch) {
        try {
          parsed = JSON.parse(fenceMatch[1]);
        } catch {
          console.error("DeepSeek: failed to parse JSON even after fence extraction.");
          return {
            prediction: buildFallback(match, supportedTeam, style),
            source: "fallback",
          };
        }
      } else {
        console.error("DeepSeek: response is not valid JSON and has no code fence.");
        return {
          prediction: buildFallback(match, supportedTeam, style),
          source: "fallback",
        };
      }
    }

    const validated = validatePrediction(parsed);
    if (!validated) {
      console.error("DeepSeek: response missing required fields.");
      return {
        prediction: buildFallback(match, supportedTeam, style),
        source: "fallback",
      };
    }

    return { prediction: validated, source: "ai" };
  } catch (err) {
    console.error("DeepSeek: unexpected error:", err);
    return {
      prediction: buildFallback(match, supportedTeam, style),
      source: "fallback",
    };
  }
}
