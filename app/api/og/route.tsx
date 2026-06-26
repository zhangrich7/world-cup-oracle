import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { getPrediction } from "@/lib/store";

// ---------------------------------------------------------------------------
// 1200×630 OG share card — viral-optimized for X / Instagram.
//
// Layout (top to bottom):
//   1. Viral headline badge (top center)
//   2. Team flags + names
//   3. Score (MASSIVE, the focal point)
//   4. Winner + probability
//   5. Watermark (free only) or "HD UNLOCKED" badge (paid)
//
// Satori rules: every multi-child <div> needs explicit display: flex.
// No textShadow, backdrop-filter, or CSS Grid.
// ---------------------------------------------------------------------------

const BG = "#09090b";
const NEON = "#00ffaa";
const WHITE = "#f4f4f5";
const MUTED = "#71717a";

/** Parse probability string like "72%" or "Even (50%)" → number */
function parseProb(str: string): number {
  const match = str.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 50;
}

/** Build the viral headline + background color */
function viralBadge(prob: string, score: string): { text: string; bg: string; color: string } {
  const pct = parseProb(prob);
  const isDraw = score.toLowerCase().includes("even") || score.toLowerCase().includes("draw") || prob.toLowerCase().includes("even");

  if (isDraw) {
    return { text: "⚡ TOO CLOSE TO CALL", bg: "rgba(250,204,21,0.12)", color: "#facc15" };
  }
  if (pct >= 70) {
    return { text: `🤖 AI MATCH ORACLE`, bg: "rgba(0,255,170,0.10)", color: NEON };
  }
  if (pct >= 55) {
    return { text: `📊 ${pct}% EDGE`, bg: "rgba(0,255,170,0.08)", color: NEON };
  }
  return { text: "🚨 UPSET ALERT", bg: "rgba(239,68,68,0.12)", color: "#ef4444" };
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || "http://localhost:3000";
  const domain = siteUrl.replace(/^https?:\/\//, "");

  const badge = viralBadge(prob, score);

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
          gap: 28,
        }}
      >
        {/* ============================================================ */}
        {/*  LAYER 1 — Viral headline badge                               */}
        {/* ============================================================ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 28px",
            borderRadius: 999,
            backgroundColor: badge.bg,
            border: `1.5px solid ${badge.color}30`,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: badge.color,
              letterSpacing: "0.08em",
            }}
          >
            {badge.text}
          </span>
        </div>

        {/* ============================================================ */}
        {/*  LAYER 2 — Teams (medium, below badge)                        */}
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
              gap: 14,
            }}
          >
            <span style={{ fontSize: 56, lineHeight: 1 }}>{flagA}</span>
            <span
              style={{
                fontSize: 36,
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
              fontSize: 18,
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
              gap: 14,
            }}
          >
            <span style={{ fontSize: 56, lineHeight: 1 }}>{flagB}</span>
            <span
              style={{
                fontSize: 36,
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
        {/*  LAYER 3 — Score (MASSIVE, center, dominant)                  */}
        {/* ============================================================ */}
        <span
          style={{
            fontSize: 130,
            fontWeight: 900,
            color: NEON,
            letterSpacing: "0.06em",
            lineHeight: 1,
          }}
        >
          {score}
        </span>

        {/* ============================================================ */}
        {/*  LAYER 4 — Winner + probability (small, bottom)               */}
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
              fontSize: 20,
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
              fontSize: 18,
              fontWeight: 500,
              color: MUTED,
            }}
          >
            {prob}
          </span>
        </div>

        {/* ============================================================ */}
        {/*  WATERMARK — free version only                                */}
        {/* ============================================================ */}
        {!paid && (
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.12)",
                letterSpacing: "0.04em",
              }}
            >
              Generate yours at {domain}
            </span>
          </div>
        )}

        {/* ============================================================ */}
        {/*  HD UNLOCKED badge — paid version only                        */}
        {/* ============================================================ */}
        {paid && (
          <div
            style={{
              position: "absolute",
              bottom: 28,
              right: 40,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
              borderRadius: 999,
              backgroundColor: "rgba(0,255,170,0.10)",
              border: "1.5px solid rgba(0,255,170,0.25)",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: NEON,
                letterSpacing: "0.06em",
              }}
            >
              HD UNLOCKED ✦
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
