"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  audioPath?: string;
  approvalStatus?: string;
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
    audioPath: r.audio_path ? String(r.audio_path) : undefined,
    approvalStatus: r.approval_status ? String(r.approval_status) : undefined,
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

export function usePendingBroadcasts() {
  return useQuery<Broadcast[]>({
    queryKey: ["broadcasts", { status: "Pending Approval" }],
    queryFn: async () => {
      const res = await apiClient.get("/broadcasts", { params: { status: "Pending Approval" } });
      return (res.data.broadcasts as Record<string, unknown>[]).map(mapApiRecord);
    },
    staleTime: 15 * 1000,
  });
}

export function useApproveBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (broadcastId: string) => {
      const res = await apiClient.post(`/broadcasts/${broadcastId}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["broadcast-stats"] });
    },
  });
}

export function useRejectBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (broadcastId: string) => {
      const res = await apiClient.post(`/broadcasts/${broadcastId}/reject`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["broadcast-stats"] });
    },
  });
}
