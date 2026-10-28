import { describe, it, expect } from "vitest";
import { featuredPerPlatform, selectFeatured } from "./feed-select";
import type { FeedPost } from "./feed.functions";

const p = (id: string, date: string, o: Partial<FeedPost> = {}): FeedPost => ({ id, platform: "TikTok", title: id, url: id, date, ...o });
const many = Array.from({ length: 9 }, (_, i) => p(`p${i}`, `2026-10-0${i + 1}`, { views: i === 2 ? 500 : i }));

describe("selectFeatured", () => {
  it("returns the top post and the 5 newest others", () => {
    const { top, recent } = selectFeatured(many);
    expect(top?.id).toBe("p2");
    expect(recent.map((r) => r.id)).toEqual(["p8", "p7", "p6", "p5", "p4"]);
  });
  it("does not repeat the top post when it is also recent", () => {
    const { top, recent } = selectFeatured([...many, p("new", "2026-11-01", { views: 9000 })]);
    expect(top?.id).toBe("new");
    expect(recent).toHaveLength(5);
    expect(recent.some((r) => r.id === "new")).toBe(false);
  });
  it("breaks view ties by likes and has no top when nothing has a count", () => {
    expect(selectFeatured([p("a", "2026-01-01", { views: 3, likes: 1 }), p("b", "2026-01-02", { views: 3, likes: 4 })]).top?.id).toBe("b");
    expect(selectFeatured([p("a", "2026-01-01"), p("b", "2026-01-02", { views: 0 })]).top).toBeUndefined();
  });
  it("never mutates or drops the source list", () => {
    const copy = [...many];
    selectFeatured(many);
    expect(many).toEqual(copy);
  });
});

describe("featuredPerPlatform", () => {
  it("selects per platform", () => {
    const mixed = [...many, ...many.map((m) => ({ ...m, id: "y" + m.id, platform: "YouTube" as const }))];
    expect(featuredPerPlatform(mixed)).toHaveLength(12);
  });
});
