import { NextRequest, NextResponse } from "next/server";
import { getPrediction } from "@/lib/store";

/**
 * GET /api/prediction?id=<predictionId>
 *
 * Fetches a stored prediction by its ID.
 * Returns 404 if not found.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing required parameter: id" },
      { status: 400 }
    );
  }

  const stored = getPrediction(id);

  if (!stored) {
    return NextResponse.json(
      { error: "Prediction not found. It may have expired or the ID is invalid." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    predictionId: stored.predictionId,
    matchId: stored.matchId,
    teamA: stored.teamA,
    teamB: stored.teamB,
    flagA: stored.flagA,
    flagB: stored.flagB,
    stage: stored.stage,
    supportedTeam: stored.supportedTeam,
    style: stored.style,
    language: stored.language,
    prediction: stored.prediction,
    source: stored.source,
  });
}
