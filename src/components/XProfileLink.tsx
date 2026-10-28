const HANDLE = "Xylo_mining";

/**
 * X no longer lets a site embed a profile timeline for logged-out visitors, so X posts are shown as
 * ordinary cards from postsx.json (like every other platform) with this link to the live profile.
 */
export function XProfileLink({ empty }: { empty: boolean }) {
  return (
    <div className="border border-border bg-card p-6 text-center">
      {empty && (
        <p className="mb-4 text-sm text-muted-foreground">
          X no longer lets other sites show a live timeline, so my latest posts are listed here as I add them. The full feed is on X.
        </p>
      )}
      <a href={`https://x.com/${HANDLE}`} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.2em] text-gold-deep">
        Open @{HANDLE} on X →
      </a>
    </div>
  );
}
