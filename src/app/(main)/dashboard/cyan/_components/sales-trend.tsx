"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { salesTrendConfig, salesTrendData } from "./cyan.config";

export function SalesTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
        <CardDescription>Monthly revenue comparison (YoY)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesTrendConfig} className="h-64 w-full">
          <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => label}
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
              }
            />
            <Area
              dataKey="lastYear"
              fill="var(--color-lastYear)"
              fillOpacity={0.05}
              stroke="var(--color-lastYear)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              type="monotone"
            />
            <Area
              dataKey="sales"
              fill="var(--color-sales)"
              fillOpacity={0.1}
              stroke="var(--color-sales)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-sm">+18.3% growth compared to same period last year</p>
      </CardFooter>
    </Card>
  );
}
