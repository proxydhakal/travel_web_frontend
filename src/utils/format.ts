export function slugify(value: string) {
  const chars: string[] = [];
  for (const ch of value.toLowerCase().trim()) {
    if (/[a-z0-9]/.test(ch)) chars.push(ch);
    else if (chars.length && chars[chars.length - 1] !== "-") chars.push("-");
  }
  return chars.join("").replace(/-+$/g, "").slice(0, 80);
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function money(amount: number) {
  return `US$${amount.toLocaleString("en-US")}`;
}

export function durationLabel(days: number) {
  return days === 1 ? "1 Day" : `${days} Days`;
}
