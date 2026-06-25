// ---------------------------------------------------------------------------
// In-memory prediction store — MVP, no database.
// Single source of truth for predictionId → prediction data.
//
// Uses globalThis so state survives Next.js dev-mode on-demand compilation
// (each route compile creates a fresh module context otherwise).
// On Vercel Node.js runtime, warm Lambdas in the same region share memory.
// ---------------------------------------------------------------------------

import type { Prediction } from "./deepseek";
import type { PredictionStyle, Language } from "./matches";

export interface StoredPrediction {
  predictionId: string;
  createdAt: number;

  // Match metadata (from lib/matches.ts)
  matchId: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  stage: string;

  // User choices
  supportedTeam: string;
  style: PredictionStyle;
  language: Language;

  // Prediction output (from DeepSeek or fallback)
  prediction: Prediction;

  // "ai" | "fallback"
  source: string;
}

// ---- globalThis-backed store (survives Next.js dev-mode recompilation) ----
const GLOBAL_KEY = "__world_cup_prediction_store__";

function getStore(): Map<string, StoredPrediction> {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new Map<string, StoredPrediction>();
  }
  return g[GLOBAL_KEY] as Map<string, StoredPrediction>;
}

/** Store a prediction. Returns the full StoredPrediction record. */
export function setPrediction(
  predictionId: string,
  data: Omit<StoredPrediction, "predictionId" | "createdAt">
): StoredPrediction {
  const record: StoredPrediction = {
    ...data,
    predictionId,
    createdAt: Date.now(),
  };
  getStore().set(predictionId, record);
  return record;
}

/** Retrieve a prediction by ID. Returns undefined if not found. */
export function getPrediction(
  predictionId: string
): StoredPrediction | undefined {
  return getStore().get(predictionId);
}

/** Remove a prediction (cleanup). */
export function deletePrediction(predictionId: string): boolean {
  return getStore().delete(predictionId);
}

/** How many predictions are currently stored. */
export function storeSize(): number {
  return getStore().size;
}
