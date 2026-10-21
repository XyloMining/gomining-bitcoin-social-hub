import { useId, useState } from "react";

export type Series = {
  label: string;
  values: number[];
  /** CSS colour, usually a design token such as var(--gold-deep). */
  color: string;
  dashed?: boolean;
};

type Props = {
  title: string;
  /** Short description for screen readers. */
  summary: string;
  series: Series[];
  /** One label per point, for example "Month 3". */
  labels: string[];
  format: (n: number) => string;
  /** Text under the x axis. */
  xTitle?: string;
  /** Label for the slider. */
  pickLabel?: string;
  /** Text for an axis tick at point n. Defaults to the number itself. */
  tick?: (n: number) => string;
};

const W = 640;
const H = 300;
const PAD = { l: 64, r: 16, t: 16, b: 28 };

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) { max = min + 1; }
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.5; v += step) ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return ticks;
}

/** A small dependency-free line chart. A slider picks the month so it works with touch and keyboard. */
export function GrowthChart({ title, summary, series, labels, format, xTitle = "Months from today", pickLabel = "Look at month", tick = (n) => String(n) }: Props) {
  const id = useId();
  const last = Math.max(0, labels.length - 1);
  const [idx, setIdx] = useState(last);
  const i = Math.min(idx, last);

  const all = series.flatMap((s) => s.values).filter(Number.isFinite);
  const lo = Math.min(0, ...all);
  const hi = Math.max(0, ...all);
  const ticks = niceTicks(lo, hi);
  const yMin = Math.min(ticks[0] ?? lo, lo);
  const yMax = Math.max(ticks[ticks.length - 1] ?? hi, hi);
  const x = (n: number) => PAD.l + (last === 0 ? 0 : (n / last) * (W - PAD.l - PAD.r));
  const y = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - PAD.t - PAD.b);
  const path = (vals: number[]) => vals.map((v, n) => `${n === 0 ? "M" : "L"}${x(n).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  return (
    <figure className="border border-border bg-card p-4 sm:p-6">
      <figcaption className="eyebrow">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${id}-t`} className="mt-3 h-auto w-full">
        <title id={`${id}-t`}>{summary}</title>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={t === 0 ? 1.5 : 1} />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">{format(t)}</text>
          </g>
        ))}
        {labels.map((l, n) =>
          n === 0 || n === last || n % Math.max(1, Math.round(last / 6)) === 0 ? (
            <text key={l} x={x(n)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">{tick(n)}</text>
          ) : null,
        )}
        {series.map((s) => (
          <path key={s.label} d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? "6 5" : undefined} />
        ))}
        <line x1={x(i)} x2={x(i)} y1={PAD.t} y2={H - PAD.b} stroke="var(--foreground)" strokeOpacity={0.35} strokeDasharray="3 3" />
        {series.map((s) => {
          const v = s.values[i];
          return v === undefined ? null : <circle key={s.label} cx={x(i)} cy={y(v)} r={4.5} fill={s.color} stroke="var(--card)" strokeWidth={2} />;
        })}
      </svg>
      <p className="mt-1 text-center text-xs text-muted-foreground">{xTitle}</p>

      <label htmlFor={`${id}-s`} className="eyebrow mt-3 block">{pickLabel}</label>
      <input id={`${id}-s`} type="range" min={0} max={last} value={i} onChange={(e) => setIdx(Number(e.target.value))} className="mt-2 w-full accent-[var(--gold-deep)]" aria-valuetext={labels[i]} />

      <ul className="mt-3 grid gap-2 sm:grid-cols-2" aria-live="polite">
        {series.map((s) => {
          const v = s.values[i];
          return (
            <li key={s.label} className="flex items-baseline justify-between gap-3 border-t border-border pt-2 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <svg width="22" height="6" aria-hidden="true"><line x1="0" x2="22" y1="3" y2="3" stroke={s.color} strokeWidth="3" strokeDasharray={s.dashed ? "5 3" : undefined} /></svg>
                {s.label}
              </span>
              <span className={v !== undefined && v < 0 ? "text-destructive" : ""}>{v === undefined ? "n/a" : format(v)}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
