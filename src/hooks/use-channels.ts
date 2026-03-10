"use client";

import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/api-client";

export interface LineKpi {
  totalFriends: number;
  friendsChange: string;
  blockedRate: string;
  avgOpenRate: string;
  avgClickRate: string;
  broadcastsSent: number;
  autoReplies: number;
}

export interface LineTrendPoint {
  label: string;
  week: string;
  broadcasts: number;
  sent: number;
  openRate: number;
  clickRate: number;
}

export interface RegionCounts {
  北部: number;
  中部: number;
  南部: number;
  東部: number;
  total: number;
}

export function useLineKpi() {
  return useQuery<LineKpi>({
    queryKey: ["channels", "line"],
    queryFn: async () => {
      const res = await apiClient.get("/channels/line");
      return res.data as LineKpi;
    },
    staleTime: 60 * 1000,
  });
}

export function useLineTrends() {
  return useQuery<LineTrendPoint[]>({
    queryKey: ["channels", "line", "trends"],
    queryFn: async () => {
      const res = await apiClient.get("/channels/line/trends");
      return res.data as LineTrendPoint[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useRegionCounts() {
  return useQuery<RegionCounts>({
    queryKey: ["users", "regions"],
    queryFn: async () => {
      const res = await apiClient.get("/users/regions");
      return res.data as RegionCounts;
    },
    staleTime: 5 * 60 * 1000,
  });
}
