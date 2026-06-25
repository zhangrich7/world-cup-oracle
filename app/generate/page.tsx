"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MATCHES,
  LANGUAGES,
  STYLES,
  type PredictionStyle,
  type Language,
} from "@/lib/matches";

interface PredictApiResponse {
  predictionId: string;
  prediction: {
    predictedScore: string;
    winner: string;
    winProbability: string;
    keyPlayer: string;
    upsetFactor: string;
    shortVerdict: string;
    socialCaption: string;
  };
  _source?: string;
}

export default function GeneratePage() {
  const router = useRouter();

  const [matchId, setMatchId] = useState("");
  const [supportedTeam, setSupportedTeam] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [style, setStyle] = useState<PredictionStyle>("bold");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedMatch = useMemo(
    () => MATCHES.find((m) => m.id === matchId),
    [matchId]
  );

  const handleGenerate = async () => {
    setError("");

    if (!matchId) {
      setError("Please select a match.");
      return;
    }
    if (!supportedTeam) {
      setError("Please choose which team you support.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, supportedTeam, language, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Prediction failed. Try again.");
        setLoading(false);
        return;
      }

      const result = data as PredictApiResponse;

      // Only pass predictionId in the URL — single source of truth
      router.push(`/result?predictionId=${encodeURIComponent(result.predictionId)}`);
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
        >
          ← Back
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          Generate <span className="text-neon">Prediction</span>
        </h1>
        <p className="text-zinc-500 mb-8">
          Select a match and your side. AI does the rest.
        </p>

        <div className="space-y-6">
          {/* Match selector */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Select Match
            </label>
            <select
              value={matchId}
              onChange={(e) => {
                setMatchId(e.target.value);
                setSupportedTeam("");
              }}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/30 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Choose a match...
              </option>
              {MATCHES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.flagA} {m.teamA} vs {m.teamB} {m.flagB} — {m.stage} (
                  {m.date})
                </option>
              ))}
            </select>
          </div>

          {/* Team selector */}
          {selectedMatch && (
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                I Support
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[selectedMatch.teamA, selectedMatch.teamB].map((team) => (
                  <button
                    key={team}
                    onClick={() => setSupportedTeam(team)}
                    className={`px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
                      supportedTeam === team
                        ? "border-neon bg-neon/10 text-neon shadow-[0_0_15px_rgba(0,255,170,0.15)]"
                        : "border-zinc-700 bg-surface text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    {team === selectedMatch.teamA
                      ? `${selectedMatch.flagA} ${team}`
                      : `${selectedMatch.flagB} ${team}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/30 transition-all appearance-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Prediction Style
            </label>
            <div className="space-y-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    style === s.value
                      ? "border-neon bg-neon/10 text-neon shadow-[0_0_15px_rgba(0,255,170,0.15)]"
                      : "border-zinc-700 bg-surface text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  <span className="font-semibold text-sm block text-zinc-200">
                    {s.label}
                  </span>
                  <span className="text-xs text-zinc-500">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-neon text-black font-bold text-lg rounded-lg hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(0,255,170,0.25)]"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating Prediction...
              </span>
            ) : (
              "Generate Prediction →"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
