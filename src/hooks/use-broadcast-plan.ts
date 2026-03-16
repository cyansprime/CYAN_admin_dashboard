import { useQuery } from "@tanstack/react-query";

import contentHubClient from "@/lib/content-hub-client";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface DayPlan {
  date: string;
  dayOfWeek: number;
  hostId: string;
  hostName: string;
  classicId: string;
  classicName: string;
  card: {
    key: string;
    cardId: string;
    seriesId: string;
    seriesName: string;
    seriesSubtitle: string;
    originalText: string;
    modernText: string;
    scenario: string;
    source: string;
    keywords: string[];
    emotionFrom: string;
    emotionTo: string;
  };
  channels: string[];
  assets: {
    cardImage: boolean;
    audio: boolean;
    videoStory: boolean;
    videoSquare: boolean;
    bgm: boolean;
  };
}

export interface MonthCard {
  key: string;
  cardId: string;
  classicId: string;
  classicName: string;
  hostId: string;
  hostName: string;
  seriesId: string;
  seriesName: string;
  seriesSubtitle: string;
  originalText: string;
  modernText: string;
  scenario: string;
  source: string;
  keywords: string[];
  emotionFrom: string;
  emotionTo: string;
  coreFunction: string;
}

// ---------------------------------------------------------------------------
// Host / channel rotation helpers
// ---------------------------------------------------------------------------

/** Deterministic host rotation by day-of-week (0=Sun). */
export function getHostForDay(dayOfWeek: number): { hostId: string; hostName: string; classicId: string } {
  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
    return { hostId: "xiaoqing", hostName: "小青", classicId: "shijing" };
  }
  if (dayOfWeek === 2 || dayOfWeek === 4) {
    return { hostId: "xiaohe", hostName: "禾姊", classicId: "yijing" };
  }
  return { hostId: "ayuan", hostName: "阿元", classicId: "zhuangzi" };
}

/** Channels for a given day-of-week (0=Sun). YouTube only on weekends. */
export function getChannelsForDay(dayOfWeek: number): string[] {
  const base = ["LINE", "Instagram", "Facebook"];
  if (dayOfWeek === 0 || dayOfWeek === 6) base.push("YouTube");
  return base;
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

export function formatDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getSunday(d: Date): Date {
  const result = new Date(d);
  result.setDate(result.getDate() - result.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch 7 days starting from a given Sunday via `/schedule/weekly`. */
export function useWeeklyPlan(from?: string) {
  return useQuery<DayPlan[]>({
    queryKey: ["weekly-plan", from],
    queryFn: async () => {
      const params = from ? `?from=${from}` : "";
      const { data } = await contentHubClient.get(`/schedule/weekly${params}`);
      return data;
    },
  });
}

/** Fetch schedule data for an entire month via `/schedule/range`. */
export function useMonthSchedule(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const from = formatDateStr(firstDay);
  const to = formatDateStr(lastDay);

  return useQuery<Record<string, Record<string, MonthCard>>>({
    queryKey: ["month-schedule", from, to],
    queryFn: async () => {
      const { data } = await contentHubClient.get(`/schedule/range?from=${from}&to=${to}`);
      return data;
    },
  });
}
