const nbaTimezone = "America/New_York";

function getDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: nbaTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return { year, month, day };
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

export function formatNbaApiDate(date: Date | string = new Date()): string {
  if (typeof date === "string") {
    const trimmed = date.trim();

    if (/^\d{8}$/.test(trimmed)) return trimmed;

    const inputDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (inputDate) return `${inputDate[1]}${inputDate[2]}${inputDate[3]}`;

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      const { year, month, day } = getDateParts(parsed);
      return `${year}${month}${day}`;
    }
  }

  const resolvedDate = date instanceof Date ? date : new Date();
  const { year, month, day } = getDateParts(resolvedDate);

  return `${year}${month}${day}`;
}

export function toInputDate(date: Date | string = new Date()): string {
  const formatted = formatNbaApiDate(date);
  return `${formatted.slice(0, 4)}-${formatted.slice(4, 6)}-${formatted.slice(6, 8)}`;
}

export function getNbaTodayDate(): string {
  return formatNbaApiDate(new Date());
}

export function getNbaYesterdayDate(): string {
  return formatNbaApiDate(addDays(new Date(), -1));
}

export function getNbaTomorrowDate(): string {
  return formatNbaApiDate(addDays(new Date(), 1));
}

export const NBA_TIMEZONE = nbaTimezone;
