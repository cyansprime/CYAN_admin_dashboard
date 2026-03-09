"use client";

import { Globe, Sprout, TrendingUp, Warehouse } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

import { kpiData } from "./cyan.config";

const cards = [
  {
    title: "Active Varieties",
    value: kpiData.activeVarieties.toString(),
    sub: `${kpiData.breedingLines} breeding lines`,
    change: kpiData.varietiesChange,
    positive: true,
    icon: Sprout,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
  },
  {
    title: "Seed Inventory",
    value: `${kpiData.inventoryTons.toLocaleString()} tons`,
    sub: "Total stock",
    change: kpiData.inventoryChange,
    positive: false,
    icon: Warehouse,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    title: "Monthly Sales",
    value: formatCurrency(kpiData.monthlySales),
    sub: `YTD: ${formatCurrency(kpiData.ytdSales)}`,
    change: kpiData.salesChange,
    positive: true,
    icon: TrendingUp,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    title: "Export Markets",
    value: kpiData.activeMarkets.toString(),
    sub: "Active countries",
    change: kpiData.marketsChange,
    positive: true,
    icon: Globe,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
];

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <div className={`w-fit rounded-lg p-2 ${card.iconBg}`}>
              <card.icon className={`size-5 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="flex size-full flex-col justify-between gap-2">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">{card.title}</p>
              <p className="font-semibold text-2xl tabular-nums">{card.value}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">{card.sub}</span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                  card.positive ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                }`}
              >
                {card.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
