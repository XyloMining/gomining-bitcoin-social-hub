import { Link } from "@tanstack/react-router";
import { BRAND, socials } from "@/lib/site";

export function Header() {
  const link = "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors";
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl">
          Xylo <span className="text-gold-gradient italic">Mining</span>
        </Link>
        <nav className="flex gap-5 sm:gap-8">
          <Link to="/feed" className={link} activeProps={{ className: "text-foreground" }}>Feed</Link>
          <Link to="/referrals" className={link} activeProps={{ className: "text-foreground" }}>Referrals</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-xl">{BRAND}</p>
        <div className="flex flex-wrap gap-5">
          {socials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-gold-deep">
              {s.name}
            </a>
          ))}
        </div>
      </div>
      <p className="px-5 pb-8 text-center text-xs text-muted-foreground">
        Not financial advice. Referral links may earn me a reward at no cost to you.
      </p>
    </footer>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-4xl sm:text-5xl">{title}</h2>
    </div>
  );
}
