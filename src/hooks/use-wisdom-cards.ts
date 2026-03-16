"use client";

import { useQuery } from "@tanstack/react-query";

import contentHubClient from "@/lib/content-hub-client";

export interface WisdomCard {
  key: string;
  cardId: string;
  classicId: "shijing" | "yijing" | "zhuangzi";
  classicName: string;
  classicSubtitle: string;
  hostId: "xiaoqing" | "xiaohe" | "ayuan";
  hostName: string;
  coreFunction: string;
  colorScheme: string;
  seriesId: string;
  seriesName: string;
  seriesSubtitle: string;
  keywords: string[];
  emotionFrom: string;
  emotionTo: string;
  source: string;
  originalText: string;
  modernText: string;
  scenario: string;
  globalIndex: number;
}

export interface WisdomCardStats {
  totalCards: number;
  byClassic: Record<string, number>;
  byHost: Record<string, number>;
  totalSeries: number;
  seriesPerClassic: Record<string, number>;
}

export interface WisdomSeries {
  classicId: string;
  classicName: string;
  seriesId: string;
  seriesName: string;
  seriesSubtitle: string;
  keywords: string[];
  emotionFrom: string;
  emotionTo: string;
  cardCount: number;
}

export function useWisdomCards(params?: { classic?: string; series?: string; host?: string }) {
  return useQuery<{ count: number; cards: WisdomCard[] }>({
    queryKey: ["wisdom-cards", params],
    queryFn: async () => {
      const res = await contentHubClient.get("/cards", { params });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWisdomCard(key: string) {
  return useQuery<WisdomCard>({
    queryKey: ["wisdom-card", key],
    queryFn: async () => {
      const res = await contentHubClient.get(`/cards/${key}`);
      return res.data;
    },
    enabled: !!key,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCardSearch(q: string) {
  return useQuery<{ count: number; cards: WisdomCard[] }>({
    queryKey: ["wisdom-cards", "search", q],
    queryFn: async () => {
      const res = await contentHubClient.get("/cards/search", { params: { q } });
      return res.data;
    },
    enabled: q.length > 0,
    staleTime: 30 * 1000,
  });
}

export function useWisdomSeries() {
  return useQuery<WisdomSeries[]>({
    queryKey: ["wisdom-series"],
    queryFn: async () => {
      const res = await contentHubClient.get("/series");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWisdomStats() {
  return useQuery<WisdomCardStats>({
    queryKey: ["wisdom-stats"],
    queryFn: async () => {
      const res = await contentHubClient.get("/stats");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
