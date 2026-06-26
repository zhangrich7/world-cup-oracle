"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PaymentButton from "@/components/PaymentButton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FetchedPrediction {
  predictionId: string;
  matchId: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  stage: string;
  supportedTeam: string;
  style: string;
  prediction: {
    predictedScore: string;
    winner: string;
    winProbability: string;
    keyPlayer: string;
    upsetFactor: string;
    shortVerdict: string;
    socialCaption: string;
  };
  source: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: FetchedPrediction };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^(.+?[.!?])\s/);
  if (match && match[1].length <= 120) return match[1];
  if (trimmed.length <= 100) return trimmed;
  const cut = trimmed.slice(0, 100);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

/** Parse probability string like "72%" or "Even (50%)" → number */
function parseProb(str: string): number {
  const match = str.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 50;
}

/** Dynamic viral headline based on actual prediction data */
function getViralHeadline(data: FetchedPrediction): {
  text: string;
  subtext: string;
  color: string;
} {
  const p = data.prediction;
  const prob = parseProb(p.winProbability);
  const isDraw =
    p.winner === "Draw" ||
    p.winner.toLowerCase() === "draw" ||
    p.winProbability.toLowerCase().includes("even");

  if (isDraw) {
    return {
      text: "⚡ THIS MATCH IS NOT SAFE",
      subtext: "AI says too close to call — screenshot this",
      color: "text-yellow-400",
    };
  }
  if (prob >= 75) {
    return {
      text: "🤖 AI ORACLE FORECAST",
      subtext: `Heavy favorite — ${p.winner} expected to dominate`,
      color: "text-neon",
    };
  }
  if (prob >= 60) {
    return {
      text: `📊 ${prob}% EDGE — AI PREDICTS`,
      subtext: `${p.winner} has the edge but anything can happen`,
      color: "text-neon",
    };
  }
  if (prob >= 50) {
    return {
      text: "⚔️ THIS COULD GO WRONG",
      subtext: "Thin margins — one moment flips everything",
      color: "text-yellow-400",
    };
  }
  return {
    text: "🚨 UPSET ALERT — SHOCK INCOMING",
    subtext: "The underdog has a real shot here",
    color: "text-red-400",
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Skeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md aspect-[1200/630] rounded-xl bg-surface animate-pulse" />
        <div className="h-4 w-48 bg-surface rounded animate-pulse" />
        <div className="h-3 w-32 bg-surface rounded animate-pulse" />
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-red-400 text-sm">{message}</p>
        <Link
          href="/generate"
          className="inline-block px-6 py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon/90 transition-all"
        >
          Generate a prediction →
        </Link>
      </div>
    </main>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "premium";
}) {
  const colors: Record<string, string> = {
    default: "bg-surface border-zinc-700 text-zinc-400",
    success: "bg-neon/10 border-neon/30 text-neon",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    premium:
      "bg-gradient-to-r from-neon/10 to-yellow-500/10 border-neon/40 text-neon",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main content
// ---------------------------------------------------------------------------

function ResultContent() {
  const searchParams = useSearchParams();
  const predictionId = searchParams.get("predictionId") ?? "";
  const paid = searchParams.get("paid") === "true";

  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [copyOk, setCopyOk] = useState(false);

  // ---- Fetch prediction by ID ----
  useEffect(() => {
    if (!predictionId) {
      setLoadState({ status: "error", message: "No prediction ID in URL." });
      return;
    }

    let cancelled = false;

    fetch(`/api/prediction?id=${encodeURIComponent(predictionId)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok)
          throw new Error(json.error || "Failed to load prediction");
        if (!cancelled)
          setLoadState({ status: "ok", data: json as FetchedPrediction });
      })
      .catch((err) => {
        if (!cancelled)
          setLoadState({
            status: "error",
            message:
              err instanceof Error ? err.message : "Failed to load prediction",
          });
      });

    return () => {
      cancelled = true;
    };
  }, [predictionId]);

  // ---- Derived ----
  const data = loadState.status === "ok" ? loadState.data : null;

  const ogUrl = (() => {
    if (!predictionId) return "";
    const base = process.env.NEXT_PUBLIC_SITE_URL || "";
    return `${base}/api/og?id=${encodeURIComponent(predictionId)}&paid=${paid ? "true" : "false"}`;
  })();

  // ---- Actions ----
  const handleCopyCaption = useCallback(async () => {
    if (!data) return;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const text = `${data.prediction.socialCaption}\n\n${siteUrl}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopyOk(true);
    setTimeout(() => setCopyOk(false), 2000);
  }, [data]);

  const handleDownload = useCallback(async () => {
    if (!ogUrl) return;
    try {
      const res = await fetch(ogUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `world-cup-prediction-${predictionId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(ogUrl, "_blank");
    }
  }, [ogUrl, predictionId]);

  const handleOpenImage = useCallback(() => {
    if (ogUrl) window.open(ogUrl, "_blank");
  }, [ogUrl]);

  // ---- States ----
  if (loadState.status === "loading") return <Skeleton />;
  if (loadState.status === "error")
    return <ErrorState message={loadState.message} />;
  if (!data) return <ErrorState message="No prediction data found." />;

  const p = data.prediction;
  const isFallback = data.source === "fallback";
  const headline = getViralHeadline(data);
  const verdict = firstSentence(p.shortVerdict);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 sm:py-10">
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col gap-5">
        {/* ================================================================ */}
        {/*  STATUS BADGES                                                   */}
        {/* ================================================================ */}
        <div className="flex items-center justify-center gap-2">
          {isFallback && <Badge variant="warning">Offline AI Model</Badge>}
          {paid && <Badge variant="premium">✨ HD UNLOCKED</Badge>}
          {!paid && !isFallback && <Badge variant="default">Free Preview</Badge>}
        </div>

        {/* ================================================================ */}
        {/*  OG IMAGE — the product                                          */}
        {/* ================================================================ */}
        <div className="rounded-xl overflow-hidden border border-zinc-700/50 shadow-[0_0_60px_rgba(0,255,170,0.06)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogUrl}
            alt="World Cup prediction share card"
            className="w-full h-auto block"
          />
        </div>

        <p className="text-center text-[11px] text-zinc-600 tracking-widest uppercase">
          {paid ? "✦ HD Prediction Card" : "AI Prediction Card — Free Preview"}
        </p>

        {/* ================================================================ */}
        {/*  MATCH TITLE                                                     */}
        {/* ================================================================ */}
        <div className="text-center">
          <h1 className="text-xl font-black tracking-tight text-zinc-100">
            <span>
              {data.flagA} {data.teamA}
            </span>
            <span className="text-zinc-700 mx-2.5">vs</span>
            <span>
              {data.flagB} {data.teamB}
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">{data.stage}</p>
        </div>

        {/* Thin divider */}
        <div className="w-12 h-px bg-zinc-800 mx-auto" />

        {/* ================================================================ */}
        {/*  VIRAL HEADLINE — dynamic based on prediction data                */}
        {/* ================================================================ */}
        <div className="text-center space-y-1.5">
          <p
            className={`text-lg font-black tracking-tight ${headline.color}`}
          >
            {headline.text}
          </p>
          <p className="text-xs text-zinc-500">{headline.subtext}</p>
        </div>

        {/* ================================================================ */}
        {/*  PREDICTION SUMMARY                                              */}
        {/* ================================================================ */}
        <div className="text-center">
          <p className="text-5xl font-black text-neon tracking-widest">
            {p.predictedScore}
          </p>
          <p className="text-sm text-zinc-300 mt-2 font-semibold">
            <span className="text-neon">{p.winner}</span>
            <span className="text-zinc-600 mx-1.5">·</span>
            <span className="text-zinc-400 font-normal">{p.winProbability}</span>
          </p>
        </div>

        {/* ================================================================ */}
        {/*  VERDICT                                                         */}
        {/* ================================================================ */}
        <p className="text-center text-sm text-zinc-400 leading-relaxed px-2">
          {verdict}
        </p>

        {/* Thin divider */}
        <div className="w-12 h-px bg-zinc-800 mx-auto" />

        {/* ================================================================ */}
        {/*  SHARE ACTIONS                                                   */}
        {/* ================================================================ */}
        <div className="space-y-2.5">
          {/* Copy caption — always available */}
          <button
            onClick={handleCopyCaption}
            className="w-full py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon/90 transition-all text-sm"
          >
            {copyOk ? "Copied! ✓" : "Copy Caption for X / Instagram"}
          </button>

          {paid ? (
            /* ===== PAID: HD download + open ===== */
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleDownload}
                  className="py-2.5 bg-surface border border-neon/30 text-neon font-semibold rounded-lg hover:border-neon/60 transition-all text-sm"
                >
                  ⬇ Download HD PNG
                </button>
                <button
                  onClick={handleOpenImage}
                  className="py-2.5 bg-surface border border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:border-zinc-500 transition-all text-sm"
                >
                  ↗ Open Image
                </button>
              </div>
              <p className="text-center text-[11px] text-zinc-600">
                No watermark • Premium quality • Ready to post
              </p>
            </>
          ) : (
            /* ===== FREE: upgrade CTA ===== */
            <>
              <PaymentButton predictionId={predictionId} />

              {/* ---- Upgrade benefits section — high contrast, conversion-focused ---- */}
              <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-surface to-zinc-900 border-2 border-neon/20 shadow-[0_0_30px_rgba(0,255,170,0.06)]">
                <h3 className="text-base font-black text-neon mb-1 text-center tracking-tight">
                  Unlock HD Prediction Card
                </h3>
                <p className="text-xs text-zinc-500 text-center mb-4">
                  Premium cyberpunk design — built for social media
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-0.5 text-sm">✦</span>
                    <span>
                      HD no-watermark image — clean and share-ready
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-0.5 text-sm">✦</span>
                    <span>
                      Premium cyberpunk design — stands out on any feed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-0.5 text-sm">✦</span>
                    <span>
                      Optimized for Instagram / X — better than screenshots
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-0.5 text-sm">✦</span>
                    <span>
                      One-time payment — no subscriptions, no nonsense
                    </span>
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-zinc-800/50 text-center">
                  <span className="text-[11px] text-zinc-500">
                    ⚡ Most fans unlock in under 60 seconds
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ================================================================ */}
        {/*  FOOTER                                                          */}
        {/* ================================================================ */}
        <div className="flex items-center justify-center gap-4 pt-1 pb-4">
          <Link
            href="/generate"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            New prediction
          </Link>
          <span className="text-zinc-800">·</span>
          <a
            href="/"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Home
          </a>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Page export (Suspense boundary required by useSearchParams)
// ---------------------------------------------------------------------------

export default function ResultPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ResultContent />
    </Suspense>
  );
}
