// Convert a raw string into a typed scalar (boolean / null / number / string).
// Numbers are only converted when they round-trip exactly, so values like
// "007", "1e5" or phone numbers keep their original string form.
export function parseScalar(val: string): unknown {
  if (val === "true") return true;
  if (val === "false") return false;
  if (val === "null") return null;

  const num = Number(val);
  if (val.trim() !== "" && Number.isFinite(num) && String(num) === val) {
    return num;
  }
  return val;
}
