import { describe, it, expect } from "vitest";
import { mergePosts } from "./merge-posts";
import type { FeedPost } from "./feed.functions";

const p = (o: Partial<FeedPost>): FeedPost => ({ id: Math.random().toString(), platform: "YouTube", title: "t", url: Math.random().toString(), date: "2026-01-01", ...o });

describe("mergePosts", () => {
  it("combines posts with the same title and sums counts", () => {
    const r = mergePosts([
      p({ title: "Mine BTC daily #shorts", views: 10, likes: 2, comments: 1 }),
      p({ platform: "TikTok", title: "Mine BTC daily", views: 5, likes: 3, comments: 4 }),
    ]);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ views: 15, likes: 5, comments: 5 });
    expect(r[0]!.sources.map((s) => s.platform)).toEqual(["YouTube", "TikTok"]);
  });
  it("combines posts with the same thumbnail", () => {
    expect(mergePosts([p({ title: "a", thumbnail: "x.jpg" }), p({ title: "b", thumbnail: "x.jpg" })])).toHaveLength(1);
  });
  it("keeps different posts separate", () => {
    expect(mergePosts([p({ title: "Difficulty explained" }), p({ title: "My GoMining earnings" })])).toHaveLength(2);
  });
});
