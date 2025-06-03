import type { AstroCookies } from "astro";

export const MAX_ALLOWED_AGE = 31536000;

export function getSavedIds(cookies: AstroCookies) {
  let savedIds: string[] = [];
  try {
    const parsedCookie = JSON.parse(cookies.get("created")?.value ?? "[]");
    if (isArrayOfStrings(parsedCookie)) {
      savedIds = parsedCookie;
    }
  } catch {}
  return savedIds;
}

function isArrayOfStrings(value: unknown) {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}
