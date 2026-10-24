import { describe, expect, it } from "vitest";
import { fmtCount, isStatsFile, total } from "./stats";

const p = (o: object) => ({ platform: "X", followers: null, views: null, likes: null, videos: null, ...o });

describe("stats", () => {
  it("sums only platforms that have a figure", () => {
    expect(total([p({ views: 10 }), p({ views: null }), p({ views: 5 })], "views")).toBe(15);
  });
  it("returns null when no platform has the figure", () => {
    expect(total([p({}), p({})], "likes")).toBeNull();
  });
  it("validates the file shape", () => {
    expect(isStatsFile({ updated: "2026-10-25", platforms: [p({ views: 3 })] })).toBe(true);
    expect(isStatsFile({ updated: "x", platforms: [p({ views: -1 })] })).toBe(false);
    expect(isStatsFile({ platforms: [] })).toBe(false);
  });
  it("formats counts", () => {
    expect(fmtCount(null)).toBe("n/a");
    expect(fmtCount(1234)).toBe("1,234");
  });
});
