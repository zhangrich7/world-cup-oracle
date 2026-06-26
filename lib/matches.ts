// Real 2026 FIFA World Cup matches — sourced from FIFA.com
// This is the single source of truth. DeepSeek only predicts outcomes, never fixtures.

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string; // emoji flag
  flagB: string;
  date: string; // ISO date
  kickoff: string; // ET
  stage: string;
  venue: string;
}

export type PredictionStyle = "bold" | "analytical" | "emotional" | "hot-take";
export type Language = "en" | "es" | "fr" | "de" | "pt" | "ar" | "ja" | "zh";

export const MATCHES: Match[] = [
  // =========================================================================
  //  GROUP STAGE — Matchday 3 (June 26–27)
  // =========================================================================

  // --- Group G (June 26) ---
  {
    id: "grp-g-egy-irn",
    teamA: "Egypt",
    teamB: "Iran",
    flagA: "🇪🇬",
    flagB: "🇮🇷",
    date: "2026-06-26",
    kickoff: "11:00 PM ET",
    stage: "Group G",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "grp-g-nzl-bel",
    teamA: "New Zealand",
    teamB: "Belgium",
    flagA: "🇳🇿",
    flagB: "🇧🇪",
    date: "2026-06-26",
    kickoff: "11:00 PM ET",
    stage: "Group G",
    venue: "BC Place, Vancouver",
  },

  // --- Group H (June 26) ---
  {
    id: "grp-h-cpv-ksa",
    teamA: "Cape Verde",
    teamB: "Saudi Arabia",
    flagA: "🇨🇻",
    flagB: "🇸🇦",
    date: "2026-06-26",
    kickoff: "8:00 PM ET",
    stage: "Group H",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "grp-h-uru-esp",
    teamA: "Uruguay",
    teamB: "Spain",
    flagA: "🇺🇾",
    flagB: "🇪🇸",
    date: "2026-06-26",
    kickoff: "8:00 PM ET",
    stage: "Group H",
    venue: "Estadio Akron, Guadalajara",
  },

  // --- Group I (June 26) ---
  {
    id: "grp-i-nor-fra",
    teamA: "Norway",
    teamB: "France",
    flagA: "🇳🇴",
    flagB: "🇫🇷",
    date: "2026-06-26",
    kickoff: "3:00 PM ET",
    stage: "Group I",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "grp-i-sen-irq",
    teamA: "Senegal",
    teamB: "Iraq",
    flagA: "🇸🇳",
    flagB: "🇮🇶",
    date: "2026-06-26",
    kickoff: "3:00 PM ET",
    stage: "Group I",
    venue: "BMO Field, Toronto",
  },

  // --- Group J (June 27) ---
  {
    id: "grp-j-alg-aut",
    teamA: "Algeria",
    teamB: "Austria",
    flagA: "🇩🇿",
    flagB: "🇦🇹",
    date: "2026-06-27",
    kickoff: "10:00 PM ET",
    stage: "Group J",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "grp-j-jor-arg",
    teamA: "Jordan",
    teamB: "Argentina",
    flagA: "🇯🇴",
    flagB: "🇦🇷",
    date: "2026-06-27",
    kickoff: "10:00 PM ET",
    stage: "Group J",
    venue: "AT&T Stadium, Dallas",
  },

  // --- Group K (June 27) ---
  {
    id: "grp-k-col-por",
    teamA: "Colombia",
    teamB: "Portugal",
    flagA: "🇨🇴",
    flagB: "🇵🇹",
    date: "2026-06-27",
    kickoff: "7:30 PM ET",
    stage: "Group K",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "grp-k-cod-uzb",
    teamA: "DR Congo",
    teamB: "Uzbekistan",
    flagA: "🇨🇩",
    flagB: "🇺🇿",
    date: "2026-06-27",
    kickoff: "7:30 PM ET",
    stage: "Group K",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },

  // --- Group L (June 27) ---
  {
    id: "grp-l-pan-eng",
    teamA: "Panama",
    teamB: "England",
    flagA: "🇵🇦",
    flagB: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    date: "2026-06-27",
    kickoff: "5:00 PM ET",
    stage: "Group L",
    venue: "MetLife Stadium, East Rutherford",
  },
  {
    id: "grp-l-cro-gha",
    teamA: "Croatia",
    teamB: "Ghana",
    flagA: "🇭🇷",
    flagB: "🇬🇭",
    date: "2026-06-27",
    kickoff: "5:00 PM ET",
    stage: "Group L",
    venue: "Lincoln Financial Field, Philadelphia",
  },

  // =========================================================================
  //  ROUND OF 32 (June 28 – July 3)
  // =========================================================================

  {
    id: "r32-1",
    teamA: "Runner-up Group A",
    teamB: "Runner-up Group B",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-06-28",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "r32-ger-3rd",
    teamA: "Germany",
    teamB: "3rd Place Group A/B/C/D/F",
    flagA: "🇩🇪",
    flagB: "🏆",
    date: "2026-06-29",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "r32-f1-mar",
    teamA: "Winner Group F",
    teamB: "Morocco",
    flagA: "🏆",
    flagB: "🇲🇦",
    date: "2026-06-29",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "Estadio BBVA, Monterrey",
  },
  {
    id: "r32-bra-jpn",
    teamA: "Brazil",
    teamB: "Japan",
    flagA: "🇧🇷",
    flagB: "🇯🇵",
    date: "2026-06-29",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "r32-fra-3rd",
    teamA: "France",
    teamB: "3rd Place Group C/D/F/G/H",
    flagA: "🇫🇷",
    flagB: "🏆",
    date: "2026-06-30",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "MetLife Stadium, East Rutherford",
  },
  {
    id: "r32-civ-nor",
    teamA: "Ivory Coast",
    teamB: "Norway",
    flagA: "🇨🇮",
    flagB: "🇳🇴",
    date: "2026-06-30",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "r32-mex-3rd",
    teamA: "Mexico",
    teamB: "3rd Place Group C/E/F/H/I",
    flagA: "🇲🇽",
    flagB: "🏆",
    date: "2026-06-30",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "Estadio Azteca, Mexico City",
  },
  {
    id: "r32-eng-3rd",
    teamA: "England",
    teamB: "3rd Place Group E/H/I/J/K",
    flagA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flagB: "🏆",
    date: "2026-07-01",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "r32-usa-3rd",
    teamA: "USA",
    teamB: "3rd Place Group B/E/F/I/J",
    flagA: "🇺🇸",
    flagB: "🏆",
    date: "2026-07-01",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "Levi's Stadium, Santa Clara",
  },
  {
    id: "r32-egy-3rd",
    teamA: "Egypt",
    teamB: "3rd Place Group A/E/H/I/J",
    flagA: "🇪🇬",
    flagB: "🏆",
    date: "2026-07-01",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "Lumen Field, Seattle",
  },
  {
    id: "r32-por-gha",
    teamA: "Portugal",
    teamB: "Ghana",
    flagA: "🇵🇹",
    flagB: "🇬🇭",
    date: "2026-07-02",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "BMO Field, Toronto",
  },
  {
    id: "r32-esp-aut",
    teamA: "Spain",
    teamB: "Austria",
    flagA: "🇪🇸",
    flagB: "🇦🇹",
    date: "2026-07-02",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "r32-sui-3rd",
    teamA: "Switzerland",
    teamB: "3rd Place Group E/F/G/I/J",
    flagA: "🇨🇭",
    flagB: "🏆",
    date: "2026-07-02",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "BC Place, Vancouver",
  },
  {
    id: "r32-arg-uru",
    teamA: "Argentina",
    teamB: "Uruguay",
    flagA: "🇦🇷",
    flagB: "🇺🇾",
    date: "2026-07-03",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "r32-col-3rd",
    teamA: "Colombia",
    teamB: "3rd Place Group D/E/I/J/L",
    flagA: "🇨🇴",
    flagB: "🏆",
    date: "2026-07-03",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "r32-aus-irn",
    teamA: "Australia",
    teamB: "Iran",
    flagA: "🇦🇺",
    flagB: "🇮🇷",
    date: "2026-07-03",
    kickoff: "TBD",
    stage: "Round of 32",
    venue: "AT&T Stadium, Dallas",
  },

  // =========================================================================
  //  ROUND OF 16 (July 4–7)
  // =========================================================================

  {
    id: "r16-1",
    teamA: "Winner R32-1",
    teamB: "Winner R32-2",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-04",
    kickoff: "TBD",
    stage: "Round of 16",
    venue: "Lincoln Financial Field, Philadelphia",
  },
  {
    id: "r16-2",
    teamA: "Winner R32-3",
    teamB: "Winner R32-4",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-04",
    kickoff: "TBD",
    stage: "Round of 16",
    venue: "NRG Stadium, Houston",
  },
  {
    id: "r16-3",
    teamA: "Winner R32-5",
    teamB: "Winner R32-6",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-05",
    kickoff: "TBD",
    stage: "Round of 16",
    venue: "MetLife Stadium, East Rutherford",
  },
  {
    id: "r16-4",
    teamA: "Winner R32-7",
    teamB: "Winner R32-8",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-05",
    kickoff: "TBD",
    stage: "Round of 16",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "r16-5",
    teamA: "Winner R32-9",
    teamB: "Winner R32-10",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-06",
    kickoff: "TBD",
    stage: "Round of 16",
    venue: "AT&T Stadium, Dallas",
  },
  {
    id: "r16-6",
    teamA: "Winner R32-11",
    teamB: "Winner R32-12",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-06",
    kickoff: "TBD",
    stage: "Round of 16",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "r16-7",
    teamA: "Winner R32-13",
    teamB: "Winner R32-14",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-07",
    kickoff: "TBD",
    stage: "Round of 16",
    venue: "Hard Rock Stadium, Miami",
  },
  {
    id: "r16-8",
    teamA: "Winner R32-15",
    teamB: "Winner R32-16",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-07",
    kickoff: "TBD",
    stage: "Round of 16",
    venue: "BC Place, Vancouver",
  },

  // =========================================================================
  //  QUARTER-FINALS (July 9–11)
  // =========================================================================

  {
    id: "qf-1",
    teamA: "Winner R16-1",
    teamB: "Winner R16-2",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-09",
    kickoff: "TBD",
    stage: "Quarter-Final",
    venue: "Gillette Stadium, Boston",
  },
  {
    id: "qf-2",
    teamA: "Winner R16-3",
    teamB: "Winner R16-4",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-09",
    kickoff: "TBD",
    stage: "Quarter-Final",
    venue: "SoFi Stadium, Los Angeles",
  },
  {
    id: "qf-3",
    teamA: "Winner R16-5",
    teamB: "Winner R16-6",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-10",
    kickoff: "TBD",
    stage: "Quarter-Final",
    venue: "Arrowhead Stadium, Kansas City",
  },
  {
    id: "qf-4",
    teamA: "Winner R16-7",
    teamB: "Winner R16-8",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-11",
    kickoff: "TBD",
    stage: "Quarter-Final",
    venue: "Hard Rock Stadium, Miami",
  },

  // =========================================================================
  //  SEMI-FINALS (July 14–15)
  // =========================================================================

  {
    id: "sf-1",
    teamA: "Winner QF-1",
    teamB: "Winner QF-2",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-14",
    kickoff: "TBD",
    stage: "Semi-Final",
    venue: "AT&T Stadium, Arlington",
  },
  {
    id: "sf-2",
    teamA: "Winner QF-3",
    teamB: "Winner QF-4",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-15",
    kickoff: "TBD",
    stage: "Semi-Final",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },

  // =========================================================================
  //  THIRD-PLACE & FINAL (July 18–19)
  // =========================================================================

  {
    id: "3rd-place",
    teamA: "Loser SF-1",
    teamB: "Loser SF-2",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-18",
    kickoff: "TBD",
    stage: "Third Place Match",
    venue: "Hard Rock Stadium, Miami",
  },

  {
    id: "final",
    teamA: "Winner SF-1",
    teamB: "Winner SF-2",
    flagA: "🏆",
    flagB: "🏆",
    date: "2026-07-19",
    kickoff: "3:00 PM ET",
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
  { value: "hot-take", label: "Hot Take 🔥", desc: "Viral, spicy, built for X and Instagram" },
];
