import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlatformFeed } from "@/components/PlatformFeed";
import { XProfileLink } from "@/components/XProfileLink";
import { postsQuery } from "@/lib/posts-query";

export const Route = createFileRoute("/socials/x")({
  head: () => ({
    meta: [
      { title: "X posts | Xylo Mining" },
      { name: "description", content: "Latest X posts from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:title", content: "X posts | Xylo Mining" },
      { property: "og:description", content: "Latest X posts from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: XTab,
});

function XTab() {
  const { data } = useSuspenseQuery(postsQuery);
  const has = data.some((p) => p.platform === "X");
  return (
    <div className="space-y-12">
      <PlatformFeed platform="X" emptyNote={null} />
      <XProfileLink empty={!has} />
    </div>
  );
}
