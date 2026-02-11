/**
 * University role dashboard theme (violet).
 * Uses CSS variables from globals.css: --university-accent, --university-accent-muted.
 * Use these classes for table headers, section headers, tabs, and accents in university routes.
 */
export const UNIVERSITY_THEME = {
  /** Table header row (e.g. thead) */
  tableHeader: "bg-university-accent text-xs uppercase text-white",
  /** Section/list header bar (e.g. "Recent Students" bar) */
  sectionHeader: "rounded-t-lg bg-university-accent px-5 py-3",
  /** Active tab button */
  tabActive:
    "rounded-xl bg-university-accent px-5 py-2.5 text-sm font-medium text-white",
  /** Card left accent bar */
  cardAccentBar: "bg-university-accent",
  /** Avatar/icon background (muted) */
  avatarMuted: "bg-university-accent-muted",
  /** Avatar/icon foreground */
  avatarAccent: "text-university-accent",
  /** Primary button */
  buttonPrimary: "bg-university-accent text-white hover:bg-university-accent/90",
  /** Outline button / focus ring */
  buttonOutline:
    "border-university-accent/30 text-university-accent hover:bg-university-accent/10",
  /** Input focus */
  inputFocus: "focus:border-university-accent focus:ring-2 focus:ring-university-accent/20",
} as const;
