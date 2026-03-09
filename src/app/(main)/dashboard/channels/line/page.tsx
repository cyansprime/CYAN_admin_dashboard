"use client";

import { Bot, Eye, MessageCircle, MousePointerClick, Send, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { lineKpi, lineOpenRateConfig, lineOpenRateData } from "../_components/channels.config";

const cards = [
  { title: "Total Friends", value: lineKpi.totalFriends.toLocaleString(), sub: lineKpi.friendsChange, icon: Users },
  { title: "Avg Open Rate", value: lineKpi.avgOpenRate, sub: "Last 30 days", icon: Eye },
  { title: "Avg Click Rate", value: lineKpi.avgClickRate, sub: "Last 30 days", icon: MousePointerClick },
  { title: "Broadcasts Sent", value: lineKpi.broadcastsSent.toString(), sub: "This month", icon: Send },
  { title: "Auto Replies", value: lineKpi.autoReplies.toLocaleString(), sub: "This month", icon: Bot },
  { title: "Blocked Rate", value: lineKpi.blockedRate, sub: "Current", icon: MessageCircle },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <div className="w-fit rounded-lg bg-green-500/10 p-2">
                <card.icon className="size-5 text-green-500" />
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
          <CardTitle>Open & Click Rate Trend</CardTitle>
          <CardDescription>Weekly broadcast performance (8 weeks)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineOpenRateConfig} className="h-64 w-full">
            <AreaChart data={lineOpenRateData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${v}%`} />} />
              <Area
                dataKey="openRate"
                fill="var(--color-openRate)"
                fillOpacity={0.1}
                stroke="var(--color-openRate)"
                strokeWidth={2}
                type="monotone"
              />
              <Area
                dataKey="clickRate"
                fill="var(--color-clickRate)"
                fillOpacity={0.1}
                stroke="var(--color-clickRate)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
