const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function sanitizeUrl(raw?: string, fallback = '#'): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value) return fallback;
  if (value.startsWith('#')) return value;

  try {
    const parsed = new URL(value);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function sanitizeImageUrl(raw?: string, fallback = ''): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value) return fallback;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}
