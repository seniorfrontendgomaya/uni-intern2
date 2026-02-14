import { getCompany } from "@/services/company.service";

const COMPANY_ID_KEY = "user_id";
const COMPANY_NAME_KEY = "user_name";
const COMPANY_IMAGE_KEY = "user_image";

/**
 * After company login, call this to fetch company profile from get_company_api/
 * and save id, name, and image to localStorage (same keys as student role).
 * Call only when token is already set and role is COMPANY.
 */
export async function fetchAndStoreCompanyProfile(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const response = await getCompany();
    const data = response?.data;
    if (!data) return;
    const id = data.id;
    const name = data.name?.trim();
    const image = data.image ?? undefined;
    if (id != null) localStorage.setItem(COMPANY_ID_KEY, String(id));
    if (name) localStorage.setItem(COMPANY_NAME_KEY, name);
    if (image) localStorage.setItem(COMPANY_IMAGE_KEY, image);
  } catch {
    // Don't block login; profile can be loaded later
  }
}

export function clearStoredCompanyProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COMPANY_ID_KEY);
  localStorage.removeItem(COMPANY_NAME_KEY);
  localStorage.removeItem(COMPANY_IMAGE_KEY);
}
