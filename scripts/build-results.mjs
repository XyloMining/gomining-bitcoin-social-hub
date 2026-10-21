// Turns GoMining "nft_incomes" CSV exports into public/results.json (daily totals only).
// Usage: node scripts/build-results.mjs export1.csv [export2.csv ...]
// Exports may overlap (for example a newer one and an older one): identical rows are counted once.
// The CSVs themselves are never published. Wallet addresses and other private columns are dropped here.
import { readFileSync, writeFileSync } from "node:fs";

const files = process.argv.slice(2);
if (!files.length) { console.error("Usage: node scripts/build-results.mjs export1.csv [export2.csv ...]"); process.exit(1); }

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const head = lines.shift().split(",");
  return lines.map((l) => { const c = l.split(","); return Object.fromEntries(head.map((h, i) => [h, c[i] ?? ""])); });
}
const need = ["date", "income", "c1", "c2", "c1 in USD", "c2 in USD", "btcCourseInUsd", "power", "maintenanceByGmt"];
const n = (v) => { const x = Number(v); return Number.isFinite(x) ? x : 0; };

const seen = new Set();
const rows = [];
for (const f of files) {
  const part = parseCsv(readFileSync(f, "utf8"));
  for (const k of need) if (!(k in (part[0] ?? {}))) { console.error(`Missing column in ${f}: ${k}`); process.exit(1); }
  for (const r of part) {
    // The wallet column is not part of the identity key and is never copied.
    const key = [r.date, r.income, r.c1, r.c2, r.power, r.nfts, r.btcCourseInUsd].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push(r);
  }
}

const days = new Map();
let protectionRows = 0, btcPaidRows = 0;
for (const r of rows) {
  const date = r.date.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
  const th = n(r.power);
  if (th <= 0) continue;
  const price = n(r.btcCourseInUsd);
  const maintBtc = n(r.c1) + n(r.c2);
  // If maintenance was paid in GMT, income is the full reward. If it was paid in BTC, income is
  // already net of it (checked against the data), so add it back to get the gross reward.
  const paidInGmt = r.maintenanceByGmt === "true";
  const grossBtc = n(r.income) + (paidInGmt ? 0 : maintBtc);
  if (!paidInGmt) btcPaidRows++;
  if (r.rewardProtection === "true") protectionRows++;
  const d = days.get(date) ?? { date, th: 0, grossBtc: 0, electricityBtc: 0, serviceBtc: 0, grossUsd: 0, maintenanceUsd: 0, btcUsd: 0 };
  d.th += th;
  d.grossBtc += grossBtc;
  d.electricityBtc += n(r.c1);
  d.serviceBtc += n(r.c2);
  d.grossUsd += grossBtc * price;
  d.maintenanceUsd += n(r["c1 in USD"]) + n(r["c2 in USD"]);
  d.btcUsd = price || d.btcUsd;
  days.set(date, d);
}
const round = (x, p) => Number(x.toFixed(p));
const out = [...days.values()].sort((a, b) => a.date.localeCompare(b.date)).map((d) => ({
  date: d.date,
  th: round(d.th, 2),
  grossBtc: round(d.grossBtc, 8),
  electricityBtc: round(d.electricityBtc, 8),
  serviceBtc: round(d.serviceBtc, 8),
  grossUsd: round(d.grossUsd, 2),
  maintenanceUsd: round(d.maintenanceUsd, 2),
  btcUsd: round(d.btcUsd, 0),
}));
writeFileSync("public/results.json", JSON.stringify({ from: out[0]?.date, to: out.at(-1)?.date, days: out }) + "\n");
console.log(`public/results.json: ${out.length} days, ${out[0]?.date} to ${out.at(-1)?.date} (${rows.length} rows from ${files.length} file(s); ${btcPaidRows} BTC-paid rows, ${protectionRows} reward-protection rows)`);
