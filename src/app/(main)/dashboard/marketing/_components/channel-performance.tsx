"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { channelPerformanceConfig, channelPerformanceData } from "./marketing.config";

export function ChannelPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Performance</CardTitle>
        <CardDescription>Reach, engagement, and followers by platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={channelPerformanceConfig} className="h-64 w-full">
          <BarChart data={channelPerformanceData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="channel" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="reach" fill="var(--color-reach)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="followers" fill="var(--color-followers)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
