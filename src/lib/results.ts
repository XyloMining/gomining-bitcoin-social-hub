export type Day = {
  date: string; // YYYY-MM-DD
  th: number;
  grossBtc: number;
  electricityBtc: number;
  serviceBtc: number;
  grossUsd: number;
  maintenanceUsd: number;
  btcUsd: number;
};

export type ResultsFile = { from: string; to: string; days: Day[] };

const maint = (d: Day) => d.electricityBtc + d.serviceBtc;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export type Summary = {
  dayCount: number;
  currentTh: number;
  grossBtc: number;
  maintenanceBtc: number;
  netBtc: number;
  grossUsd: number;
  maintenanceUsd: number;
  /** Maintenance as a share of gross mining income, 0 to 1+, or null if nothing was mined. */
  maintenanceShare: number | null;
  /** Calendar days between the first and last date that are not in the file. */
  missingDays: number;
};

export function summarize(days: Day[]): Summary {
  const grossBtc = sum(days.map((d) => d.grossBtc));
  const maintenanceBtc = sum(days.map(maint));
  let missingDays = 0;
  if (days.length > 1) {
    const a = Date.parse(days[0]!.date + "T00:00:00Z");
    const b = Date.parse(days[days.length - 1]!.date + "T00:00:00Z");
    missingDays = Math.max(0, Math.round((b - a) / 86_400_000) + 1 - days.length);
  }
  return {
    dayCount: days.length,
    currentTh: days.length ? days[days.length - 1]!.th : 0,
    grossBtc,
    maintenanceBtc,
    netBtc: grossBtc - maintenanceBtc,
    grossUsd: sum(days.map((d) => d.grossUsd)),
    maintenanceUsd: sum(days.map((d) => d.maintenanceUsd)),
    maintenanceShare: grossBtc > 0 ? maintenanceBtc / grossBtc : null,
    missingDays,
  };
}

/** Running totals, one entry per day. */
export function cumulative(days: Day[]): { gross: number[]; maintenance: number[]; net: number[] } {
  let g = 0, m = 0;
  const gross: number[] = [], maintenance: number[] = [], net: number[] = [];
  for (const d of days) {
    g += d.grossBtc; m += maint(d);
    gross.push(g); maintenance.push(m); net.push(g - m);
  }
  return { gross, maintenance, net };
}

export type Month = { month: string; days: number; avgTh: number; grossBtc: number; maintenanceBtc: number; netBtc: number; share: number | null };

export function monthly(days: Day[]): Month[] {
  const by = new Map<string, Day[]>();
  for (const d of days) {
    const k = d.date.slice(0, 7);
    by.set(k, [...(by.get(k) ?? []), d]);
  }
  return [...by.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, ds]) => {
    const gross = sum(ds.map((d) => d.grossBtc));
    const m = sum(ds.map(maint));
    return { month, days: ds.length, avgTh: sum(ds.map((d) => d.th)) / ds.length, grossBtc: gross, maintenanceBtc: m, netBtc: gross - m, share: gross > 0 ? m / gross : null };
  });
}

/** True only for data that looks like a results file, so a bad file cannot break the page. */
export function isResultsFile(x: unknown): x is ResultsFile {
  const f = x as ResultsFile | null;
  return !!f && Array.isArray(f.days) && f.days.length > 0 && f.days.every((d) => typeof d?.date === "string" && Number.isFinite(d.grossBtc) && Number.isFinite(d.th));
}
