const unavailableTime = "Horário indisponível";
const brasiliaTimeZone = "America/Sao_Paulo";

function parseGameDate(date: string | Date | undefined | null) {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return parsedDate;
}

export function formatGameTimeBrasilia(date: string | Date): string {
  const parsedDate = parseGameDate(date);
  if (!parsedDate) return unavailableTime;

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: brasiliaTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(parsedDate);
}

export function formatGameDateBrasilia(date: string | Date): string {
  const parsedDate = parseGameDate(date);
  if (!parsedDate) return unavailableTime;

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: brasiliaTimeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(parsedDate);
}

export function formatGameDateTimeBrasilia(date: string | Date): string {
  const parsedDate = parseGameDate(date);
  if (!parsedDate) return unavailableTime;

  return `${formatGameDateBrasilia(parsedDate)} às ${formatGameTimeBrasilia(parsedDate)}`;
}

export function isUnavailableGameTime(value: string) {
  return value === unavailableTime;
}

export function formatLastUpdated(date: Date | string): string {
  const parsedDate = parseGameDate(date);
  if (!parsedDate) return unavailableTime;

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: brasiliaTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(parsedDate);
}
