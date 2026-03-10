"use client";

import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/api-client";

export interface SolarTerm {
  name: string;
  icon: string;
  desc: string;
}

export interface DayEntry {
  date: string;
  weekday: string;
  is_today: boolean;
  anchor_id: string;
  anchor: string;
  anchor_role: string;
  solar_term: SolarTerm | null;
  proverb: { text: string; source: string };
  broadcast_preview: string;
}

export function useUpcomingAlmanac(days = 14) {
  return useQuery<DayEntry[]>({
    queryKey: ["almanac", "upcoming", days],
    queryFn: async () => {
      const res = await apiClient.get("/almanac/upcoming", { params: { days } });
      return res.data as DayEntry[];
    },
    staleTime: 60 * 60 * 1000,
  });
}
