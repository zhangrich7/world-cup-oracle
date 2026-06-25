import { NextRequest, NextResponse } from "next/server";
import { getMatchById, type Language, type PredictionStyle } from "@/lib/matches";
import { predictMatch } from "@/lib/deepseek";
import { setPrediction } from "@/lib/store";

const VALID_LANGUAGES: Language[] = ["en", "es", "fr", "de", "pt", "ar", "ja", "zh"];
const VALID_STYLES: PredictionStyle[] = ["bold", "analytical", "emotional"];

/**
 * POST /api/predict
 *
 * Body: { matchId, supportedTeam, language, style }
 *
 * Validates matchId against lib/matches.ts (the hardcoded fixture list).
 * Calls DeepSeek (or fallback). Stores prediction in memory.
 *
 * Returns: { predictionId, prediction: {...}, _source }
 */
export async function POST(request: NextRequest) {
  try {
    // -- Parse body --
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const { matchId, supportedTeam, language, style } = body as {
      matchId?: string;
      supportedTeam?: string;
      language?: string;
      style?: string;
    };

    // -- Required fields --
    if (!matchId || !supportedTeam || !language || !style) {
      return NextResponse.json(
        { error: "Missing required fields: matchId, supportedTeam, language, style." },
        { status: 400 }
      );
    }

    // -- Validate matchId against hardcoded fixture list --
    const match = getMatchById(matchId);
    if (!match) {
      return NextResponse.json(
        { error: `Invalid matchId: "${matchId}". Match not found in official fixture list.` },
        { status: 400 }
      );
    }

    // -- Validate supportedTeam is actually in this match --
    if (supportedTeam !== match.teamA && supportedTeam !== match.teamB) {
      return NextResponse.json(
        { error: `supportedTeam must be either "${match.teamA}" or "${match.teamB}".` },
        { status: 400 }
      );
    }

    // -- Validate language --
    if (!VALID_LANGUAGES.includes(language as Language)) {
      return NextResponse.json(
        { error: `Invalid language. Must be one of: ${VALID_LANGUAGES.join(", ")}.` },
        { status: 400 }
      );
    }

    // -- Validate style --
    if (!VALID_STYLES.includes(style as PredictionStyle)) {
      return NextResponse.json(
        { error: `Invalid style. Must be one of: ${VALID_STYLES.join(", ")}.` },
        { status: 400 }
      );
    }

    // -- Generate prediction (AI or fallback) --
    const result = await predictMatch(
      match,
      supportedTeam,
      style as PredictionStyle,
      language as Language
    );

    // -- Generate predictionId and store --
    const predictionId = crypto.randomUUID();

    setPrediction(predictionId, {
      matchId: match.id,
      teamA: match.teamA,
      teamB: match.teamB,
      flagA: match.flagA,
      flagB: match.flagB,
      stage: match.stage,
      supportedTeam,
      style: style as PredictionStyle,
      language: language as Language,
      prediction: result.prediction,
      source: result.source,
    });

    return NextResponse.json({
      predictionId,
      prediction: result.prediction,
      _source: result.source,
    });
  } catch (err) {
    console.error("Predict API unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
