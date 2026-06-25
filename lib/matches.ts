// Hardcoded 2026 FIFA World Cup matches — upcoming from June 25, 2026.
// This is the single source of truth. DeepSeek only predicts outcomes, never fixtures.

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string; // emoji flag
  flagB: string;
  date: string; // ISO date
  kickoff: string; // UTC time
  stage: string;
  venue: string;
}

export type PredictionStyle = "bold" | "analytical" | "emotional";
export type Language = "en" | "es" | "fr" | "de" | "pt" | "ar" | "ja" | "zh";

export const MATCHES: Match[] = [
  // === GROUP STAGE FINALES (June 25–27) ===
  {
    id: "grp-fra-per",
    teamA: "France",
    teamB: "Peru",
    flagA: "🇫🇷",
    flagB: "🇵🇪",
    date: "2026-06-25",
    kickoff: "17:00 UTC",
    stage: "Group D",
    venue: "MetLife Stadium, East Rutherford",
  },
  {
    id: "grp-bra-egy",
    teamA: "Brazil",
    teamB: "Egypt",
    flagA: "🇧🇷",
    flagB: "🇪🇬",
    date: "2026-06-25",
    kickoff: "21:00 UTC",
    stage: "Group G",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "grp-arg-ksa",
    teamA: "Argentina",
    teamB: "Saudi Arabia",
    flagA: "🇦🇷",
    flagB: "🇸🇦",
    date: "2026-06-26",
    kickoff: "17:00 UTC",
    stage: "Group A",
    venue: "Estadio Azteca, Mexico City",
  },
  {
    id: "grp-ger-jpn",
    teamA: "Germany",
    teamB: "Japan",
    flagA: "🇩🇪",
    flagB: "🇯🇵",
    date: "2026-06-26",
    kickoff: "21:00 UTC",
    stage: "Group E",
    venue: "AT&T Stadium, Arlington",
  },
  {
    id: "grp-esp-uru",
    teamA: "Spain",
    teamB: "Uruguay",
    flagA: "🇪🇸",
    flagB: "🇺🇾",
    date: "2026-06-27",
    kickoff: "17:00 UTC",
    stage: "Group B",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "grp-eng-can",
    teamA: "England",
    teamB: "Canada",
    flagA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flagB: "🇨🇦",
    date: "2026-06-27",
    kickoff: "21:00 UTC",
    stage: "Group C",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },

  // === ROUND OF 32 (June 28 – July 3) ===
  {
    id: "r32-1",
    teamA: "Winner Group A",
    teamB: "3rd Place Group C/F",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-06-28",
    kickoff: "17:00 UTC",
    stage: "Round of 32",
    venue: "MetLife Stadium, East Rutherford",
  },
  {
    id: "r32-2",
    teamA: "Winner Group C",
    teamB: "Runner-up Group F",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-06-28",
    kickoff: "21:00 UTC",
    stage: "Round of 32",
    venue: "Levi's Stadium, Santa Clara",
  },
  {
    id: "r32-3",
    teamA: "Winner Group E",
    teamB: "Runner-up Group A",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-06-29",
    kickoff: "17:00 UTC",
    stage: "Round of 32",
    venue: "AT&T Stadium, Arlington",
  },
  {
    id: "r32-4",
    teamA: "Winner Group G",
    teamB: "Runner-up Group D",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-06-29",
    kickoff: "21:00 UTC",
    stage: "Round of 32",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "r32-5",
    teamA: "Winner Group B",
    teamB: "3rd Place Group A/E",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-06-30",
    kickoff: "17:00 UTC",
    stage: "Round of 32",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "r32-6",
    teamA: "Winner Group F",
    teamB: "Runner-up Group C",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-06-30",
    kickoff: "21:00 UTC",
    stage: "Round of 32",
    venue: "Arrowhead Stadium, Kansas City",
  },

  // === ROUND OF 16 (July 4–7) ===
  {
    id: "r16-1",
    teamA: "Winner R32-1",
    teamB: "Winner R32-3",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-04",
    kickoff: "17:00 UTC",
    stage: "Round of 16",
    venue: "MetLife Stadium, East Rutherford",
  },
  {
    id: "r16-2",
    teamA: "Winner R32-2",
    teamB: "Winner R32-4",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-05",
    kickoff: "21:00 UTC",
    stage: "Round of 16",
    venue: "SoFi Stadium, Los Angeles",
  },

  // === QUARTER-FINALS (July 9–11) ===
  {
    id: "qf-1",
    teamA: "Winner R16-1",
    teamB: "Winner R16-2",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-09",
    kickoff: "17:00 UTC",
    stage: "Quarter-Final",
    venue: "AT&T Stadium, Arlington",
  },
  {
    id: "qf-2",
    teamA: "Winner R16-3",
    teamB: "Winner R16-4",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-10",
    kickoff: "21:00 UTC",
    stage: "Quarter-Final",
    venue: "Hard Rock Stadium, Miami",
  },

  // === SEMI-FINALS (July 14–15) ===
  {
    id: "sf-1",
    teamA: "Winner QF-1",
    teamB: "Winner QF-2",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-14",
    kickoff: "17:00 UTC",
    stage: "Semi-Final",
    venue: "MetLife Stadium, East Rutherford",
  },

  // === FINAL (July 19) ===
  {
    id: "final",
    teamA: "Winner SF-1",
    teamB: "Winner SF-2",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-19",
    kickoff: "17:00 UTC",
    stage: "FIFA World Cup Final",
    venue: "MetLife Stadium, East Rutherford",
  },
];

export function getMatchById(id: string): Match | undefined {
  return MATCHES.find((m) => m.id === id);
}

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
  { value: "ar", label: "العربية" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
];

export const STYLES: { value: PredictionStyle; label: string; desc: string }[] = [
  { value: "bold", label: "Bold", desc: "Hot takes, strong opinions, no hedging" },
  { value: "analytical", label: "Analytical", desc: "Data-driven, tactical breakdown" },
  { value: "emotional", label: "Emotional", desc: "Passionate, dramatic, fan perspective" },
];
