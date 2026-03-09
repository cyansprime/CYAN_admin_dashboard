"use client";

import { Eye, Heart, Image, Play, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { instagramContentConfig, instagramContentData, instagramKpi } from "../_components/channels.config";

const cards = [
  {
    title: "Followers",
    value: instagramKpi.followers.toLocaleString(),
    sub: instagramKpi.followersChange,
    icon: Users,
  },
  { title: "Total Reach", value: instagramKpi.reachTotal.toLocaleString(), sub: "This month", icon: Eye },
  { title: "Reels Views", value: instagramKpi.reelsViews.toLocaleString(), sub: "This month", icon: Play },
  { title: "Avg Eng. Rate", value: instagramKpi.avgEngRate, sub: "This month", icon: Heart },
  { title: "Stories Views", value: instagramKpi.storiesViews.toLocaleString(), sub: "This month", icon: Image },
  { title: "Profile Visits", value: instagramKpi.profileVisits.toLocaleString(), sub: "This month", icon: TrendingUp },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <div className="w-fit rounded-lg bg-pink-500/10 p-2">
                <card.icon className="size-5 text-pink-500" />
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
          <CardTitle>Content Performance</CardTitle>
          <CardDescription>Weekly reach by content type (8 weeks)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={instagramContentConfig} className="h-64 w-full">
            <BarChart data={instagramContentData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="reels" fill="var(--color-reels)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="posts" fill="var(--color-posts)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stories" fill="var(--color-stories)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
