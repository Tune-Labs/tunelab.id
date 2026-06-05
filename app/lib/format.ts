// Deterministic date formatting (UTC) so server-rendered and client-hydrated
// markup always match — avoids React hydration mismatches from locale/timezone
// differences between workerd and the browser.

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDate(
  ts: number | null | undefined,
  style: "short" | "long" = "short",
): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  const months = style === "long" ? MONTHS_LONG : MONTHS_SHORT;
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
