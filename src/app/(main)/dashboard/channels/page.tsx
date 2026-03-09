"use client";

import { MessageCircle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { channelSummary, followerGrowthConfig, followerGrowthData } from "./_components/channels.config";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Channel Summary Cards */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-3">
        {channelSummary.map((ch) => (
          <Card key={ch.name}>
            <CardHeader>
              <div className={`w-fit rounded-lg p-2 ${ch.bg}`}>
                <MessageCircle className={`size-5 ${ch.color}`} />
              </div>
            </CardHeader>
            <CardContent className="flex size-full flex-col gap-3">
              <div>
                <p className="font-semibold text-lg">{ch.name}</p>
                <p className="text-muted-foreground text-xs">{ch.followers.toLocaleString()} followers</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Reach</p>
                  <p className="font-medium tabular-nums">{ch.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Engagement</p>
                  <p className="font-medium tabular-nums">{ch.engagement.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Eng. Rate</p>
                  <p className="font-medium tabular-nums">{ch.engagementRate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">New</p>
                  <p className="font-medium text-green-500 tabular-nums">{ch.followersChange}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Follower Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Follower Growth</CardTitle>
          <CardDescription>Monthly follower trend across all channels</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={followerGrowthConfig} className="h-64 w-full">
            <AreaChart data={followerGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
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
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Total: {channelSummary.reduce((a, c) => a + c.followers, 0).toLocaleString()} followers
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
