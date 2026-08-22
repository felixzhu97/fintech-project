const DEFAULT_PORT = 8801; // Java API entry (Python analytics proxied via Java)

export function getBaseUrl(): string {
  const url = typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_BASE_URL;
  if (url && typeof url === "string") return url.replace(/\/$/, "");
  return `http://localhost:${DEFAULT_PORT}`;
}
