import { FIAT_CODES, costToUsd, num, usd, type CostContext, type CostUnit } from "@/lib/mining-math";

export type CostState = { amount: string; unit: CostUnit; gmtPrice: string };
export const initialCost: CostState = { amount: "", unit: "USD", gmtPrice: "0.37" };

/** Purchase cost of the miner, in dollars (or null if it cannot be converted yet). */
export function costUsdOf(s: CostState, ctx: Omit<CostContext, "gmtUsd">): number | null {
  if (s.amount.trim() === "") return 0;
  return costToUsd(num(s.amount), s.unit, { ...ctx, gmtUsd: num(s.gmtPrice) });
}

type Props = {
  idPrefix: string;
  state: CostState;
  onChange: (s: CostState) => void;
  ctx: Omit<CostContext, "gmtUsd">;
};

/** Miner purchase cost with a unit picker: a currency, BTC or GMT. */
export function CostInput({ idPrefix, state, onChange, ctx }: Props) {
  const fiat = FIAT_CODES.filter((c) => ctx.fiatPerBtc[c]);
  const units: CostUnit[] = [...(fiat.length ? fiat : ["USD" as const]), "BTC", "GMT"];
  const usdValue = costUsdOf(state, ctx);
  return (
    <div>
      <label htmlFor={`${idPrefix}-amt`} className="eyebrow block">Miner purchase cost (optional)</label>
      <div className="mt-2 flex gap-2">
        <input
          id={`${idPrefix}-amt`} inputMode="decimal" value={state.amount} placeholder="0"
          onChange={(e) => onChange({ ...state, amount: e.target.value })}
          className="min-w-0 flex-1 border border-border bg-background px-4 py-3 text-lg outline-none focus:border-gold"
        />
        <select
          aria-label="Purchase cost currency"
          value={state.unit} onChange={(e) => onChange({ ...state, unit: e.target.value as CostUnit })}
          className="border border-border bg-background px-3 py-3 text-lg outline-none focus:border-gold"
        >
          {units.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      {state.unit === "GMT" && (
        <div className="mt-3">
          <label htmlFor={`${idPrefix}-gmt`} className="eyebrow block">GMT price ($)</label>
          <input
            id={`${idPrefix}-gmt`} inputMode="decimal" value={state.gmtPrice}
            onChange={(e) => onChange({ ...state, gmtPrice: e.target.value })}
            className="mt-2 w-full border border-border bg-background px-4 py-3 text-lg outline-none focus:border-gold"
          />
          <p className="mt-1 text-xs text-muted-foreground">Example value from my account export on 19 Oct 2026. Enter the current GMT price.</p>
        </div>
      )}
      <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
        {usdValue === null
          ? "That currency needs live prices, which could not be loaded. Choose USD, BTC or GMT."
          : usdValue > 0 ? `About ${usd(usdValue)} at the prices shown.` : "Used for payback time and for reinvesting."}
        {fiat.length <= 1 && " Other currencies appear when live prices load."}
      </p>
    </div>
  );
}
