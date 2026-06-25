import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { getPrediction } from "@/lib/store";

// ---------------------------------------------------------------------------
// 1200×630 OG share card — optimized for X / Instagram feed clarity.
//
// 3 visual layers only:
//   1. Team names (medium, top third)
//   2. Score (VERY large, center — the focal point)
//   3. Winner + probability (small, bottom third)
//
// Satori rules: every multi-child <div> needs explicit display: flex.
// No textShadow, backdrop-filter, or CSS Grid.
// ---------------------------------------------------------------------------

const BG = "#09090b";
const NEON = "#00ffaa";
const WHITE = "#f4f4f5";
const MUTED = "#71717a";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const paid = searchParams.get("paid") === "true";

  const stored = id ? getPrediction(id) : undefined;

  const teamA = stored?.teamA ?? "Team A";
  const teamB = stored?.teamB ?? "Team B";
  const flagA = stored?.flagA ?? "";
  const flagB = stored?.flagB ?? "";
  const score = stored?.prediction?.predictedScore ?? "?-?";
  const winner = stored?.prediction?.winner ?? "";
  const prob = stored?.prediction?.winProbability ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 1200,
          height: 630,
          backgroundColor: BG,
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          position: "relative",
          overflow: "hidden",
          gap: 32,
        }}
      >
        {/* ============================================================ */}
        {/*  LAYER 1 — Teams (medium, top)                               */}
        {/* ============================================================ */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
          }}
        >
          {/* Team A */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 64, lineHeight: 1 }}>{flagA}</span>
            <span
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: WHITE,
                letterSpacing: "-0.02em",
              }}
            >
              {teamA}
            </span>
          </div>

          {/* VS */}
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: MUTED,
              letterSpacing: "0.1em",
            }}
          >
            VS
          </span>

          {/* Team B */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 64, lineHeight: 1 }}>{flagB}</span>
            <span
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: WHITE,
                letterSpacing: "-0.02em",
              }}
            >
              {teamB}
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  LAYER 2 — Score (VERY large, center, dominant)              */}
        {/* ============================================================ */}
        <span
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: NEON,
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {score}
        </span>

        {/* ============================================================ */}
        {/*  LAYER 3 — Winner + probability (small, bottom)              */}
        {/* ============================================================ */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: NEON,
            }}
          >
            {winner}
          </span>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: MUTED,
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: MUTED,
            }}
          >
            {prob}
          </span>
        </div>

        {/* ============================================================ */}
        {/*  WATERMARK — only on free version                            */}
        {/* ============================================================ */}
        {!paid && (
          <div
            style={{
              position: "absolute",
              bottom: 32,
              right: 48,
              display: "flex",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.10)",
                letterSpacing: "0.06em",
              }}
            >
              Generated by AI Predictor
            </span>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
