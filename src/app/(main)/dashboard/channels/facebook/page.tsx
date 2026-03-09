"use client";

import { DollarSign, Eye, Heart, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

import { facebookKpi, facebookReachConfig, facebookReachData } from "../_components/channels.config";

const cards = [
  {
    title: "Page Followers",
    value: facebookKpi.pageFollowers.toLocaleString(),
    sub: facebookKpi.followersChange,
    icon: Users,
  },
  { title: "Page Reach", value: facebookKpi.pageReach.toLocaleString(), sub: "This month", icon: Eye },
  { title: "Post Engagement", value: facebookKpi.postEngagement.toLocaleString(), sub: "This month", icon: Heart },
  { title: "Avg Eng. Rate", value: facebookKpi.avgEngRate, sub: "This month", icon: TrendingUp },
  { title: "Ad Spend", value: formatCurrency(facebookKpi.adSpend), sub: "This month", icon: DollarSign },
  { title: "Cost per Lead", value: facebookKpi.costPerLead, sub: "This month", icon: MousePointerClick },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <div className="w-fit rounded-lg bg-blue-500/10 p-2">
                <card.icon className="size-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="flex size-full flex-col justify-between gap-2">
              <p className="text-muted-foreground text-sm">{card.title}</p>
              <p className="font-semibold text-2xl tabular-nums">{card.value}</p>
              <p className="text-muted-foreground text-xs">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reach: Organic vs Paid</CardTitle>
          <CardDescription>Weekly reach breakdown (8 weeks)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={facebookReachConfig} className="h-64 w-full">
            <BarChart data={facebookReachData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="organic" fill="var(--color-organic)" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="paid" fill="var(--color-paid)" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
