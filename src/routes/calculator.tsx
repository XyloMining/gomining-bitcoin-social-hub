import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DISCOUNT_PARTS, GOMINING_RATES } from "@/data/gomining-rates";
import {
  DAYS_PER_MONTH, DAYS_PER_YEAR, btc, estimate, num, sensitivity, usd, type Network,
} from "@/lib/mining-math";

const TITLE = "Bitcoin Mining Profitability Calculator | Xylo Mining";
const DESC =
  "Free Bitcoin mining calculator. Enter hashrate, efficiency, maintenance costs, discount and BTC price to estimate returns, plus a GoMining tab. Estimates only.";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://xylomining.github.io/calculator" }],
  }),
  component: Calculator,
});

/** Example values used until live data loads or if it cannot be reached. They are not current. */
const EXAMPLE_NET: Network = { networkEhs: 1000, subsidyBtc: 3.125, feesPerBlockBtc: 0.1 };
const EXAMPLE_PRICE = 70000;

type Live = { net: Network; price: number; live: boolean };

function useLiveData(): Live {
  const [d, setD] = useState<Live>({ net: EXAMPLE_NET, price: EXAMPLE_PRICE, live: false });
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [h, p, r] = await Promise.all([
          fetch("https://mempool.space/api/v1/mining/hashrate/3d").then((x) => x.json()),
          fetch("https://mempool.space/api/v1/prices").then((x) => x.json()),
          fetch("https://mempool.space/api/v1/mining/reward-stats/144").then((x) => x.json()),
        ]);
        const ehs = Number(h?.currentHashrate) / 1e18;
        const price = Number(p?.USD);
        const fees = Number(r?.totalFee) / 1e8 / Math.max(1, Number(r?.endBlock) - Number(r?.startBlock) + 1);
        if (!off && ehs > 0 && price > 0 && Number.isFinite(fees)) {
          setD({ net: { networkEhs: ehs, subsidyBtc: 3.125, feesPerBlockBtc: fees }, price, live: true });
        }
      } catch {
        /* keep the labelled example values */
      }
    })();
    return () => { off = true; };
  }, []);
  return d;
}

function Field({ id, label, hint, value, onChange }: { id: string; label: string; hint?: string | undefined; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">{label}</label>
      <input
        id={id} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-border bg-background px-4 py-3 text-lg outline-none focus:border-gold"
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={"flex items-baseline justify-between gap-4 border-b border-border py-3 " + (strong ? "text-lg" : "text-sm")}>
      <span className="text-muted-foreground">{k}</span>
      <span className={strong ? "font-display text-2xl" : ""}>{v}</span>
    </div>
  );
}

