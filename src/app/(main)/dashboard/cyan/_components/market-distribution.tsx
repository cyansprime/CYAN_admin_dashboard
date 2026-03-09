"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { marketDistributionConfig, marketDistributionData } from "./cyan.config";

export function MarketDistribution() {
  const totalTons = marketDistributionData.reduce((acc, curr) => acc + curr.tons, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Distribution</CardTitle>
        <CardDescription>Export volume by region</CardDescription>
      </CardHeader>
      <CardContent className="max-h-64">
        <ChartContainer config={marketDistributionConfig} className="size-full">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={marketDistributionData}
              dataKey="tons"
              nameKey="market"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
              cornerRadius={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground font-bold text-3xl tabular-nums"
                        >
                          {totalTons.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                          Tons
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              content={() => (
                <ul className="ml-8 flex flex-col gap-3">
                  {marketDistributionData.map((item) => (
                    <li key={item.market} className="flex w-36 items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: item.fill }} />
                        {marketDistributionConfig[item.market as keyof typeof marketDistributionConfig]?.label ??
                          item.market}
                      </span>
                      <span className="tabular-nums">{item.tons}t</span>
                    </li>
                  ))}
                </ul>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
