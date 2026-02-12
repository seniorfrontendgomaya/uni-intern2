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
 * Format score for display (cgpa2 / cgpa)
 */
export function formatScore(cgpa2: string, cgpa: number): string {
  return `${cgpa2} / ${cgpa}`;
}
