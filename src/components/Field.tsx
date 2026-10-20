export function Field({ id, label, hint, value, onChange }: { id: string; label: string; hint?: string | undefined; value: string; onChange: (v: string) => void }) {
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
