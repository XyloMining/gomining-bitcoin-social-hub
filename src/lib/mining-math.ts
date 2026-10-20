/** Pure maths for the mining calculators. No side effects, so it is easy to test. */

export const BLOCKS_PER_DAY = 144; // one block roughly every 10 minutes
export const TH_PER_EH = 1_000_000; // 1 EH/s = 1,000,000 TH/s
export const DAYS_PER_MONTH = 30;
export const DAYS_PER_YEAR = 365;

export type Network = {
  /** Total network hashrate in EH/s. */
  networkEhs: number;
  /** Block subsidy in BTC (3.125 since the April 2024 halving). */
  subsidyBtc: number;
  /** Average transaction fees per block in BTC. */
  feesPerBlockBtc: number;
};

export type Costs = {
  /** Electricity price in dollars per kWh. */
  electricityPerKwh: number;
  /** Service fee in dollars per TH per day. */
  servicePerThDay: number;
  /** Discount on the total maintenance fee, 0 to 100. */
  discountPct: number;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Expected BTC per day for a given hashrate: your share of the network times daily block rewards. */
export function dailyBtc(th: number, net: Network): number {
  const networkTh = safe(net.networkEhs) * TH_PER_EH;
  if (safe(th) === 0 || networkTh === 0) return 0;
  const share = th / networkTh;
  return share * BLOCKS_PER_DAY * (safe(net.subsidyBtc) + safe(net.feesPerBlockBtc));
}

/** Energy use per day in kWh. Power in watts is TH times W/TH. */
export function dailyKwh(th: number, wPerTh: number): number {
  return (safe(th) * safe(wPerTh) * 24) / 1000;
}

export type MaintenanceBreakdown = {
  electricity: number;
  service: number;
  beforeDiscount: number;
  discount: number;
  total: number;
};

/** Daily maintenance in dollars: (electricity + service) x (1 - discount). */
export function dailyMaintenance(th: number, wPerTh: number, c: Costs): MaintenanceBreakdown {
  const electricity = dailyKwh(th, wPerTh) * safe(c.electricityPerKwh);
  const service = safe(th) * safe(c.servicePerThDay);
  const beforeDiscount = electricity + service;
  const discount = beforeDiscount * (clamp(c.discountPct, 0, 100) / 100);
  return { electricity, service, beforeDiscount, discount, total: beforeDiscount - discount };
}

export type Estimate = {
  btcPerDay: number;
  revenuePerDay: number;
  maintenance: MaintenanceBreakdown;
  netPerDay: number;
  /** BTC price at which revenue equals maintenance, or null if there is no BTC output. */
  breakEvenPrice: number | null;
  /** Share of revenue taken by maintenance, 0 to 1+, or null if revenue is zero. */
  maintenanceShare: number | null;
};

export function estimate(
  th: number,
  wPerTh: number,
  btcPrice: number,
  net: Network,
  costs: Costs,
): Estimate {
  const btcPerDay = dailyBtc(th, net);
  const revenuePerDay = btcPerDay * safe(btcPrice);
  const maintenance = dailyMaintenance(th, wPerTh, costs);
  return {
    btcPerDay,
    revenuePerDay,
    maintenance,
    netPerDay: revenuePerDay - maintenance.total,
    breakEvenPrice: btcPerDay > 0 ? maintenance.total / btcPerDay : null,
    maintenanceShare: revenuePerDay > 0 ? maintenance.total / revenuePerDay : null,
  };
}

export type SensitivityCell = { priceChange: number; networkChange: number; netPerMonth: number };

/**
 * Net result per month if the BTC price and the network hashrate (a stand-in for rising
 * difficulty) move by the given fractions.
 */
export function sensitivity(
  th: number,
  wPerTh: number,
  btcPrice: number,
  net: Network,
  costs: Costs,
  priceChanges: number[] = [-0.3, -0.15, 0, 0.15, 0.3],
  networkChanges: number[] = [0, 0.1, 0.25],
): SensitivityCell[] {
  const cells: SensitivityCell[] = [];
  for (const p of priceChanges) {
    for (const n of networkChanges) {
      const e = estimate(th, wPerTh, btcPrice * (1 + p), { ...net, networkEhs: net.networkEhs * (1 + n) }, costs);
      cells.push({ priceChange: p, networkChange: n, netPerMonth: e.netPerDay * DAYS_PER_MONTH });
    }
  }
  return cells;
}

/** Parse a text input to a number. Empty or invalid input gives 0. */
export function num(s: string): number {
  const n = Number(s.replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

export const usd = (n: number, digits = 2) =>
  (n < 0 && Math.abs(n) >= 0.5 * 10 ** -digits ? "-" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const btc = (n: number) => (n === 0 ? "0" : n.toFixed(n < 0.001 ? 8 : 6)) + " BTC";
