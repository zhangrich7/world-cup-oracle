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

/** Grab just the first sentence (up to ~100 chars) for a tight 1–2 line verdict. */
function firstSentence(text: string): string {
  const trimmed = text.trim();
  // Split on the first sentence-ending punctuation
  const match = trimmed.match(/^(.+?[.!?])\s/);
  if (match && match[1].length <= 120) return match[1];
  // Fallback: first 100 chars, snapped at word boundary
  if (trimmed.length <= 100) return trimmed;
  const cut = trimmed.slice(0, 100);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

const VIRAL_HOOKS: Record<string, string> = {
  bold: "Hot take incoming — built for the timeline",
  analytical: "AI-generated match insight — ready to share",
  emotional: "Straight from the stands to your feed",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Skeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Card placeholder */}
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
  variant?: "default" | "success" | "warning";
}) {
  const colors: Record<string, string> = {
    default: "bg-surface border-zinc-700 text-zinc-400",
    success: "bg-neon/10 border-neon/30 text-neon",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
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
        if (!res.ok) throw new Error(json.error || "Failed to load prediction");
        if (!cancelled) setLoadState({ status: "ok", data: json as FetchedPrediction });
      })
      .catch((err) => {
        if (!cancelled)
          setLoadState({
            status: "error",
            message: err instanceof Error ? err.message : "Failed to load prediction",
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
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
  if (loadState.status === "error") return <ErrorState message={loadState.message} />;
  if (!data) return <ErrorState message="No prediction data found." />;

  const p = data.prediction;
  const isFallback = data.source === "fallback";
  const hook = VIRAL_HOOKS[data.style] ?? VIRAL_HOOKS.analytical;
  const verdict = firstSentence(p.shortVerdict);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 sm:py-10">
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col gap-6">
        {/* ================================================================ */}
        {/*  STATUS BADGES                                                   */}
        {/* ================================================================ */}
        <div className="flex items-center justify-center gap-2">
          {isFallback && <Badge variant="warning">Offline AI Model</Badge>}
          {paid && <Badge variant="success">HD Unlocked ✓</Badge>}
          {!paid && !isFallback && (
            <Badge variant="default">Free Preview</Badge>
          )}
        </div>

        {/* ================================================================ */}
        {/*  OG IMAGE — the product, large and centered                       */}
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
          AI Prediction Card
        </p>

        {/* ================================================================ */}
        {/*  MATCH TITLE                                                     */}
        {/* ================================================================ */}
        <div className="text-center">
          <h1 className="text-xl font-black tracking-tight text-zinc-100">
            <span>{data.flagA} {data.teamA}</span>
            <span className="text-zinc-700 mx-2.5">vs</span>
            <span>{data.flagB} {data.teamB}</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">{data.stage}</p>
        </div>

        {/* Thin divider */}
        <div className="w-12 h-px bg-zinc-800 mx-auto" />

        {/* ================================================================ */}
        {/*  VIRAL HOOK                                                      */}
        {/* ================================================================ */}
        <p className="text-center text-xs text-zinc-500 italic">
          {hook}
        </p>

        {/* ================================================================ */}
        {/*  PREDICTION SUMMARY — score, winner, prob                        */}
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
        {/*  VERDICT — 1–2 lines only                                        */}
        {/* ================================================================ */}
        <p className="text-center text-sm text-zinc-400 leading-relaxed px-2">
          {verdict}
        </p>

        {/* Thin divider */}
        <div className="w-12 h-px bg-zinc-800 mx-auto" />

        {/* ================================================================ */}
        {/*  CONVERSION ZONE                                                 */}
        {/* ================================================================ */}
        <div className="space-y-2.5">
          {/* Primary: Copy caption */}
          <button
            onClick={handleCopyCaption}
            className="w-full py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon/90 transition-all text-sm"
          >
            {copyOk ? "Copied! ✓" : "Copy Caption for X / Instagram"}
          </button>

          {/* Secondary row */}
          {paid ? (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownload}
                className="py-2.5 bg-surface border border-zinc-700 text-zinc-200 font-semibold rounded-lg hover:border-zinc-500 transition-all text-sm"
              >
                Download PNG
              </button>
              <button
                onClick={handleOpenImage}
                className="py-2.5 bg-surface border border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:border-zinc-500 transition-all text-sm"
              >
                Open Image
              </button>
            </div>
          ) : (
            <PaymentButton predictionId={predictionId} />
          )}
        </div>

        {/* ================================================================ */}
        {/*  SUBTLE FOOTER                                                   */}
        {/* ================================================================ */}
        <div className="flex items-center justify-center gap-4 pt-2">
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
