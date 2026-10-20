import { describe, expect, it } from "vitest";
import { dailyBtc, dailyKwh, dailyMaintenance, estimate, sensitivity, num } from "./mining-math";

const net = { networkEhs: 1000, subsidyBtc: 3.125, feesPerBlockBtc: 0.1 };

describe("mining maths", () => {
  it("computes BTC per day from share of the network", () => {
    // 100 TH of 1,000 EH/s (1e9 TH) = 1e-7 share; x144 blocks x 3.225 BTC
    expect(dailyBtc(100, net)).toBeCloseTo(1e-7 * 144 * 3.225, 12);
  });

  it("matches the published efficiency example (8 TH, 20 W/TH, $0.05/kWh = $0.192/day)", () => {
    const m = dailyMaintenance(8, 20, { electricityPerKwh: 0.05, servicePerThDay: 0, discountPct: 0 });
    expect(m.electricity).toBeCloseTo(0.192, 6);
    const m12 = dailyMaintenance(8, 12, { electricityPerKwh: 0.05, servicePerThDay: 0, discountPct: 0 });
    expect(m12.total).toBeCloseTo(0.1152, 6);
  });

  it("applies the discount to the total of electricity and service", () => {
    const m = dailyMaintenance(10, 20, { electricityPerKwh: 0.05, servicePerThDay: 0.01, discountPct: 20 });
    expect(m.beforeDiscount).toBeCloseTo(0.24 + 0.1, 9); // 10*20*24/1000*0.05 = 0.24
    expect(m.total).toBeCloseTo((0.24 + 0.1) * 0.8, 9);
  });

  it("converts watts to kWh per day", () => {
    expect(dailyKwh(100, 20)).toBeCloseTo(48, 9);
  });

  it("finds the break-even price", () => {
    const costs = { electricityPerKwh: 0.07, servicePerThDay: 0, discountPct: 0 };
    const e = estimate(100, 20, 70000, net, costs);
    expect(e.breakEvenPrice).toBeCloseTo(e.maintenance.total / e.btcPerDay, 9);
    // at the break-even price net is zero
    const at = estimate(100, 20, e.breakEvenPrice!, net, costs);
    expect(at.netPerDay).toBeCloseTo(0, 9);
  });

  it("can be negative and handles zero or bad input without NaN", () => {
    const e = estimate(100, 20, 70000, net, { electricityPerKwh: 0.07, servicePerThDay: 0, discountPct: 0 });
    expect(e.netPerDay).toBeLessThan(0);
    const z = estimate(0, 0, 0, net, { electricityPerKwh: 0, servicePerThDay: 0, discountPct: 150 });
    expect(Number.isNaN(z.netPerDay)).toBe(false);
    expect(z.breakEvenPrice).toBeNull();
    expect(num("1,234.5")).toBe(1234.5);
    expect(num("abc")).toBe(0);
  });

  it("builds a sensitivity grid where a higher price helps and a bigger network hurts", () => {
    const grid = sensitivity(100, 15, 70000, net, { electricityPerKwh: 0.05, servicePerThDay: 0, discountPct: 0 });
    const get = (p: number, n: number) => grid.find((c) => c.priceChange === p && c.networkChange === n)!.netPerMonth;
    expect(get(0.3, 0)).toBeGreaterThan(get(0, 0));
    expect(get(0, 0.25)).toBeLessThan(get(0, 0));
  });
});

import { usd } from "./mining-math";
describe("usd", () => {
  it("never shows negative zero", () => {
    expect(usd(-0.001)).toBe("$0.00");
    expect(usd(-1.5)).toBe("-$1.50");
  });
});
