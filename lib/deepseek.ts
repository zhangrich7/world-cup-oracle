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
  // Group A
  Mexico: ["Raúl Jiménez — penalty-box poacher", "Edson Álvarez — midfield destroyer", "Santiago Giménez — clinical finisher"],
  "South Africa": ["Percy Tau — creative spark", "Lyle Foster — pace on the break", "Ronwen Williams — commanding keeper"],
  "South Korea": ["Son Heung-min — world-class finisher", "Lee Kang-in — set-piece wizard", "Kim Min-jae — defensive rock"],
  Czechia: ["Patrik Schick — aerial threat", "Tomáš Souček — box-to-box engine", "Adam Hložek — young wildcard"],
  // Group B
  Canada: ["Alphonso Davies — turbo left-back", "Jonathan David — ice-cold finisher", "Tajon Buchanan — tricky winger"],
  "Bosnia & Herzegovina": ["Edin Džeko — veteran poacher", "Miralem Pjanić — dead-ball maestro", "Rade Krunić — midfield anchor"],
  Qatar: ["Akram Afif — creative playmaker", "Almoez Ali — record scorer", "Meshaal Barsham — shot-stopper"],
  Switzerland: ["Granit Xhaka — midfield general", "Breel Embolo — physical presence", "Manuel Akanji — defensive leader"],
  // Group C
  Brazil: ["Vinícius Jr — unstoppable 1v1", "Rodrygo — clinical in the box", "Alisson — wall in goal"],
  Morocco: ["Achraf Hakimi — marauding fullback", "Brahim Díaz — creative engine", "Yassine Bounou — penalty hero"],
  Haiti: ["Frantzdy Pierrot — target man", "Duckens Nazon — long-range threat", "Johny Placide — veteran keeper"],
  Scotland: ["Andrew Robertson — overlapping runs", "Scott McTominay — late box arrival", "John McGinn — pressing machine"],
  // Group D
  USA: ["Christian Pulisic — captain clutch", "Folarin Balogun — penalty-box predator", "Weston McKennie — midfield engine"],
  Paraguay: ["Miguel Almirón — pace merchant", "Julio Enciso — young sensation", "Gustavo Gómez — set-piece target"],
  Australia: ["Mathew Ryan — veteran keeper", "Jackson Irvine — box-to-box runs", "Craig Goodwin — left-footed precision"],
  Türkiye: ["Hakan Çalhanoğlu — free-kick specialist", "Arda Güler — teenage phenom", "Kenan Yıldız — breakout star"],
  // Group E
  Germany: ["Jamal Musiala — dribbling through lines", "Florian Wirtz — chance creation machine", "Joshua Kimmich — set-piece delivery"],
  Curaçao: ["Leandro Bacuna — engine room", "Juninho Bacuna — creative spark", "Rangelo Janga — hold-up play"],
  "Ivory Coast": ["Sébastien Haller — aerial dominance", "Franck Kessié — midfield powerhouse", "Simon Adingra — speed on the wing"],
  Ecuador: ["Moisés Caicedo — midfield engine", "Piero Hincapié — defensive wall", "Enner Valencia — big-game player"],
  // Group F
  Netherlands: ["Virgil van Dijk — defensive giant", "Cody Gakpo — versatile attacker", "Frenkie de Jong — tempo setter"],
  Japan: ["Kaoru Mitoma — dribbling wizard", "Takefusa Kubo — through-ball artist", "Takehiro Tomiyasu — defensive rock"],
  Sweden: ["Alexander Isak — silky finisher", "Dejan Kulusevski — creative force", "Victor Lindelöf — defensive leader"],
  Tunisia: ["Wahbi Khazri — veteran talisman", "Ellyes Skhiri — midfield engine", "Aïssa Laïdouni — pressing machine"],
  // Group G
  Belgium: ["Kevin De Bruyne — assist king", "Romelu Lukaku — bulldozer striker", "Jérémy Doku — electric winger"],
  Egypt: ["Mohamed Salah — king of the right wing", "Omar Marmoush — form of his life", "Mohamed Elneny — shield for the backline"],
  Iran: ["Mehdi Taremi — clinical poacher", "Sardar Azmoun — aerial threat", "Alireza Beiranvand — long-throw keeper"],
  "New Zealand": ["Chris Wood — Premier League target man", "Sarpreet Singh — creative midfielder", "Michael Boxall — defensive leader"],
  // Group H
  Spain: ["Lamine Yamal — teenage sensation", "Rodri — midfield metronome", "Dani Olmo — late runs into the box"],
  "Cape Verde": ["Ryan Mendes — speed on the counter", "Bebé — long-range rockets", "Vozinha — shot-stopper"],
  "Saudi Arabia": ["Salem Al-Dawsari — big-game player", "Saleh Al-Shehri — poacher's instinct", "Mohammed Al-Owais — shot-stopper"],
  Uruguay: ["Federico Valverde — long-range rockets", "Darwin Núñez — chaos in the box", "Ronald Araújo — defensive wall"],
  // Group I
  France: ["Kylian Mbappé — pace on the counter", "Antoine Griezmann — creative link-up", "Aurélien Tchouaméni — midfield dominance"],
  Senegal: ["Sadio Mané — relentless runner", "Ismaïla Sarr — speed threat", "Kalidou Koulibaly — defensive leader"],
  Iraq: ["Aymen Hussein — target striker", "Zidane Iqbal — midfield technician", "Jalal Hassan — experienced keeper"],
  Norway: ["Erling Haaland — goal machine", "Martin Ødegaard — creative captain", "Alexander Sørloth — physical presence"],
  // Group J
  Argentina: ["Lionel Messi — still the magician", "Julián Álvarez — relentless pressing", "Enzo Fernández — tempo controller"],
  Algeria: ["Riyad Mahrez — left-footed magic", "Ismaël Bennacer — midfield anchor", "Amine Gouiri — clinical finisher"],
  Austria: ["David Alaba — versatile leader", "Marcel Sabitzer — long-range threat", "Christoph Baumgartner — late runs"],
  Jordan: ["Mousa Al-Tamari — the Jordanian Messi", "Yazan Al-Naimat — pace merchant", "Ihsan Haddad — defensive rock"],
  // Group K
  Portugal: ["Cristiano Ronaldo — ultimate big-game player", "Bruno Fernandes — creative engine", "Rafael Leão — unstoppable on his day"],
  "DR Congo": ["Yoane Wissa — sharp finisher", "Gaël Kakuta — creative spark", "Chancel Mbemba — defensive leader"],
  Uzbekistan: ["Eldor Shomurodov — captain & talisman", "Jaloliddin Masharipov — creative midfielder", "Utkir Yusupov — reliable keeper"],
  Colombia: ["Luis Díaz — electrifying winger", "James Rodríguez — World Cup specialist", "Jhon Durán — breakthrough star"],
  // Group L
  England: ["Jude Bellingham — box-to-box engine", "Harry Kane — penalty-box predator", "Bukayo Saka — cut inside and fire"],
  Croatia: ["Luka Modrić — ageless magician", "Joško Gvardiol — defensive titan", "Mateo Kovačić — midfield elegance"],
  Ghana: ["Mohammed Kudus — explosive attacker", "Thomas Partey — midfield anchor", "Antoine Semenyo — physical presence"],
  Panama: ["Adalberto Carrasquilla — midfield engine", "José Fajardo — target striker", "Aníbal Godoy — veteran leader"],
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
    "hot-take": `🚨 AI SHOCK PREDICTION: ${winner === "Draw" ? "SPICY DRAW INCOMING" : supportedTeam.toUpperCase() + " WILL DOMINATE"}! ${shortVerdict.split(".")[0]}. ${tags.join(" ")}`,
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
