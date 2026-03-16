import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import contentHubClient from "@/lib/content-hub-client";

export type ChannelId = "LINE" | "Instagram" | "Facebook" | "YouTube";
export type ContentType = "card" | "video" | "card+video";
export type EntryStatus = "draft" | "scheduled" | "published";

export interface ScheduleEntry {
  id: string;
  date: string;
  time: string; // HH:MM broadcast time
  channel: ChannelId;
  hostId: string;
  cardKey: string;
  contentType: ContentType;
  status: EntryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Default broadcast times per channel */
export const DEFAULT_CHANNEL_TIMES: Record<ChannelId, string> = {
  LINE: "07:00",
  Instagram: "08:00",
  Facebook: "09:00",
  YouTube: "10:00",
};

export const ALL_CHANNELS: ChannelId[] = ["LINE", "Instagram", "Facebook", "YouTube"];

export function useScheduleEntries(filters?: { date?: string; from?: string; to?: string }) {
  const params = new URLSearchParams();
  if (filters?.date) params.set("date", filters.date);
  if (filters?.from) params.set("from", filters.from);
  if (filters?.to) params.set("to", filters.to);
  const qs = params.toString();

  return useQuery<ScheduleEntry[]>({
    queryKey: ["schedule-entries", qs],
    queryFn: async () => {
      const { data } = await contentHubClient.get(`/schedule/entries${qs ? `?${qs}` : ""}`);
      return data;
    },
  });
}

export function useSaveDaySchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      date: string;
      entries: Array<Omit<ScheduleEntry, "id" | "createdAt" | "updatedAt" | "date">>;
    }) => {
      const { data } = await contentHubClient.post("/schedule/entries/day", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedule-entries"] });
    },
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await contentHubClient.delete(`/schedule/entries/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedule-entries"] });
    },
  });
}
