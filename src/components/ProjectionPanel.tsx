import { useState } from "react";
import { GrowthChart } from "@/components/GrowthChart";
import { Field } from "@/components/Field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { btc, num, paybackMonth, projectGrowth, usd, type Costs, type Network } from "@/lib/mining-math";

const compact = (n: number) => {
  const a = Math.abs(n);
  const body = a >= 1000 ? (a / 1000).toFixed(a >= 10000 ? 0 : 1) + "k" : a.toFixed(a >= 100 ? 0 : 2);
  return (n < 0 ? "-$" : "$") + body;
};
const clampMonths = (s: string, fallback: number) => Math.max(1, Math.min(60, Math.round(num(s)) || fallback));
const paybackText = (m: number | null, n: number) => (m === null ? `not within ${n} months` : `month ${m}`);

type Props = { th: number; w: number; price: number; net: Network; costs: Costs; costUsd: number };

/** Growth graph and reinvest comparison, sharing one set of assumptions. */
export function ProjectionPanel({ th, w, price, net, costs, costUsd }: Props) {
  const [months, setMonths] = useState("12");
  const [netGrowth, setNetGrowth] = useState("1");
  const [priceGrowth, setPriceGrowth] = useState("0");
  const [pct, setPct] = useState("100");
  const n = clampMonths(months, 12);

  const base = { th, wPerTh: w, net, costs, months: n, priceGrowthPct: num(priceGrowth), networkGrowthPct: num(netGrowth) };
  const run = (p: number, reinvestPct = 0, costPerTh = 0) => projectGrowth({ ...base, btcPrice: p, reinvestPct, costPerTh });

  const mid = run(price);
  const high = run(price * 1.3);
  const low = run(price * 0.7);
  const labels = mid.map((p) => `Month ${p.month}`);
  const end = mid[mid.length - 1]!;
  const cost = costUsd > 0 ? costUsd : 0;

  const costPerTh = th > 0 && cost > 0 ? cost / th : 0;
  const withdraw = mid;
  const reinvest = run(price, num(pct), costPerTh);
  const rEnd = reinvest[reinvest.length - 1]!;

  return (
    <section className="mt-12" aria-labelledby="proj-h">
      <h2 id="proj-h" className="text-3xl">Growth over time</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Projections from today, using the inputs above and the assumptions below. Mining difficulty usually rises and the price can move either way, so the assumptions are yours to change.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-3 lg:max-w-3xl">
        <Field id="p-m" label="Months ahead" hint="1 to 60." value={months} onChange={setMonths} />
        <Field id="p-n" label="Network growth per month (%)" hint="Assumption." value={netGrowth} onChange={setNetGrowth} />
        <Field id="p-p" label="BTC price change per month (%)" hint="Assumption. Negative for falls." value={priceGrowth} onChange={setPriceGrowth} />
      </div>

      <Tabs defaultValue="growth" className="mt-8">
        <TabsList>
          <TabsTrigger value="growth">Growth graph</TabsTrigger>
          <TabsTrigger value="reinvest">Reinvest vs withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="mt-6">
          <GrowthChart
            title="Cumulative net result (USD)"
            summary={`Estimated cumulative net result over ${n} months at the entered price, and 30% lower and higher. At the entered price it ends at ${usd(end.netCum)}.`}
            labels={labels}
            format={compact}
            series={[
              { label: "Price 30% higher", values: high.map((p) => p.netCum), color: "var(--gold)", dashed: true },
              { label: "Price as entered", values: mid.map((p) => p.netCum), color: "var(--gold-deep)" },
              { label: "Price 30% lower", values: low.map((p) => p.netCum), color: "var(--muted-foreground)", dashed: true },
              ...(cost > 0 ? [{ label: "Miner purchase cost", values: mid.map(() => cost), color: "var(--foreground)", dashed: true }] : []),
            ]}
          />
          <p className="mt-3 text-sm text-muted-foreground">BTC mined in {n} months at the entered price: {btc(end.btcCum)} before maintenance.</p>
          {cost > 0 ? (
            <ul className="mt-3 space-y-1 text-sm">
              <li>Payback of {usd(cost)} at the entered price: <strong>{paybackText(paybackMonth(mid.map((p) => p.netCum), cost), n)}</strong></li>
              <li className="text-muted-foreground">With the price 30% higher: {paybackText(paybackMonth(high.map((p) => p.netCum), cost), n)}</li>
              <li className="text-muted-foreground">With the price 30% lower: {paybackText(paybackMonth(low.map((p) => p.netCum), cost), n)}</li>
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Enter the miner purchase cost above to see payback time.</p>
          )}
        </TabsContent>

        <TabsContent value="reinvest" className="mt-6">
          <p className="max-w-3xl text-sm text-muted-foreground">
            Compare taking profit out as cash with using it to buy more TH at your miner's cost per TH. Extra TH earns more but also pays more maintenance, and a falling price or a growing network can cancel the gain. Hardware resale value is not counted.
          </p>
          {costPerTh <= 0 ? (
            <p className="mt-4 border border-gold bg-card p-4 text-sm">Enter your miner's purchase cost and size above. The cost per TH sets what extra hashrate costs.</p>
          ) : (
            <>
              <div className="mt-5 max-w-xs">
                <Field id="p-r" label="Share of profit reinvested (%)" hint={`Cost per TH used: ${usd(costPerTh)}. Only positive months are reinvested.`} value={pct} onChange={setPct} />
              </div>
              <div className="mt-6 space-y-6">
                <GrowthChart
                  title="Total profit earned (USD)"
                  summary={`Reinvesting ${num(pct)}% of profit ends at ${usd(rEnd.netCum)} after ${n} months, compared with ${usd(end.netCum)} when withdrawing everything.`}
                  labels={labels}
                  format={compact}
                  series={[
                    { label: "Reinvest", values: reinvest.map((p) => p.netCum), color: "var(--gold-deep)" },
                    { label: "Withdraw", values: withdraw.map((p) => p.netCum), color: "var(--muted-foreground)", dashed: true },
                  ]}
                />
                <GrowthChart
                  title="Hashrate owned (TH)"
                  summary={`Hashrate grows from ${th} TH to ${rEnd.th.toFixed(1)} TH when reinvesting.`}
                  labels={labels}
                  format={(v) => v.toFixed(v >= 100 ? 0 : 1)}
                  series={[
                    { label: "Reinvest", values: reinvest.map((p) => p.th), color: "var(--gold-deep)" },
                    { label: "Withdraw", values: withdraw.map((p) => p.th), color: "var(--muted-foreground)", dashed: true },
                  ]}
                />
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex justify-between border-t border-border pt-2"><dt className="text-muted-foreground">TH added by reinvesting</dt><dd>{rEnd.thAdded.toFixed(2)} TH</dd></div>
                  <div className="flex justify-between border-t border-border pt-2"><dt className="text-muted-foreground">Cash taken out while reinvesting</dt><dd>{usd(rEnd.cashCum)}</dd></div>
                  <div className="flex justify-between border-t border-border pt-2"><dt className="text-muted-foreground">Total profit: reinvest</dt><dd>{usd(rEnd.netCum)}</dd></div>
                  <div className="flex justify-between border-t border-border pt-2"><dt className="text-muted-foreground">Total profit: withdraw</dt><dd>{usd(end.netCum)}</dd></div>
                </dl>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
