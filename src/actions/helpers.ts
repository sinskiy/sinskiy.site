import type { AstroCookies } from "astro";

export function getSavedCookies(cookies: AstroCookies) {
  let savedIds: string[] = [];
  try {
    const parsedSavedIds = JSON.parse(cookies.get("created")?.value ?? "[]");
    if (isArrayOfStrings(parsedSavedIds)) {
      savedIds = parsedSavedIds;
    }
  } catch {}
  return savedIds;
}

export function getSavedCookiesFromHead(cookieHeader: string | null) {
  const savedCookie = cookieHeader ? cookieHeader.split("=")[1] : null;
  let savedIds: string[] = [];
  if (savedCookie) {
    try {
      const parsedDecodedSavedIds = JSON.parse(
        decodeURI(savedCookie).replaceAll("%2C", ","),
      );
      if (isArrayOfStrings(parsedDecodedSavedIds)) {
        savedIds = parsedDecodedSavedIds;
      }
    } catch {}
  }
  return savedIds;
}

function isArrayOfStrings(value: unknown) {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}
