"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { contentTypeConfig, contentTypeData } from "./marketing.config";

export function ContentTypeChart() {
  const total = contentTypeData.reduce((acc, curr) => acc + curr.engagement, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Type Performance</CardTitle>
        <CardDescription>Engagement by content format</CardDescription>
      </CardHeader>
      <CardContent className="max-h-64">
        <ChartContainer config={contentTypeConfig} className="size-full">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={contentTypeData}
              dataKey="engagement"
              nameKey="type"
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
                          {total.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                          Total
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
                  {contentTypeData.map((item) => (
                    <li key={item.type} className="flex w-32 items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: item.fill }} />
                        {contentTypeConfig[item.type as keyof typeof contentTypeConfig]?.label ?? item.type}
                      </span>
                      <span className="tabular-nums">{item.engagement.toLocaleString()}</span>
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
