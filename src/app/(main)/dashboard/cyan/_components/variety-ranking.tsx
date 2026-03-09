"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { varietyRankingConfig, varietyRankingData } from "./cyan.config";

export function VarietyRanking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Varieties</CardTitle>
        <CardDescription>Sales by variety (current month)</CardDescription>
      </CardHeader>
      <CardContent className="size-full max-h-64">
        <ChartContainer config={varietyRankingConfig} className="size-full">
          <BarChart data={varietyRankingData} layout="vertical" accessibilityLayer>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="variety" type="category" tickLine={false} tickMargin={10} axisLine={false} width={70} />
            <XAxis type="number" hide />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />}
            />
            <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
              <LabelList
                dataKey="sales"
                position="insideRight"
                offset={8}
                className="fill-primary-foreground text-xs tabular-nums"
                formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
