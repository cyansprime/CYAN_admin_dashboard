import type { ChartConfig } from "@/components/ui/chart";

// ── KPI Overview ──────────────────────────────────────────────
export const marketingKpi = {
  totalReach: 284_500,
  reachChange: "+12.4%",
  totalEngagement: 18_720,
  engagementChange: "+8.7%",
  followers: 32_150,
  followersChange: "+1,240",
  conversionRate: "3.2%",
  conversionChange: "+0.5%",
};

// ── Channel Performance (BarChart) ────────────────────────────
export const channelPerformanceData = [
  { channel: "LINE", reach: 95_000, engagement: 7_200, followers: 12_400 },
  { channel: "Facebook", reach: 112_000, engagement: 6_800, followers: 11_250 },
  { channel: "Instagram", reach: 77_500, engagement: 4_720, followers: 8_500 },
];

export const channelPerformanceConfig = {
  reach: {
    label: "Reach",
    color: "var(--chart-1)",
  },
  engagement: {
    label: "Engagement",
    color: "var(--chart-2)",
  },
  followers: {
    label: "Followers",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// ── Engagement Trend (AreaChart) ──────────────────────────────
export const engagementTrendData = [
  { week: "W1", line: 1_800, facebook: 1_600, instagram: 1_100 },
  { week: "W2", line: 2_100, facebook: 1_750, instagram: 1_250 },
  { week: "W3", line: 1_950, facebook: 1_900, instagram: 1_400 },
  { week: "W4", line: 2_300, facebook: 1_680, instagram: 1_350 },
  { week: "W5", line: 1_700, facebook: 2_100, instagram: 1_500 },
  { week: "W6", line: 2_500, facebook: 1_850, instagram: 1_620 },
  { week: "W7", line: 2_200, facebook: 2_000, instagram: 1_480 },
  { week: "W8", line: 2_650, facebook: 1_920, instagram: 1_700 },
];

export const engagementTrendConfig = {
  line: {
    label: "LINE",
    color: "var(--chart-1)",
  },
  facebook: {
    label: "Facebook",
    color: "var(--chart-2)",
  },
  instagram: {
    label: "Instagram",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// ── Content Type Performance (PieChart) ───────────────────────
export const contentTypeData = [
  { type: "video", engagement: 8_200, fill: "var(--color-video)" },
  { type: "image", engagement: 5_400, fill: "var(--color-image)" },
  { type: "carousel", engagement: 3_100, fill: "var(--color-carousel)" },
  { type: "text", engagement: 2_020, fill: "var(--color-text)" },
];

export const contentTypeConfig = {
  engagement: { label: "Engagement" },
  video: { label: "Video/Reels", color: "var(--chart-1)" },
  image: { label: "Image", color: "var(--chart-2)" },
  carousel: { label: "Carousel", color: "var(--chart-3)" },
  text: { label: "Text/Article", color: "var(--chart-4)" },
} satisfies ChartConfig;

// ── Top Posts ─────────────────────────────────────────────────
export const topPostsData = [
  {
    id: "P-001",
    title: "CY-3088 field performance showcase",
    channel: "Instagram",
    type: "Reels",
    reach: 45_200,
    engagement: 3_800,
    date: "2026-03-06",
  },
  {
    id: "P-002",
    title: "Seed quality testing process",
    channel: "Facebook",
    type: "Video",
    reach: 38_100,
    engagement: 2_950,
    date: "2026-03-04",
  },
  {
    id: "P-003",
    title: "New variety announcement: CYAN Titan 21",
    channel: "LINE",
    type: "Broadcast",
    reach: 12_400,
    engagement: 4_200,
    date: "2026-03-03",
  },
  {
    id: "P-004",
    title: "Farmer testimonial — Indonesia",
    channel: "Instagram",
    type: "Reels",
    reach: 32_600,
    engagement: 2_100,
    date: "2026-03-01",
  },
  {
    id: "P-005",
    title: "Drought tolerance comparison chart",
    channel: "Facebook",
    type: "Image",
    reach: 28_400,
    engagement: 1_800,
    date: "2026-02-28",
  },
];
