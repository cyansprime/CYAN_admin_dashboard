"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { breedingPipelineConfig, breedingPipelineData } from "./cyan.config";

export function BreedingPipeline() {
  const total = breedingPipelineData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breeding Pipeline</CardTitle>
        <CardDescription>Lines by development stage</CardDescription>
      </CardHeader>
      <CardContent className="size-full max-h-56">
        <ChartContainer config={breedingPipelineConfig} className="size-full">
          <BarChart data={breedingPipelineData} layout="vertical" accessibilityLayer>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="stage"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              width={100}
              className="text-xs"
            />
            <XAxis type="number" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              <LabelList
                dataKey="count"
                position="insideRight"
                offset={8}
                className="fill-primary-foreground text-xs tabular-nums"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-xs">{total} total lines across all stages</p>
      </CardFooter>
    </Card>
  );
}
