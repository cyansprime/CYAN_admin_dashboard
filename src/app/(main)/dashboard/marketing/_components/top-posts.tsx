"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { topPostsData } from "./marketing.config";

const channelColor: Record<string, string> = {
  LINE: "bg-green-500/10 text-green-600",
  Facebook: "bg-blue-500/10 text-blue-600",
  Instagram: "bg-pink-500/10 text-pink-600",
};

export function TopPosts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Posts</CardTitle>
        <CardDescription>Best performing content this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {topPostsData.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm leading-tight">{post.title}</p>
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${channelColor[post.channel]}`}>
                    {post.channel}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {post.type}
                  </Badge>
                  <span className="text-muted-foreground text-xs">{post.date}</span>
                </div>
              </div>
              <div className="flex gap-4 text-right">
                <div>
                  <p className="font-medium text-sm tabular-nums">{post.reach.toLocaleString()}</p>
                  <p className="text-muted-foreground text-[10px]">Reach</p>
                </div>
                <div>
                  <p className="font-medium text-sm tabular-nums">{post.engagement.toLocaleString()}</p>
                  <p className="text-muted-foreground text-[10px]">Engagement</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
