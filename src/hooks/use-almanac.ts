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
  solar_term: SolarTerm | null;
  proverb: { text: string; source: string };
}

export function useUpcomingAlmanac(days = 14) {
  return useQuery<DayEntry[]>({
    queryKey: ["almanac", "upcoming", days],
    queryFn: async () => {
      const res = await apiClient.get("/almanac/upcoming", { params: { days } });
      return res.data as DayEntry[];
    },
    staleTime: 60 * 60 * 1000, // 節氣每日不變，1 小時才重新 fetch
  });
}
