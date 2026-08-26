export const KST_OFFSET = 9 * 60 * 60 * 1000;

const pad = (n: number) => String(n).padStart(2, "0");

// Format an epoch (ms) as wall-clock time in a fixed-offset timezone.
export function formatInZone(ms: number, offsetMs: number): string {
  const d = new Date(ms + offsetMs);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

export function relativeTime(ms: number, now: number): string {
  const diff = ms - now;
  const abs = Math.abs(diff);
  const units: [number, string][] = [
    [365 * 86400000, "year"],
    [30 * 86400000, "month"],
    [86400000, "day"],
    [3600000, "hour"],
    [60000, "minute"],
    [1000, "second"],
  ];
  for (const [unit, name] of units) {
    if (abs >= unit) {
      const v = Math.floor(abs / unit);
      const plural = v > 1 ? "s" : "";
      return diff < 0 ? `${v} ${name}${plural} ago` : `in ${v} ${name}${plural}`;
    }
  }
  return "just now";
}