function Results({ th, w, price, net, costs }: { th: number; w: number; price: number; net: Network; costs: { electricityPerKwh: number; servicePerThDay: number; discountPct: number } }) {
  const e = useMemo(() => estimate(th, w, price, net, costs), [th, w, price, net, costs]);
  const grid = useMemo(() => sensitivity(th, w, price, net, costs), [th, w, price, net, costs]);
  const prices = [...new Set(grid.map((c) => c.priceChange))];
  const nets = [...new Set(grid.map((c) => c.networkChange))];
  const pct = (n: number) => (n > 0 ? "+" : "") + Math.round(n * 100) + "%";
  return (
    <div>
      <p className="eyebrow">Estimate</p>
      <Row k="BTC mined per day" v={btc(e.btcPerDay)} />
      <Row k="Revenue per day" v={usd(e.revenuePerDay)} />
      <Row k="Electricity per day" v={usd(e.maintenance.electricity)} />
      <Row k="Service fee per day" v={usd(e.maintenance.service)} />
      <Row k="Discount per day" v={e.maintenance.discount > 0 ? "-" + usd(e.maintenance.discount) : usd(0)} />
      <Row k="Maintenance per day" v={usd(e.maintenance.total)} />
      <Row k="Net per day" v={usd(e.netPerDay)} strong />
      <Row k={`Net per month (${DAYS_PER_MONTH} days)`} v={usd(e.netPerDay * DAYS_PER_MONTH)} strong />
      <Row k="Net per year" v={usd(e.netPerDay * DAYS_PER_YEAR)} />
      <Row k="Break-even BTC price" v={e.breakEvenPrice === null ? "n/a" : usd(e.breakEvenPrice, 0)} />
      <Row k="Maintenance as share of revenue" v={e.maintenanceShare === null ? "n/a" : Math.round(e.maintenanceShare * 100) + "%"} />
      <p className="eyebrow mt-8">What if the price or the network changes? (net per month)</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <caption className="sr-only">Net per month by BTC price change and network hashrate change</caption>
          <thead>
            <tr>
              <th scope="col" className="p-2 text-left font-normal text-muted-foreground">BTC price \ Network</th>
              {nets.map((n) => <th key={n} scope="col" className="p-2 text-right font-normal text-muted-foreground">{pct(n)}</th>)}
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p} className="border-t border-border">
                <th scope="row" className="p-2 text-left font-normal text-muted-foreground">{pct(p)}</th>
                {nets.map((n) => {
                  const v = grid.find((c) => c.priceChange === p && c.networkChange === n)!.netPerMonth;
                  return <td key={n} className={"p-2 text-right " + (v < 0 ? "text-destructive" : "")}>{usd(v)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Calculator() {
  const live = useLiveData();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-16">
        <SectionTitle eyebrow="Tools" title="Mining calculator" />
        <p role="note" className="mb-8 border border-gold bg-card p-5 text-sm">
          <strong>Estimates only.</strong> Real results change with the Bitcoin price, mining difficulty and network hashrate, transaction fees, and platform costs and fees. This is not financial advice and is not a promise of any return. The numbers can be negative.
        </p>
        <Tabs defaultValue="bitcoin">
          <TabsList>
            <TabsTrigger value="bitcoin">Bitcoin mining</TabsTrigger>
            <TabsTrigger value="gomining">GoMining</TabsTrigger>
          </TabsList>
          <TabsContent value="bitcoin"><BitcoinTab live={live} /></TabsContent>
          <TabsContent value="gomining"><GoMiningTab live={live} /></TabsContent>
        </Tabs>
        <p className="pt-10 text-xs text-muted-foreground">
          Network data {live.live ? "loaded live from mempool.space." : "could not be loaded, so example values are shown (1,000 EH/s, $70,000). Edit the price to match today."} Rewards use the current 3.125 BTC block subsidy plus recent average fees.
        </p>
      </main>
      <Footer />
    </div>
  );
}

function BitcoinTab({ live }: { live: Live }) {
  const [th, setTh] = useState("100");
  const [w, setW] = useState("20");
  const [maint, setMaint] = useState("0.05");
  const [disc, setDisc] = useState("0");
  const [priceIn, setPriceIn] = useState<string | null>(null);
  const price = priceIn === null ? live.price : num(priceIn);
  const costs = { electricityPerKwh: num(maint), servicePerThDay: 0, discountPct: num(disc) };
  return (
    <div className="grid gap-10 pt-8 lg:grid-cols-[360px_minmax(0,1fr)] grid-cols-[minmax(0,1fr)]">
      <div className="space-y-5">
        <Field id="b-th" label="Hashrate (TH/s)" value={th} onChange={setTh} />
        <Field id="b-w" label="Efficiency (W/TH)" hint="Lower is better. Typical modern machines are roughly 15 to 25 W/TH." value={w} onChange={setW} />
        <Field id="b-m" label="Maintenance cost ($ per kWh)" hint="Your electricity price, or a platform's per kWh equivalent." value={maint} onChange={setMaint} />
        <Field id="b-d" label="Discount (%)" hint="Applied to the maintenance cost." value={disc} onChange={setDisc} />
        <Field id="b-p" label="BTC price ($)" hint={priceIn === null ? (live.live ? "Live price. Type to override." : "Example price. Type to override.") : undefined} value={priceIn ?? String(Math.round(live.price))} onChange={setPriceIn} />
      </div>
      <Results th={num(th)} w={num(w)} price={price} net={live.net} costs={costs} />
    </div>
  );
}

function GoMiningTab({ live }: { live: Live }) {
  const [th, setTh] = useState("10");
  const [w, setW] = useState("20");
  const [disc, setDisc] = useState("0");
  const [priceIn, setPriceIn] = useState<string | null>(null);
  const price = priceIn === null ? live.price : num(priceIn);
  const costs = { electricityPerKwh: GOMINING_RATES.electricityPerKwh, servicePerThDay: GOMINING_RATES.servicePerThDay, discountPct: num(disc) };
  return (
    <div className="grid gap-10 pt-8 lg:grid-cols-[360px_minmax(0,1fr)] grid-cols-[minmax(0,1fr)]">
      <div className="space-y-5">
        <Field id="g-th" label="Miner size (TH)" value={th} onChange={setTh} />
        <Field id="g-w" label="Efficiency (W/TH)" value={w} onChange={setW} />
        <Field id="g-d" label="Discount (%)" hint={"Total of all your discounts. Parts seen: " + DISCOUNT_PARTS.map((d) => d.label + " (" + d.range + ")").join(", ") + ". Check your account for your own."} value={disc} onChange={setDisc} />
        <Field id="g-p" label="BTC price ($)" value={priceIn ?? String(Math.round(live.price))} onChange={setPriceIn} />
        <p className="text-xs text-muted-foreground">
          Maintenance is calculated automatically: electricity at ${GOMINING_RATES.electricityPerKwh} per kWh plus a service fee of ${GOMINING_RATES.servicePerThDay} per TH per day, then your discount. GoMining can change these rates, and its own calculator is also only a rough estimate.
        </p>
      </div>
      <Results th={num(th)} w={num(w)} price={price} net={live.net} costs={costs} />
    </div>
  );
}
