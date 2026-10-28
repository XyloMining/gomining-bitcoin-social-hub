import { createFileRoute } from "@tanstack/react-router";
import { PlatformFeed } from "@/components/PlatformFeed";
import { XEmbed } from "@/components/XEmbed";

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
  component: () => (
    <div className="space-y-12">
      <PlatformFeed platform="X" emptyNote={null} />
      <XEmbed />
    </div>
  ),
});
