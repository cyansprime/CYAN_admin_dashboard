"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import contentHubClient from "@/lib/content-hub-client";

export interface PrepCheckAssets {
  cardImage: boolean;
  audio: boolean;
  videoStory: boolean;
  videoSquare: boolean;
}

export interface PrepCheckEntry {
  time: string;
  channel: string;
  hostId: string;
  cardKey: string;
  contentType: string;
  assets: PrepCheckAssets;
  ready: boolean;
  missing: string[];
}

export interface PrepCheckDateGroup {
  date: string;
  entries: PrepCheckEntry[];
  allReady: boolean;
  readyCount: number;
  totalCount: number;
}

export interface PrepCheckMissingAsset {
  cardKey: string;
  cardId: string;
  classicId: string;
  seriesName: string;
  missing: string[];
  neededBy: string;
  urgency: "urgent" | "soon";
}

export interface PrepCheckSummary {
  allReady: boolean;
  missingCount: number;
  readyCount: number;
}

export interface PrepCheckData {
  checkDate: string;
  days: number;
  fromDate: string;
  toDate: string;
  totalEntries: number;
  summary: PrepCheckSummary;
  byDate: PrepCheckDateGroup[];
  missingAssets: PrepCheckMissingAsset[];
}

export function usePrepCheck(days = 3) {
  return useQuery<PrepCheckData>({
    queryKey: ["prep-check", days],
    queryFn: async () => {
      const res = await contentHubClient.get(`/schedule/prep-check?days=${days}`);
      return res.data as PrepCheckData;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

// ── Generation mutations ─────────────────────────────────────────

export interface GenerateParams {
  classic?: string;
  card?: string;
  force?: boolean;
}

export interface JobResponse {
  jobId: string;
  status: string;
}

export interface JobStatus {
  id: string;
  type: string;
  status: "running" | "done" | "failed";
  startedAt: string;
  finishedAt?: string;
  params: Record<string, string>;
  exitCode?: number;
  progress: number | null;
  progressMessage: string | null;
  outputLines: string[];
}

export function useGenerateCards() {
  const qc = useQueryClient();
  return useMutation<JobResponse, Error, GenerateParams>({
    mutationFn: async (params) => {
      const res = await contentHubClient.post("/generate/card", params);
      return res.data as JobResponse;
    },
    onSuccess: () => {
      setTimeout(() => qc.invalidateQueries({ queryKey: ["prep-check"] }), 5000);
    },
  });
}

export function useGenerateAudio() {
  const qc = useQueryClient();
  return useMutation<JobResponse, Error, GenerateParams>({
    mutationFn: async (params) => {
      const res = await contentHubClient.post("/generate/audio", params);
      return res.data as JobResponse;
    },
    onSuccess: () => {
      setTimeout(() => qc.invalidateQueries({ queryKey: ["prep-check"] }), 10000);
    },
  });
}

export function useGenerateVideo() {
  const qc = useQueryClient();
  return useMutation<JobResponse, Error, GenerateParams>({
    mutationFn: async (params) => {
      const res = await contentHubClient.post("/generate/video", params);
      return res.data as JobResponse;
    },
    onSuccess: () => {
      setTimeout(() => qc.invalidateQueries({ queryKey: ["prep-check"] }), 15000);
    },
  });
}

export function useJobStatus(jobId: string | null) {
  return useQuery<JobStatus>({
    queryKey: ["job-status", jobId],
    queryFn: async () => {
      const res = await contentHubClient.get(`/jobs/${jobId}`);
      return res.data as JobStatus;
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "running") return 3000;
      return false;
    },
  });
}

export function useBatchGenerate() {
  const qc = useQueryClient();
  return useMutation<
    { jobIds: string[]; count: number },
    Error,
    Array<{ type: string; classic?: string; card?: string; force?: boolean }>
  >({
    mutationFn: async (tasks) => {
      const res = await contentHubClient.post("/generate/batch", { tasks });
      return res.data as { jobIds: string[]; count: number };
    },
    onSuccess: () => {
      setTimeout(() => qc.invalidateQueries({ queryKey: ["prep-check"] }), 10000);
    },
  });
}
