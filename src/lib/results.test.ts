import { describe, expect, it } from "vitest";
import { cumulative, isResultsFile, monthly, summarize, type Day } from "./results";

const d = (date: string, th: number, g: number, e: number, s: number): Day => ({ date, th, grossBtc: g, electricityBtc: e, serviceBtc: s, grossUsd: g * 100000, maintenanceUsd: (e + s) * 100000, btcUsd: 100000 });
const days = [d("2026-01-30", 10, 0.001, 0.0004, 0.0002), d("2026-01-31", 10, 0.001, 0.0004, 0.0002), d("2026-02-03", 12, 0.0012, 0.0004, 0.0002)];

describe("results", () => {
  it("sums totals and net", () => {
    const s = summarize(days);
    expect(s.grossBtc).toBeCloseTo(0.0032, 12);
    expect(s.maintenanceBtc).toBeCloseTo(0.0018, 12);
    expect(s.netBtc).toBeCloseTo(0.0014, 12);
    expect(s.currentTh).toBe(12);
    expect(s.maintenanceShare).toBeCloseTo(0.5625, 9);
  });
  it("counts missing calendar days", () => {
    expect(summarize(days).missingDays).toBe(2); // Feb 1 and Feb 2
    expect(summarize([days[0]!]).missingDays).toBe(0);
  });
  it("builds running totals that end at the totals", () => {
    const c = cumulative(days);
    expect(c.gross[2]).toBeCloseTo(0.0032, 12);
    expect(c.net[2]).toBeCloseTo(0.0014, 12);
    expect(c.net[0]).toBeCloseTo(0.0004, 12);
  });
  it("groups by month", () => {
    const m = monthly(days);
    expect(m.map((x) => x.month)).toEqual(["2026-01", "2026-02"]);
    expect(m[0]!.days).toBe(2);
    expect(m[0]!.avgTh).toBe(10);
    expect(m[1]!.netBtc).toBeCloseTo(0.0006, 12);
  });
  it("handles empty and bad input", () => {
    expect(summarize([]).maintenanceShare).toBeNull();
    expect(isResultsFile(null)).toBe(false);
    expect(isResultsFile({ days: [] })).toBe(false);
    expect(isResultsFile({ days })).toBe(true);
  });
});
