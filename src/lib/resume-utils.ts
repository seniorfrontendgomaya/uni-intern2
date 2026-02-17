// Utility functions for resume builder

/**
 * Format date from API format (YYYY-MM-DD) to display format (MMM, YYYY)
 */
export function formatDateForDisplay(dateString: string | null): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${months[date.getMonth()]}, ${date.getFullYear()}`;
  } catch {
    return dateString;
  }
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: string | null, endDate: string | null, isOngoing: boolean): string {
  const start = formatDateForDisplay(startDate);
  const end = isOngoing ? "Present" : formatDateForDisplay(endDate);
  
  if (!start && !end) return "";
  if (!start) return `- ${end}`;
  if (!end) return start;
  
  return `${start} - ${end}`;
}

/**
 * Format education type for display
 */
export function formatEducationType(type: string): string {
  const typeMap: Record<string, string> = {
    "secondary": "Secondary",
    "senior secondary": "Senior Secondary",
    "diploma": "Diploma",
    "graduation/ post graduation": "Graduation/ Post Graduation",
    "Phd": "PhD",
  };
  return typeMap[type] || type;
}

/**
 * Format education score for display: percentage (e.g. "85%") when out of 100, CGPA (e.g. "8.5 CGPA") when out of 10.
 */
export function formatScore(scoreValue: string, scoreOutOf: number): string {
  const value = String(scoreValue ?? "").trim();
  if (!value) return "";
  if (Number(scoreOutOf) === 100) {
    return `${value}%`;
  }
  return `${value} CGPA`;
}

/** Valid non-negative 4-digit year (0000–9999). Use for Year of completion. */
export function isValidYearOfCompletion(value: string): boolean {
  const v = String(value ?? "").trim();
  if (v.length !== 4) return false;
  const n = parseInt(v, 10);
  return !Number.isNaN(n) && n >= 0 && n <= 9999;
}

/** Restrict input to at most 4 digits only. Use in onChange for year fields. */
export function restrictToFourDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}
