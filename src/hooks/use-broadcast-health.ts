"use client";

import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/api-client";

export type HealthStatus = "ok" | "fallback" | "failed" | "missing";

export interface BroadcastHealth {
  today_status: HealthStatus;
  last_broadcast_at: string | null;
  streak: number;
  today_records: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    used_fallback: number;
    data_sources: Record<string, string>;
    scheduled_at: string;
  }>;
}

export function useBroadcastHealth() {
  return useQuery<BroadcastHealth>({
    queryKey: ["health", "broadcast"],
    queryFn: async () => {
      const res = await apiClient.get("/health/broadcast");
      return res.data as BroadcastHealth;
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // 每 5 分鐘自動刷新
  });
}
