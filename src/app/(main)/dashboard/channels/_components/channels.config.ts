import type { ChartConfig } from "@/components/ui/chart";

// ── Channel Overview KPIs ─────────────────────────────────────
export const channelSummary = [
  {
    name: "LINE",
    followers: 12_400,
    followersChange: "+320",
    reach: 95_000,
    engagement: 7_200,
    engagementRate: "7.6%",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    name: "Facebook",
    followers: 11_250,
    followersChange: "+580",
    reach: 112_000,
    engagement: 6_800,
    engagementRate: "6.1%",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Instagram",
    followers: 8_500,
    followersChange: "+340",
    reach: 77_500,
    engagement: 4_720,
    engagementRate: "6.1%",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
];

// ── Follower Growth (AreaChart) ───────────────────────────────
export const followerGrowthData = [
  { month: "Oct", line: 10_200, facebook: 9_100, instagram: 6_800 },
  { month: "Nov", line: 10_800, facebook: 9_600, instagram: 7_200 },
  { month: "Dec", line: 11_200, facebook: 10_100, instagram: 7_600 },
  { month: "Jan", line: 11_600, facebook: 10_500, instagram: 7_900 },
  { month: "Feb", line: 12_080, facebook: 10_670, instagram: 8_160 },
  { month: "Mar", line: 12_400, facebook: 11_250, instagram: 8_500 },
];

export const followerGrowthConfig = {
  line: { label: "LINE", color: "var(--chart-1)" },
  facebook: { label: "Facebook", color: "var(--chart-2)" },
  instagram: { label: "Instagram", color: "var(--chart-3)" },
} satisfies ChartConfig;

// ── LINE Specific ─────────────────────────────────────────────
export const lineKpi = {
  totalFriends: 12_400,
  friendsChange: "+320",
  blockedRate: "4.2%",
  avgOpenRate: "72%",
  avgClickRate: "14.1%",
  broadcastsSent: 18,
  autoReplies: 2_450,
};

export const lineOpenRateData = [
  { week: "W1", openRate: 68, clickRate: 12 },
  { week: "W2", openRate: 72, clickRate: 15 },
  { week: "W3", openRate: 70, clickRate: 13 },
  { week: "W4", openRate: 75, clickRate: 16 },
  { week: "W5", openRate: 71, clickRate: 14 },
  { week: "W6", openRate: 74, clickRate: 18 },
  { week: "W7", openRate: 69, clickRate: 11 },
  { week: "W8", openRate: 76, clickRate: 15 },
];

export const lineOpenRateConfig = {
  openRate: { label: "Open Rate %", color: "var(--chart-1)" },
  clickRate: { label: "Click Rate %", color: "var(--chart-2)" },
} satisfies ChartConfig;

// ── Facebook Specific ─────────────────────────────────────────
export const facebookKpi = {
  pageFollowers: 11_250,
  followersChange: "+580",
  pageReach: 112_000,
  postEngagement: 6_800,
  avgEngRate: "6.1%",
  adSpend: 4_200,
  costPerLead: "$8.40",
};

export const facebookReachData = [
  { week: "W1", organic: 12_000, paid: 5_200 },
  { week: "W2", organic: 14_500, paid: 6_100 },
  { week: "W3", organic: 11_800, paid: 4_800 },
  { week: "W4", organic: 16_200, paid: 7_500 },
  { week: "W5", organic: 13_500, paid: 5_900 },
  { week: "W6", organic: 15_000, paid: 6_800 },
  { week: "W7", organic: 14_200, paid: 5_500 },
  { week: "W8", organic: 15_800, paid: 7_200 },
];

export const facebookReachConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  paid: { label: "Paid", color: "var(--chart-2)" },
} satisfies ChartConfig;

// ── Instagram Specific ────────────────────────────────────────
export const instagramKpi = {
  followers: 8_500,
  followersChange: "+340",
  reachTotal: 77_500,
  reelsViews: 52_000,
  avgEngRate: "6.1%",
  storiesViews: 4_200,
  profileVisits: 1_850,
};

export const instagramContentData = [
  { week: "W1", reels: 5_200, posts: 2_100, stories: 480 },
  { week: "W2", reels: 6_800, posts: 2_400, stories: 520 },
  { week: "W3", reels: 5_900, posts: 1_900, stories: 450 },
  { week: "W4", reels: 7_500, posts: 2_600, stories: 580 },
  { week: "W5", reels: 6_200, posts: 2_300, stories: 500 },
  { week: "W6", reels: 7_100, posts: 2_500, stories: 540 },
  { week: "W7", reels: 6_500, posts: 2_200, stories: 510 },
  { week: "W8", reels: 7_800, posts: 2_700, stories: 620 },
];

export const instagramContentConfig = {
  reels: { label: "Reels", color: "var(--chart-1)" },
  posts: { label: "Posts", color: "var(--chart-2)" },
  stories: { label: "Stories", color: "var(--chart-3)" },
} satisfies ChartConfig;
