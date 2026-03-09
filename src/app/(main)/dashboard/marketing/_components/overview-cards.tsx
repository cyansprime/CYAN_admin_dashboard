"use client";

import { Eye, Heart, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { marketingKpi } from "./marketing.config";

const cards = [
  {
    title: "Total Reach",
    value: marketingKpi.totalReach.toLocaleString(),
    sub: "Across all channels",
    change: marketingKpi.reachChange,
    positive: true,
    icon: Eye,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    title: "Engagement",
    value: marketingKpi.totalEngagement.toLocaleString(),
    sub: "Likes, comments, shares",
    change: marketingKpi.engagementChange,
    positive: true,
    icon: Heart,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    title: "Total Followers",
    value: marketingKpi.followers.toLocaleString(),
    sub: "LINE + FB + IG",
    change: marketingKpi.followersChange,
    positive: true,
    icon: Users,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
  },
  {
    title: "Conversion Rate",
    value: marketingKpi.conversionRate,
    sub: "Follower → Lead",
    change: marketingKpi.conversionChange,
    positive: true,
    icon: TrendingUp,
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
              <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                {card.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
