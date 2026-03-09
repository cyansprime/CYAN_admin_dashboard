"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { engagementTrendConfig, engagementTrendData } from "./marketing.config";

export function EngagementTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Trend</CardTitle>
        <CardDescription>Weekly engagement by channel (8 weeks)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={engagementTrendConfig} className="h-64 w-full">
          <AreaChart data={engagementTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="line"
              fill="var(--color-line)"
              fillOpacity={0.1}
              stroke="var(--color-line)"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              dataKey="facebook"
              fill="var(--color-facebook)"
              fillOpacity={0.1}
              stroke="var(--color-facebook)"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              dataKey="instagram"
              fill="var(--color-instagram)"
              fillOpacity={0.1}
              stroke="var(--color-instagram)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
