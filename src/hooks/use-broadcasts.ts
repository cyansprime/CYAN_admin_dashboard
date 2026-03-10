"use client";

import { useQuery } from "@tanstack/react-query";

import { broadcastsData } from "@/app/(main)/dashboard/broadcasts/_components/broadcasts.config";
import apiClient from "@/lib/api-client";

export interface Broadcast {
  id: string;
  title: string;
  channel: string;
  type: string;
  audience: string;
  audienceSize: number;
  status: string;
  scheduledAt: string;
  openRate: string;
  clickRate: string;
  script?: string;
}

export interface BroadcastStats {
  total: number;
  sent: number;
  failed: number;
  today: number;
  thisMonth: number;
}

function mapApiRecord(r: Record<string, unknown>): Broadcast {
  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    channel: String(r.channel ?? "LINE"),
    type: String(r.type ?? "Daily Report"),
    audience: String(r.audience ?? ""),
    audienceSize: Number(r.audience_size ?? 0),
    status: String(r.status ?? ""),
    scheduledAt: String(r.scheduled_at ?? "—"),
    openRate: String(r.open_rate ?? "—"),
    clickRate: String(r.click_rate ?? "—"),
    script: r.script ? String(r.script) : undefined,
  };
}

export function useBroadcasts(params?: { status?: string; limit?: number; offset?: number }) {
  return useQuery<Broadcast[]>({
    queryKey: ["broadcasts", params],
    queryFn: async () => {
      const res = await apiClient.get("/broadcasts", { params });
      return (res.data.broadcasts as Record<string, unknown>[]).map(mapApiRecord);
    },
    placeholderData: broadcastsData as Broadcast[],
    staleTime: 30 * 1000,
  });
}

export function useBroadcastStats() {
  return useQuery<BroadcastStats>({
    queryKey: ["broadcasts", "stats"],
    queryFn: async () => {
      const res = await apiClient.get("/broadcasts/stats");
      return res.data as BroadcastStats;
    },
    staleTime: 60 * 1000,
  });
}
