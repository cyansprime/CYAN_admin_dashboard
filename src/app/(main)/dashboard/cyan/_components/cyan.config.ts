import type { ChartConfig } from "@/components/ui/chart";

// ── KPI Overview ──────────────────────────────────────────────
export const kpiData = {
  activeVarieties: 47,
  varietiesChange: "+5",
  breedingLines: 128,
  breedingLinesChange: "+12",
  inventoryTons: 1_245,
  inventoryChange: "-8.2%",
  monthlySales: 892_000,
  ytdSales: 6_340_000,
  salesChange: "+18.3%",
  activeMarkets: 14,
  marketsChange: "+2",
};

// ── Sales Trend (AreaChart) ───────────────────────────────────
export const salesTrendData = [
  { month: "Jul 2025", sales: 520_000, lastYear: 410_000 },
  { month: "Aug 2025", sales: 680_000, lastYear: 490_000 },
  { month: "Sep 2025", sales: 750_000, lastYear: 580_000 },
  { month: "Oct 2025", sales: 920_000, lastYear: 640_000 },
  { month: "Nov 2025", sales: 1_100_000, lastYear: 780_000 },
  { month: "Dec 2025", sales: 870_000, lastYear: 720_000 },
  { month: "Jan 2026", sales: 640_000, lastYear: 530_000 },
  { month: "Feb 2026", sales: 892_000, lastYear: 610_000 },
];

export const salesTrendConfig = {
  sales: {
    label: "This Year",
    color: "var(--chart-1)",
  },
  lastYear: {
    label: "Last Year",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// ── Variety Sales Ranking (BarChart) ──────────────────────────
export const varietyRankingData = [
  { variety: "CY-3088", sales: 186_000, fill: "var(--chart-1)" },
  { variety: "CY-2055", sales: 152_000, fill: "var(--chart-2)" },
  { variety: "CY-4012", sales: 134_000, fill: "var(--chart-3)" },
  { variety: "CY-1099", sales: 118_000, fill: "var(--chart-4)" },
  { variety: "CY-5021", sales: 96_000, fill: "var(--chart-5)" },
  { variety: "CY-3041", sales: 78_000, fill: "var(--chart-1)" },
];

export const varietyRankingConfig = {
  sales: {
    label: "Sales ($)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// ── Market Distribution (PieChart) ────────────────────────────
export const marketDistributionData = [
  { market: "southeastAsia", tons: 380, fill: "var(--color-southeastAsia)" },
  { market: "southAsia", tons: 290, fill: "var(--color-southAsia)" },
  { market: "africa", tons: 210, fill: "var(--color-africa)" },
  { market: "latinAmerica", tons: 175, fill: "var(--color-latinAmerica)" },
  { market: "domestic", tons: 190, fill: "var(--color-domestic)" },
];

export const marketDistributionConfig = {
  tons: {
    label: "Tons",
  },
  southeastAsia: {
    label: "Southeast Asia",
    color: "var(--chart-1)",
  },
  southAsia: {
    label: "South Asia",
    color: "var(--chart-2)",
  },
  africa: {
    label: "Africa",
    color: "var(--chart-3)",
  },
  latinAmerica: {
    label: "Latin America",
    color: "var(--chart-4)",
  },
  domestic: {
    label: "Domestic",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

// ── Breeding Pipeline (BarChart stacked) ──────────────────────
export const breedingPipelineData = [
  { stage: "Inbred Selection", count: 42, fill: "var(--chart-1)" },
  { stage: "Testcross", count: 35, fill: "var(--chart-2)" },
  { stage: "Regional Trial", count: 24, fill: "var(--chart-3)" },
  { stage: "Multi-location", count: 16, fill: "var(--chart-4)" },
  { stage: "Pre-commercial", count: 8, fill: "var(--chart-5)" },
  { stage: "Released", count: 3, fill: "var(--chart-1)" },
];

export const breedingPipelineConfig = {
  count: {
    label: "Lines",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// ── Inventory Alerts ──────────────────────────────────────────
export const inventoryAlerts = [
  { variety: "CY-3088", stock: 12, unit: "tons", threshold: 20, status: "critical" as const },
  { variety: "CY-2055", stock: 18, unit: "tons", threshold: 25, status: "low" as const },
  { variety: "CY-1099", stock: 22, unit: "tons", threshold: 30, status: "low" as const },
  { variety: "CY-5021", stock: 8, unit: "tons", threshold: 15, status: "critical" as const },
  { variety: "CY-4012", stock: 35, unit: "tons", threshold: 40, status: "low" as const },
];

// ── Recent Orders (DataTable) ─────────────────────────────────
export const recentOrdersData = [
  {
    id: "ORD-2601",
    customer: "PT Agri Nusantara",
    variety: "CY-3088",
    quantity: "45 tons",
    destination: "Indonesia",
    status: "Shipped",
    date: "2026-03-05",
  },
  {
    id: "ORD-2598",
    customer: "Tata Seeds India",
    variety: "CY-2055",
    quantity: "32 tons",
    destination: "India",
    status: "Processing",
    date: "2026-03-04",
  },
  {
    id: "ORD-2595",
    customer: "AgriCorp Vietnam",
    variety: "CY-4012",
    quantity: "28 tons",
    destination: "Vietnam",
    status: "Shipped",
    date: "2026-03-03",
  },
  {
    id: "ORD-2592",
    customer: "Kenya Seed Co.",
    variety: "CY-1099",
    quantity: "18 tons",
    destination: "Kenya",
    status: "Pending",
    date: "2026-03-02",
  },
  {
    id: "ORD-2589",
    customer: "Semillas del Sur",
    variety: "CY-3088",
    quantity: "55 tons",
    destination: "Mexico",
    status: "Shipped",
    date: "2026-03-01",
  },
  {
    id: "ORD-2586",
    customer: "Myanmar Agro Ltd",
    variety: "CY-5021",
    quantity: "20 tons",
    destination: "Myanmar",
    status: "Processing",
    date: "2026-02-28",
  },
  {
    id: "ORD-2583",
    customer: "Bangladesh Seeds",
    variety: "CY-2055",
    quantity: "38 tons",
    destination: "Bangladesh",
    status: "Delivered",
    date: "2026-02-26",
  },
  {
    id: "ORD-2580",
    customer: "Thai Corn Trading",
    variety: "CY-4012",
    quantity: "42 tons",
    destination: "Thailand",
    status: "Delivered",
    date: "2026-02-24",
  },
  {
    id: "ORD-2577",
    customer: "Nigeria AgroChem",
    variety: "CY-1099",
    quantity: "25 tons",
    destination: "Nigeria",
    status: "Shipped",
    date: "2026-02-22",
  },
  {
    id: "ORD-2574",
    customer: "Philippine Hybrid",
    variety: "CY-3041",
    quantity: "30 tons",
    destination: "Philippines",
    status: "Delivered",
    date: "2026-02-20",
  },
];
