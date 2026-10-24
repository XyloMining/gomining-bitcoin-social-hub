import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { GrowthChart } from "@/components/GrowthChart";
import { btc, usd } from "@/lib/mining-math";
import { cumulative, isResultsFile, monthly, summarize, type ResultsFile } from "@/lib/results";

const TITLE = "My GoMining Results: Real Mining Income and Costs | Xylo Mining";
const DESC =
  "My own GoMining results from a real account export: hashrate over time, Bitcoin mined, and maintenance costs. Not typical, can be lower, not advice.";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://xylomining.github.io/results/" }],
  }),
  component: Results,
});

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const shortDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "UTC" });
const monthName = (m: string) =>
  new Date(m + "-01T00:00:00Z").toLocaleDateString("en-AU", { month: "short", year: "numeric", timeZone: "UTC" });
const btc4 = (n: number) => n.toFixed(Math.abs(n) >= 0.01 ? 3 : 4);

function Tile({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="border border-border bg-card p-5">
      <p className="eyebrow">{k}</p>
      <p className="mt-2 font-display text-3xl">{v}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Results() {
  const [file, setFile] = useState<ResultsFile | null | "error">(null);
  useEffect(() => {
    let off = false;
    fetch("/results.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { if (!off) setFile(isResultsFile(d) ? d : "error"); })
      .catch(() => { if (!off) setFile("error"); });
    return () => { off = true; };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-16">
        <SectionTitle eyebrow="Real numbers" title="My GoMining results" />
        <p role="note" className="mb-10 border border-gold bg-card p-5 text-sm">
          <strong>These are my own results, not typical ones.</strong> Yours can be lower, and past results do not predict future ones. They come from my own account export, they leave out what I paid for the miners, and none of this is financial advice or a promise of any return.
        </p>
        {file === null && <p className="text-muted-foreground" aria-live="polite">Loading my results...</p>}
        {file === "error" && <p className="text-muted-foreground">My results could not be loaded right now. Please try again later.</p>}
        {file && file !== "error" && <Data file={file} />}
        <p className="pt-12 text-sm text-muted-foreground">
          Want to test your own numbers? Use the <Link to="/calculator" className="text-gold-deep underline-offset-4 hover:underline">mining calculator</Link>, or read how <Link to="/guides/$slug" params={{ slug: "how-mining-maintenance-fees-work" }} className="text-gold-deep underline-offset-4 hover:underline">maintenance fees work</Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
}

function Data({ file }: { file: ResultsFile }) {
  const days = file.days;
  const s = useMemo(() => summarize(days), [days]);
  const cum = useMemo(() => cumulative(days), [days]);
  const months = useMemo(() => monthly(days), [days]);
  const labels = days.map((d) => fmtDate(d.date));
  const tick = (n: number) =>
    new Date((days[n]?.date ?? file.from) + "T00:00:00Z").toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit", timeZone: "UTC" });
  const netUsd = s.grossUsd - s.maintenanceUsd;
  const share = s.maintenanceShare === null ? "n/a" : Math.round(s.maintenanceShare * 100) + "%";

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile k="Period" v={`${monthName(file.from.slice(0, 7))} to ${monthName(file.to.slice(0, 7))}`} sub={`${s.dayCount} days of data${s.missingDays ? `, ${s.missingDays} days with no earnings recorded` : ""}`} />
        <Tile k="Hashrate now" v={`${s.currentTh.toFixed(2)} TH`} sub={`Started the period at ${days[0]!.th.toFixed(2)} TH`} />
        <Tile k="Bitcoin mined (gross)" v={btc(s.grossBtc)} sub={`About ${usd(s.grossUsd, 0)} at each day's price`} />
        <Tile k="Maintenance paid" v={btc(s.maintenanceBtc)} sub={`About ${usd(s.maintenanceUsd, 0)}. Electricity plus service fee`} />
        <Tile k="Left after maintenance" v={btc(s.netBtc)} sub={`About ${usd(netUsd, 0)}. Before miner purchase costs`} />
        <Tile k="Maintenance share" v={share} sub="Of gross Bitcoin mined" />
      </div>

      <section className="mt-14" aria-labelledby="hr-h">
        <h2 id="hr-h" className="text-3xl">How my hashrate grew</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Total TH across my miners each day. It changes as I add miners, mostly by reinvesting.</p>
        <div className="mt-6">
          <GrowthChart
            title="Hashrate owned (TH)"
            summary={`Hashrate went from ${days[0]!.th.toFixed(1)} TH on ${fmtDate(file.from)} to ${s.currentTh.toFixed(1)} TH on ${fmtDate(file.to)}.`}
            labels={labels}
            tick={tick}
            xTitle="Date"
            pickLabel="Look at a day"
            format={(v) => v.toFixed(v >= 100 ? 0 : 1)}
            series={[{ label: "Hashrate", values: days.map((d) => d.th), color: "var(--gold-deep)" }]}
          />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="btc-h">
        <h2 id="btc-h" className="text-3xl">Bitcoin mined and what maintenance took</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Running totals in BTC. The solid line is what was left after electricity and the service fee.</p>
        <div className="mt-6">
          <GrowthChart
            title="Cumulative Bitcoin (BTC)"
            summary={`By ${fmtDate(file.to)} I had mined ${btc(s.grossBtc)} gross, paid ${btc(s.maintenanceBtc)} in maintenance, and had ${btc(s.netBtc)} left.`}
            labels={labels}
            tick={tick}
            xTitle="Date"
            pickLabel="Look at a day"
            format={btc4}
            series={[
              { label: "Mined (gross)", values: cum.gross, color: "var(--gold)", dashed: true },
              { label: "Left after maintenance", values: cum.net, color: "var(--gold-deep)" },
              { label: "Maintenance paid", values: cum.maintenance, color: "var(--muted-foreground)", dashed: true },
            ]}
          />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="mo-h">
        <h2 id="mo-h" className="text-3xl">Month by month</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="sr-only">Monthly hashrate, Bitcoin mined, maintenance and what was left</caption>
            <thead>
              <tr className="text-left text-muted-foreground">
                <th scope="col" className="p-2 font-normal">Month</th>
                <th scope="col" className="p-2 text-right font-normal">Average TH</th>
                <th scope="col" className="p-2 text-right font-normal">Mined (BTC)</th>
                <th scope="col" className="p-2 text-right font-normal">Maintenance (BTC)</th>
                <th scope="col" className="p-2 text-right font-normal">Left (BTC)</th>
                <th scope="col" className="p-2 text-right font-normal">Maintenance share</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.month} className="border-t border-border">
                  <th scope="row" className="p-2 text-left font-normal">{monthName(m.month)}{m.days < 28 ? <span className="text-muted-foreground"> ({m.days} days)</span> : null}</th>
                  <td className="p-2 text-right">{m.avgTh.toFixed(1)}</td>
                  <td className="p-2 text-right">{btc4(m.grossBtc)}</td>
                  <td className="p-2 text-right">{btc4(m.maintenanceBtc)}</td>
                  <td className="p-2 text-right">{btc4(m.netBtc)}</td>
                  <td className="p-2 text-right">{m.share === null ? "n/a" : Math.round(m.share * 100) + "%"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 max-w-3xl" aria-labelledby="how-h">
        <h2 id="how-h" className="text-3xl">How these numbers are worked out</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>They come from the daily income export from my GoMining account, with daily totals only. Nothing private is published.</li>
          <li>"Mined (gross)" is the Bitcoin reward before maintenance. Where maintenance was taken from the reward in BTC, I add it back so the figure is gross.</li>
          <li>"Maintenance" is electricity plus the service fee, as recorded. Most of it was paid with GOMINING tokens, and it is shown here in its BTC value so everything is in one unit.</li>
          <li>Dollar amounts use the Bitcoin price recorded for each day. They are approximate.</li>
          <li>The figures leave out what I paid for the miners, the GOMINING tokens I used for maintenance, and any tax.</li>
          <li>{s.missingDays > 0 ? `${s.missingDays} days do not appear in the export. They are most likely days with no earnings, when maintenance was higher than the reward, so nothing was paid out and they add nothing to the totals. ` : ""}A few days show maintenance with no reward (reward protection), and I count that maintenance as recorded.</li>
          <li>The 16 TH miner was a bonus miner that earned only on days I completed activities and bonus tasks, which is why hashrate and rewards swing a lot in late 2025. Bonus miners have since changed to permanent TH paid in GOMINING tokens to new users, and my hashrate has grown by opening GoBoxes.</li>
          <li>The data starts on {fmtDate(file.from)}. Older months may be added later.</li>
        </ul>
      </section>
    </>
  );
}
