type GuardOptions = {
  /** Hrefs that should match exactly (no nested routes allowed). */
  exactOnlyHrefs?: string[];
};

const normalizePath = (value: string) => {
  if (!value) return "/";
  if (value.length > 1 && value.endsWith("/")) return value.slice(0, -1);
  return value;
};

export function defaultRouteForRole(role: string | null): string {
  if (role === "SUPERADMIN") return "/superadmin/city";
  if (role === "UNIVERSITY") return "/university";
  return "/company";
}

export function isAllowedPathname(
  pathname: string,
  allowedHrefs: string[],
  options: GuardOptions = {}
): boolean {
  const current = normalizePath(pathname);
  const exactOnly = new Set((options.exactOnlyHrefs ?? []).map(normalizePath));

  return allowedHrefs.some((rawHref) => {
    const href = normalizePath(rawHref);
    if (current === href) return true;
    if (exactOnly.has(href)) return false;
    return current.startsWith(`${href}/`);
  });
}

