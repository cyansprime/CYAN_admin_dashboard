"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  Film,
  Image,
  Loader2,
  Mic,
  Play,
  RefreshCw,
  Volume2,
  X,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type DayPlan,
  formatDateStr,
  getChannelsForDay,
  getHostForDay,
  getSunday,
  type MonthCard,
  useMonthSchedule,
  useWeeklyPlan,
} from "@/hooks/use-broadcast-plan";
import {
  type PrepCheckMissingAsset,
  useBatchGenerate,
  useGenerateAudio,
  useGenerateCards,
  useGenerateVideo,
  useJobStatus,
  usePrepCheck,
} from "@/hooks/use-prep-check";
import { type ScheduleEntry, useScheduleEntries } from "@/hooks/use-schedule-entries";

import { DayScheduleDialog } from "./_components/day-schedule-dialog";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HOST_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  xiaoqing: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  xiaohe: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  ayuan: {
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
};

const CHANNEL_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  LINE: { bg: "bg-green-500/10", text: "text-green-700", dot: "bg-green-500" },
  Instagram: { bg: "bg-pink-500/10", text: "text-pink-700", dot: "bg-pink-500" },
  Facebook: { bg: "bg-blue-500/10", text: "text-blue-700", dot: "bg-blue-500" },
  YouTube: { bg: "bg-red-500/10", text: "text-red-700", dot: "bg-red-500" },
};

const WEEKDAY_HEADERS = ["日", "一", "二", "三", "四", "五", "六"];
const WEEKDAY_FULL = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

/** Broadcast time slots for day view */
interface TimeSlot {
  time: string;
  label: string;
  desc: string;
  channel?: string;
  weekendOnly?: boolean;
  phase: "prepare" | "broadcast";
}

const _TIME_SLOTS: TimeSlot[] = [
  { time: "05:30", label: "資料收集", desc: "天氣 / 期貨 / 農曆資料蒐集", phase: "prepare" },
  { time: "06:00", label: "腳本生成", desc: "AI 生成當日播報腳本", phase: "prepare" },
  { time: "06:15", label: "圖卡渲染", desc: "智慧圖卡 + 播報圖卡生成", phase: "prepare" },
  { time: "06:30", label: "影片合成", desc: "TTS 語音 + 圖卡影片合成", phase: "prepare" },
  { time: "07:00", label: "LINE 推播", desc: "推送至 LINE 官方帳號", channel: "LINE", phase: "broadcast" },
  { time: "08:00", label: "Instagram 發文", desc: "圖卡貼文 + Story 發佈", channel: "Instagram", phase: "broadcast" },
  { time: "09:00", label: "Facebook 發文", desc: "貼文 + Reels 發佈", channel: "Facebook", phase: "broadcast" },
  {
    time: "10:00",
    label: "YouTube 上傳",
    desc: "Shorts 影片上傳",
    channel: "YouTube",
    weekendOnly: true,
    phase: "broadcast",
  },
  { time: "12:00", label: "互動追蹤", desc: "檢視互動數據與留言回覆", phase: "broadcast" },
  { time: "18:00", label: "成效回顧", desc: "當日觸及、互動、留言彙整", phase: "broadcast" },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ViewMode = "day" | "week" | "month";

interface CalendarDay {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  hostId: string;
  hostName: string;
  classicId: string;
  channels: string[];
  card?: MonthCard;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayStr(): string {
  return formatDateStr(new Date());
}

function buildCalendarDays(
  year: number,
  month: number,
  scheduleData: Record<string, Record<string, MonthCard>> | undefined,
): CalendarDay[] {
  const tStr = todayStr();
  const firstOfMonth = new Date(year, month, 1);
  const startDow = firstOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startDow);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = formatDateStr(d);
    const dow = d.getDay();
    const host = getHostForDay(dow);
    const isCurrentMonth = d.getMonth() === month && d.getFullYear() === year;

    let card: MonthCard | undefined;
    if (scheduleData?.[dateStr]) {
      card = scheduleData[dateStr][host.hostId] as MonthCard | undefined;
    }

    days.push({
      date: d,
      dateStr,
      isCurrentMonth,
      isToday: dateStr === tStr,
      hostId: host.hostId,
      hostName: host.hostName,
      classicId: host.classicId,
      channels: getChannelsForDay(dow),
      card,
    });
  }
  return days;
}

function shortDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ---------------------------------------------------------------------------
// Preview Dialog (shared across all views)
// ---------------------------------------------------------------------------

interface PreviewDialogProps {
  hostId?: string;
  hostName?: string;
  classicId?: string;
  classicName?: string;
  card?: MonthCard | DayPlan["card"] | null;
  dateStr?: string;
  channels?: string[];
  assets?: DayPlan["assets"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PreviewDialog({
  hostId,
  hostName,
  classicId,
  classicName,
  card,
  dateStr,
  channels,
  assets,
  open,
  onOpenChange,
}: PreviewDialogProps) {
  if (!card) return null;
  const colors = HOST_COLORS[hostId ?? "xiaoqing"] ?? HOST_COLORS.xiaoqing;
  const cId = classicId ?? (card as MonthCard).classicId ?? "shijing";
  const cName = classicName ?? (card as MonthCard).classicName ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`${colors.bg} ${colors.text} border-0`}>
              {hostName}
            </Badge>
            <Badge variant="secondary">{cName}</Badge>
            <Badge variant="outline">
              {card.seriesName} · {card.cardId}
            </Badge>
            {dateStr && <span className="text-muted-foreground text-xs">{dateStr}</span>}
          </div>
          <DialogTitle className="text-lg leading-relaxed">「{card.originalText}」</DialogTitle>
          <DialogDescription>
            ——《{cName}·{card.source}》
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Card image */}
          <div>
            <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">圖卡預覽</p>
            <div className="overflow-hidden rounded-lg border">
              <img
                src={`/api/v2/assets/card/${cId}/${card.cardId}`}
                alt={card.originalText}
                className="w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Audio */}
          <div>
            <p className="mb-2 flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
              <Volume2 className="h-3 w-3" /> 語音
            </p>
            {/* biome-ignore lint/a11y/useMediaCaption: internal dashboard tool */}
            <audio controls className="w-full" preload="none">
              <source src={`/api/v2/assets/audio/${cId}/${card.cardId}`} type="audio/wav" />
            </audio>
          </div>

          <Separator />

          {/* Video preview */}
          <div>
            <p className="mb-2 flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
              <Play className="h-3 w-3" /> 影片預覽 (Square)
            </p>
            <div className="overflow-hidden rounded-lg border">
              <img
                src={`/api/v2/assets/video-preview/${cId}/${card.cardId}/square`}
                alt="Video preview"
                className="w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          <Separator />

          <div>
            <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">情境</p>
            <p className="text-sm leading-relaxed">{card.scenario}</p>
          </div>
          <Separator />
          <div>
            <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">現代轉譯</p>
            <p className="text-sm leading-relaxed">{card.modernText}</p>
          </div>
          <Separator />

          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">系列</p>
              <p className="font-medium">
                {card.seriesName}「{card.seriesSubtitle}」
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">情緒轉化</p>
              <p className="font-medium">
                {card.emotionFrom} → {card.emotionTo}
              </p>
            </div>
          </div>

          {/* Asset readiness (if available from weekly data) */}
          {assets && (
            <>
              <Separator />
              <div>
                <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">素材狀態</p>
                <div className="grid grid-cols-5 gap-2">
                  {(
                    [
                      ["cardImage", "圖卡"],
                      ["audio", "語音"],
                      ["videoStory", "Story"],
                      ["videoSquare", "Square"],
                      ["bgm", "BGM"],
                    ] as const
                  ).map(([k, label]) => (
                    <div key={k} className="flex items-center gap-1 text-xs">
                      {assets[k] ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className={assets[k] ? "text-muted-foreground" : "font-medium text-red-600"}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Channels */}
          {channels && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">推播頻道：</span>
              {channels.map((ch) => (
                <Badge key={ch} variant="outline" className="text-xs">
                  {ch}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {card.keywords.map((kw) => (
              <Badge key={kw} variant="outline" className="text-xs">
                #{kw}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Prep Check Alert
// ---------------------------------------------------------------------------

const PREP_HOST_NAMES: Record<string, string> = {
  xiaoqing: "小青",
  xiaohe: "禾姊",
  ayuan: "阿元",
};

const _PREP_ASSET_LABELS: Record<string, string> = {
  cardImage: "圖卡",
  audio: "語音",
  videoStory: "Story影片",
  videoSquare: "Square影片",
};

function PrepCheckAlert() {
  const { data, isLoading, isFetching, isError, refetch } = usePrepCheck(3);
  const genCards = useGenerateCards();
  const genAudio = useGenerateAudio();
  const genVideo = useGenerateVideo();
  const genBatch = useBatchGenerate();

  const [activeJobIds, setActiveJobIds] = useState<string[]>([]);
  const activeJobId = activeJobIds[0] ?? null;
  const { data: jobData } = useJobStatus(activeJobId);

  // Auto-advance through batch jobs + refetch when all done
  const prevJobStatus = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (prevJobStatus.current === "running" && jobData?.status && jobData.status !== "running") {
      if (activeJobIds.length > 1) {
        // Move to next job in batch
        setActiveJobIds((prev) => prev.slice(1));
      } else {
        // All jobs done — refetch prep check
        refetch();
      }
    }
    prevJobStatus.current = jobData?.status;
  }, [jobData?.status, activeJobIds.length, refetch]);

  // Derive what's missing for batch actions
  const _missingTypes = useMemo(() => {
    if (!data) return { cards: false, audio: false, video: false };
    const all = data.missingAssets.flatMap((a) => a.missing);
    return {
      cards: all.includes("cardImage"),
      audio: all.includes("audio"),
      video: all.includes("videoStory") || all.includes("videoSquare"),
    };
  }, [data]);

  function handleRunAll() {
    if (!data) return;
    const tasks: Array<{ type: string; classic?: string; card?: string }> = [];
    // Build per-card tasks from missing assets (video deduped since script generates both formats)
    for (const asset of data.missingAssets) {
      for (const m of deduplicateMissing(asset.missing)) {
        const genType = m === "cardImage" ? "card" : m === "audio" ? "audio" : "video";
        const exists = tasks.some(
          (t) => t.type === genType && t.classic === asset.classicId && t.card === asset.cardId,
        );
        if (!exists) {
          tasks.push({ type: genType, classic: asset.classicId, card: asset.cardId });
        }
      }
    }
    if (tasks.length === 0) return;
    genBatch.mutate(tasks, {
      onSuccess: (r) => {
        setActiveJobIds(r.jobIds);
      },
    });
  }

  const anyRunning =
    genCards.isPending ||
    genAudio.isPending ||
    genVideo.isPending ||
    genBatch.isPending ||
    jobData?.status === "running";

  if (isLoading || isError || !data) return null;

  if (data.summary.allReady) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950/30">
        <div className="flex items-center gap-2 font-medium text-green-800 text-sm dark:text-green-400">
          <Check className="h-4 w-4 shrink-0" />
          未來 3 天推播素材已備齊
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" disabled={isFetching} onClick={() => refetch()}>
          {isFetching ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />} 重新檢查
        </Button>
      </div>
    );
  }

  const urgent = data.missingAssets.filter((a) => a.urgency === "urgent");
  const soon = data.missingAssets.filter((a) => a.urgency === "soon");

  const MISSING_ICON: Record<string, typeof Image> = {
    cardImage: Image,
    audio: Mic,
    video: Film,
  };

  const MISSING_ACTION_LABEL: Record<string, string> = {
    cardImage: "生成圖卡",
    audio: "生成音檔",
    video: "輸出影片",
  };

  // Merge videoStory/videoSquare into single "video" since the script generates both
  function deduplicateMissing(missing: string[]): string[] {
    const result: string[] = [];
    let hasVideo = false;
    for (const m of missing) {
      if (m === "videoStory" || m === "videoSquare") {
        if (!hasVideo) {
          result.push("video");
          hasVideo = true;
        }
      } else {
        result.push(m);
      }
    }
    return result;
  }

  function genForAssetType(type: string, classic: string, card: string) {
    const genType = type === "cardImage" ? "card" : type === "audio" ? "audio" : "video";
    const mutate = genType === "card" ? genCards : genType === "audio" ? genAudio : genVideo;
    mutate.mutate({ classic, card }, { onSuccess: (r) => setActiveJobIds([r.jobId]) });
  }

  // Check if current job matches a specific card
  function isJobForCard(classicId: string, cardId: string): boolean {
    if (!jobData || jobData.status !== "running") return false;
    return jobData.params?.classic === classicId && jobData.params?.card === cardId;
  }

  function renderMissingRow(asset: PrepCheckMissingAsset) {
    const isUrgent = asset.urgency === "urgent";
    const hostId = asset.classicId === "shijing" ? "xiaoqing" : asset.classicId === "yijing" ? "xiaohe" : "ayuan";
    const hostName = PREP_HOST_NAMES[hostId] ?? hostId;
    const rowActive = isJobForCard(asset.classicId, asset.cardId);

    return (
      <div
        key={`${asset.cardKey}-${asset.neededBy}`}
        className={`space-y-2 rounded-lg border p-3 transition ${rowActive ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/20" : ""}`}
      >
        {/* Row header: date, host, card info */}
        <div className="flex items-center gap-2 text-sm">
          <Badge
            variant={isUrgent ? "destructive" : "secondary"}
            className={`shrink-0 px-1.5 text-[10px] ${isUrgent ? "" : "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400"}`}
          >
            {isUrgent ? "緊急" : "即將"}
          </Badge>
          <span className="font-medium">{asset.neededBy}</span>
          <span className="text-muted-foreground">·</span>
          <span>{hostName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {asset.seriesName} {asset.cardId}
          </span>
          {rowActive && <Loader2 className="ml-auto h-3 w-3 shrink-0 animate-spin text-blue-500" />}
        </div>
        {/* Per-item progress bar when job is running for this card */}
        {rowActive && (
          <div className="space-y-1">
            <Progress
              value={jobData?.progress ?? undefined}
              className={`h-1.5 ${jobData?.progress == null ? "animate-pulse" : ""}`}
            />
            {jobData?.progressMessage && (
              <p className="truncate text-[11px] text-blue-600 dark:text-blue-400">{jobData.progressMessage}</p>
            )}
          </div>
        )}
        {/* Per-missing-type action buttons (video merged into single button) */}
        {!rowActive && (
          <div className="flex flex-wrap gap-1.5">
            {deduplicateMissing(asset.missing).map((m) => {
              const Icon = MISSING_ICON[m] ?? AlertTriangle;
              const label = MISSING_ACTION_LABEL[m] ?? m;
              return (
                <Button
                  key={m}
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 border-amber-300 text-amber-700 text-xs hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  disabled={anyRunning}
                  onClick={() => genForAssetType(m, asset.classicId, asset.cardId)}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const allMissing = [...urgent, ...soon];

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-amber-700 text-base dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              推播素材準備提醒
            </CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">未來 3 天有 {data.summary.missingCount} 項素材尚未準備</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={isFetching}
              onClick={() => refetch()}
            >
              {isFetching ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />} 重新檢查
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={anyRunning}
              onClick={handleRunAll}
            >
              {anyRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
              一鍵生成全部
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Job status banner */}
        {activeJobId && jobData && (
          <div
            className={`space-y-1.5 rounded-md px-3 py-2 text-sm ${
              jobData.status === "running"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                : jobData.status === "done"
                  ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {jobData.status === "running" && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />}
              {jobData.status === "done" && <Check className="h-3.5 w-3.5 shrink-0" />}
              {jobData.status === "failed" && <X className="h-3.5 w-3.5 shrink-0" />}
              <span className="flex-1">
                {jobData.status === "running" &&
                  `正在執行 ${jobData.type} 生成...${activeJobIds.length > 1 ? `（還有 ${activeJobIds.length - 1} 項）` : ""}`}
                {jobData.status === "done" &&
                  `${jobData.type} 生成完成${activeJobIds.length > 1 ? `，繼續下一項...` : ""}`}
                {jobData.status === "failed" && `${jobData.type} 生成失敗`}
              </span>
              {jobData.status === "running" && jobData.progress != null && (
                <span className="shrink-0 text-xs tabular-nums">{jobData.progress}%</span>
              )}
              {jobData.status !== "running" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 shrink-0 text-xs"
                  onClick={() => {
                    setActiveJobIds([]);
                    refetch();
                  }}
                >
                  關閉
                </Button>
              )}
            </div>
            {jobData.status === "running" && (
              <div className="space-y-1">
                <Progress
                  value={jobData.progress ?? undefined}
                  className={`h-1.5 ${jobData.progress == null ? "animate-pulse" : ""}`}
                />
                {jobData.progressMessage && (
                  <p className="truncate text-[11px] opacity-70">{jobData.progressMessage}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Per-card missing items with individual action buttons */}
        <div className="space-y-2">{allMissing.map(renderMissingRow)}</div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Upcoming Broadcast Cards (next 3 days)
// ---------------------------------------------------------------------------

const HOST_NAME_MAP: Record<string, string> = {
  xiaoqing: "小青",
  xiaohe: "禾姊",
  ayuan: "阿元",
};

const CLASSIC_NAME_MAP: Record<string, string> = {
  shijing: "詩經",
  yijing: "易經",
  zhuangzi: "莊子",
};

interface UniqueCard {
  cardKey: string;
  classicId: string;
  cardId: string;
  hostId: string;
  contentType: string;
  date: string;
  assets: { cardImage: boolean; audio: boolean; videoStory: boolean; videoSquare: boolean };
}

// ---------------------------------------------------------------------------
// Card/Video Preview Dialog
// ---------------------------------------------------------------------------

interface PreviewCard {
  cardKey: string;
  classicId: string;
  cardId: string;
  hostId: string;
  contentType: string;
  hasVideo: boolean;
  hasCardImage: boolean;
}

function CardPreviewDialog({
  card,
  open,
  onOpenChange,
}: {
  card: PreviewCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<"card" | "story" | "square">("card");

  useEffect(() => {
    if (card && open) {
      // Default to card if available, otherwise first available video
      if (card.hasCardImage) setTab("card");
      else if (card.hasVideo) setTab("story");
    }
  }, [card, open]);

  if (!card) return null;

  const hostName = HOST_NAME_MAP[card.hostId] ?? card.hostId;
  const classicName = CLASSIC_NAME_MAP[card.classicId] ?? card.classicId;

  const tabs: { value: "card" | "story" | "square"; label: string; available: boolean }[] = [
    { value: "card", label: "圖卡", available: card.hasCardImage },
    { value: "story", label: "Story 影片", available: card.hasVideo },
    { value: "square", label: "Square 影片", available: card.hasVideo },
  ];

  const availableTabs = tabs.filter((t) => t.available);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[600px] max-h-[90vh] w-[95vw] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base">
            {hostName} · {classicName} {card.cardId}
          </DialogTitle>
          <DialogDescription className="text-xs">
            推播格式：{card.contentType === "card" ? "圖卡" : card.contentType === "video" ? "影片" : "圖卡＋影片"}
          </DialogDescription>
        </DialogHeader>

        {availableTabs.length > 1 && (
          <div className="px-4">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="h-8">
                {availableTabs.map((t) => (
                  <TabsTrigger key={t.value} value={t.value} className="h-7 px-3 text-xs">
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="px-4 pb-4">
          {tab === "card" && (
            <img
              src={`/api/v2/assets/card/${card.classicId}/${card.cardId}`}
              alt={`${classicName} ${card.cardId}`}
              className="w-full rounded-lg"
            />
          )}
          {tab === "story" && (
            // biome-ignore lint/a11y/useMediaCaption: internal dashboard tool
            <video
              key="story"
              controls
              className="mx-auto max-h-[70vh] w-full rounded-lg"
              src={`/api/v2/assets/video/${card.classicId}/${card.cardId}/story`}
            />
          )}
          {tab === "square" && (
            // biome-ignore lint/a11y/useMediaCaption: internal dashboard tool
            <video
              key="square"
              controls
              className="w-full rounded-lg"
              src={`/api/v2/assets/video/${card.classicId}/${card.cardId}/square`}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Upcoming Broadcast Cards (next 3 days)
// ---------------------------------------------------------------------------

function UpcomingBroadcastCards() {
  const { data: prepData, isLoading } = usePrepCheck(3);
  const [previewCard, setPreviewCard] = useState<PreviewCard | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">近三天準備推播圖卡</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prepData || prepData.byDate.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">近三天準備推播圖卡</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-muted-foreground text-sm">近三天無排程</p>
        </CardContent>
      </Card>
    );
  }

  // Deduplicate cards across all dates — merge contentType to highest need
  const seen = new Map<string, UniqueCard>();
  for (const dayGroup of prepData.byDate) {
    for (const entry of dayGroup.entries) {
      if (!entry.cardKey) continue;
      if (!seen.has(entry.cardKey)) {
        const [classicId, cardId] = entry.cardKey.split(":");
        seen.set(entry.cardKey, {
          cardKey: entry.cardKey,
          classicId,
          cardId,
          hostId: entry.hostId,
          contentType: entry.contentType,
          date: dayGroup.date,
          assets: { ...entry.assets },
        });
      } else {
        // Merge: upgrade contentType if any entry needs video
        const existing = seen.get(entry.cardKey)!;
        if (entry.contentType === "card+video") {
          existing.contentType = "card+video";
        } else if (entry.contentType === "video" && existing.contentType === "card") {
          existing.contentType = "card+video";
        } else if (entry.contentType === "card" && existing.contentType === "video") {
          existing.contentType = "card+video";
        }
      }
    }
  }
  const uniqueCards = Array.from(seen.values()).sort(
    (a, b) => a.date.localeCompare(b.date) || a.cardKey.localeCompare(b.cardKey),
  );
  // Three-level status per card:
  // "done"    — all final outputs exist (card image + video MP4 if needed)
  // "pending" — raw assets ready (card + audio) but video not yet rendered
  // "missing" — missing raw assets (no card image or no audio)
  function getCardStatus(c: UniqueCard): "done" | "pending" | "missing" {
    const needsVideo = c.contentType === "video" || c.contentType === "card+video";
    if (!needsVideo) {
      return c.assets.cardImage ? "done" : "missing";
    }
    // Needs video: check final MP4 exists
    if (c.assets.cardImage && c.assets.audio && c.assets.videoSquare) return "done";
    // Has raw assets but video not rendered yet
    if (c.assets.cardImage && c.assets.audio) return "pending";
    return "missing";
  }

  const doneCount = uniqueCards.filter((c) => getCardStatus(c) === "done").length;
  const pendingCount = uniqueCards.filter((c) => getCardStatus(c) === "pending").length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">近三天準備推播圖卡</CardTitle>
          {doneCount === uniqueCards.length ? (
            <Badge className="gap-1 border-0 bg-emerald-100 text-[10px] text-emerald-700">
              <CircleCheck className="h-3 w-3" /> 全部完成
            </Badge>
          ) : (
            <>
              <Badge className="gap-1 border-0 bg-emerald-100 text-[10px] text-emerald-700">
                <CircleCheck className="h-3 w-3" /> {doneCount} 完成
              </Badge>
              {pendingCount > 0 && (
                <Badge className="gap-1 border-0 bg-blue-100 text-[10px] text-blue-700">
                  <Clock className="h-3 w-3" /> {pendingCount} 待輸出
                </Badge>
              )}
              {uniqueCards.length - doneCount - pendingCount > 0 && (
                <Badge className="gap-1 border-0 bg-amber-100 text-[10px] text-amber-700">
                  <CircleAlert className="h-3 w-3" /> {uniqueCards.length - doneCount - pendingCount} 缺素材
                </Badge>
              )}
            </>
          )}
        </div>
        <p className="text-muted-foreground text-xs">
          {prepData.fromDate} ~ {prepData.toDate}（共 {uniqueCards.length} 張圖卡）
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {uniqueCards.map((card) => {
            const colors = HOST_COLORS[card.hostId] ?? HOST_COLORS.xiaoqing;
            const hostName = HOST_NAME_MAP[card.hostId] ?? card.hostId;
            const classicName = CLASSIC_NAME_MAP[card.classicId] ?? card.classicId;
            const hasVideo = card.contentType === "video" || card.contentType === "card+video";
            const status = getCardStatus(card);
            const borderClass =
              status === "done"
                ? ""
                : status === "pending"
                  ? "border-blue-300 dark:border-blue-600"
                  : "border-amber-300 dark:border-amber-600";

            return (
              <div key={card.cardKey} className={`group overflow-hidden rounded-lg border ${borderClass}`}>
                {/* Card image — clickable to preview */}
                <button
                  type="button"
                  className="relative w-full cursor-pointer text-left"
                  onClick={() => {
                    if (status === "done" || card.assets.cardImage) {
                      setPreviewCard({
                        cardKey: card.cardKey,
                        classicId: card.classicId,
                        cardId: card.cardId,
                        hostId: card.hostId,
                        contentType: card.contentType,
                        hasVideo: hasVideo && card.assets.videoSquare,
                        hasCardImage: card.assets.cardImage,
                      });
                    }
                  }}
                >
                  <img
                    src={`/api/v2/assets/card/${card.classicId}/${card.cardId}`}
                    alt={`${classicName} ${card.cardId}`}
                    className="aspect-square w-full object-cover transition group-hover:brightness-90"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      el.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="flex hidden aspect-square w-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground text-xs">圖片未備</span>
                  </div>
                  {/* Date badge */}
                  <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                    {card.date.slice(5)}
                  </span>
                  {/* Status icon */}
                  <span className="absolute right-1 bottom-1">
                    {status === "done" && <CircleCheck className="h-5 w-5 text-emerald-500 drop-shadow" />}
                    {status === "pending" && <Clock className="h-5 w-5 animate-pulse text-blue-500 drop-shadow" />}
                    {status === "missing" && (
                      <CircleAlert className="h-5 w-5 animate-pulse text-amber-500 drop-shadow" />
                    )}
                  </span>
                  {/* Video indicator */}
                  {hasVideo && card.assets.videoSquare && (
                    <span className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white">
                      <Play className="h-3 w-3" />
                    </span>
                  )}
                </button>

                {/* Info + audio */}
                <div className="space-y-1.5 p-2">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className={`${colors.bg} ${colors.text} shrink-0 border-0 text-[10px]`}>
                      {hostName}
                    </Badge>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {classicName} {card.cardId}
                    </span>
                  </div>

                  {/* Broadcast format + readiness */}
                  <div className="space-y-0.5 text-[10px]">
                    <div className="text-muted-foreground">
                      推播：
                      {card.contentType === "card" ? "圖卡" : card.contentType === "video" ? "影片" : "圖卡＋影片"}
                    </div>
                    <div>
                      {status === "done" && <span className="text-emerald-600">推播準備就緒</span>}
                      {status === "pending" && <span className="text-blue-600">素材齊，待輸出影片</span>}
                      {status === "missing" && (
                        <span className="text-destructive">
                          {[
                            !card.assets.cardImage && "缺圖卡",
                            hasVideo && !card.assets.audio && "缺音檔",
                            hasVideo && card.assets.audio && !card.assets.videoSquare && "缺影片",
                          ]
                            .filter(Boolean)
                            .join("、")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <CardPreviewDialog
          card={previewCard}
          open={!!previewCard}
          onOpenChange={(open) => {
            if (!open) setPreviewCard(null);
          }}
        />
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Month View
// ---------------------------------------------------------------------------

function MonthView({
  year,
  month,
  onDayClick,
  onDayEdit,
  scheduleEntries,
}: {
  year: number;
  month: number;
  onDayClick: (day: CalendarDay) => void;
  onDayEdit: (dateStr: string, dow: number, entries: ScheduleEntry[]) => void;
  scheduleEntries: ScheduleEntry[];
}) {
  const { data: scheduleData, isLoading } = useMonthSchedule(year, month);
  const calendarDays = useMemo(() => buildCalendarDays(year, month, scheduleData), [year, month, scheduleData]);

  // Index entries by date
  const entriesByDate = useMemo(() => {
    const map: Record<string, ScheduleEntry[]> = {};
    for (const e of scheduleEntries) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, [scheduleEntries]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="p-0">
        <div className="mb-1 grid grid-cols-7">
          {WEEKDAY_HEADERS.map((d) => (
            <div key={d} className="py-2 text-center font-medium text-muted-foreground text-xs">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-l">
          {calendarDays.map((day) => {
            const _colors = HOST_COLORS[day.hostId] ?? HOST_COLORS.xiaoqing;
            const dayEntries = entriesByDate[day.dateStr] ?? [];
            const hasEntries = dayEntries.length > 0;
            const _hasCard = !!day.card;

            return (
              <button
                type="button"
                key={day.dateStr}
                onClick={() => {
                  if (day.isCurrentMonth) {
                    onDayEdit(day.dateStr, day.date.getDay(), dayEntries);
                  }
                }}
                className={[
                  "relative min-h-[100px] border-r border-b p-1.5 text-left transition sm:min-h-[130px]",
                  day.isCurrentMonth ? "cursor-pointer hover:bg-muted/50" : "cursor-default opacity-40",
                  day.isToday ? "bg-primary/5 ring-2 ring-primary/20 ring-inset" : "",
                ].join(" ")}
              >
                {/* Date number + TW/US annotation */}
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span
                      className={`font-medium text-xs ${day.isToday ? "font-bold text-primary" : "text-muted-foreground"}`}
                    >
                      {day.date.getDate()}
                    </span>
                    {day.isCurrentMonth &&
                      hasEntries &&
                      (() => {
                        const usDate = new Date(day.date);
                        usDate.setDate(usDate.getDate() - 1);
                        return (
                          <span className="text-[8px] text-muted-foreground/60">
                            US {usDate.getMonth() + 1}/{usDate.getDate()}
                          </span>
                        );
                      })()}
                  </div>
                </div>

                {/* Schedule entries — compact grouped by host */}
                {hasEntries && day.isCurrentMonth ? (
                  <div className="space-y-0.5">
                    {(() => {
                      // Group by hostId to show compact summary
                      const byHost: Record<string, ScheduleEntry[]> = {};
                      for (const e of dayEntries) {
                        if (!byHost[e.hostId]) byHost[e.hostId] = [];
                        byHost[e.hostId].push(e);
                      }
                      return Object.entries(byHost).map(([hId, entries]) => {
                        const hostColor = HOST_COLORS[hId] ?? HOST_COLORS.xiaoqing;
                        const hostInfo = HOST_OPTIONS_MINI[hId];
                        const channels = [...new Set(entries.map((e) => e.channel))];
                        const times = [...new Set(entries.map((e) => e.time))].sort();
                        const hasVideoEntry = entries.some(
                          (e) => e.contentType === "video" || e.contentType === "card+video",
                        );
                        const hasCardEntry = entries.some(
                          (e) => e.contentType === "card" || e.contentType === "card+video",
                        );
                        return (
                          <div key={hId} className="flex flex-wrap items-center gap-1">
                            <span className={`font-medium text-[9px] leading-none ${hostColor.text}`}>
                              {hostInfo?.name ?? hId}
                            </span>
                            <div className="flex gap-0.5">
                              {channels.map((ch) => (
                                <span
                                  key={ch}
                                  className={`inline-block h-1.5 w-1.5 rounded-full ${CHANNEL_COLORS[ch]?.dot ?? "bg-gray-400"}`}
                                  title={ch}
                                />
                              ))}
                            </div>
                            <span className="text-[8px] text-muted-foreground">
                              {hasCardEntry && "圖"}
                              {hasCardEntry && hasVideoEntry && "+"}
                              {hasVideoEntry && "影"}
                            </span>
                            <span className="text-[8px] text-muted-foreground">×{times.length}</span>
                          </div>
                        );
                      });
                    })()}
                    <div className="mt-0.5 text-[8px] text-muted-foreground">{dayEntries.length} 筆排程</div>
                  </div>
                ) : day.isCurrentMonth &&
                  !hasEntries &&
                  (() => {
                    // Future dates without entries: show "須規劃排程" if > 7 days from today
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const diffDays = Math.floor((day.date.getTime() - today.getTime()) / 86400000);
                    return diffDays >= 7;
                  })() ? (
                  <div className="flex h-full flex-col items-center justify-center pt-2">
                    <Calendar className="mb-1 h-3.5 w-3.5 text-muted-foreground/40" />
                    <span className="text-[9px] text-muted-foreground/50">須規劃排程</span>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
        <CalendarLegend />
      </div>
    </div>
  );
}

const HOST_OPTIONS_MINI: Record<string, { name: string }> = {
  xiaoqing: { name: "小青" },
  xiaohe: { name: "禾姊" },
  ayuan: { name: "阿元" },
};

// ---------------------------------------------------------------------------
// Week View
// ---------------------------------------------------------------------------

function WeekView({ sunday, onDayClick }: { sunday: Date; onDayClick: (plan: DayPlan) => void }) {
  const fromStr = formatDateStr(sunday);
  const { data: plans, isLoading } = useWeeklyPlan(fromStr);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">本週尚無排程資料</p>
        </CardContent>
      </Card>
    );
  }

  // Reorder: Sunday first
  const tStr = todayStr();
  const ordered = [0, 1, 2, 3, 4, 5, 6]
    .map((dow) => plans.find((p) => p.dayOfWeek === dow))
    .filter(Boolean) as DayPlan[];

  // Asset summary
  let totalAssets = 0;
  let readyAssets = 0;
  for (const p of ordered) {
    const vals = [p.assets.cardImage, p.assets.audio, p.assets.videoStory, p.assets.videoSquare, p.assets.bgm];
    totalAssets += vals.length;
    readyAssets += vals.filter(Boolean).length;
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardContent className="flex items-center gap-2 py-3">
          <span className="font-medium text-sm">本週素材完成度：</span>
          <Badge variant={readyAssets === totalAssets ? "default" : "secondary"}>
            {readyAssets}/{totalAssets}
          </Badge>
        </CardContent>
      </Card>

      {/* 7-column grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        {ordered.map((plan) => {
          const colors = HOST_COLORS[plan.hostId] ?? HOST_COLORS.xiaoqing;
          const isToday = plan.date === tStr;
          return (
            <Card
              key={plan.date}
              className={`cursor-pointer transition hover:shadow-md ${isToday ? "ring-2 ring-primary/30" : ""}`}
              onClick={() => onDayClick(plan)}
            >
              <CardHeader className="pb-2">
                <div>
                  <CardTitle className="font-medium text-sm">
                    {WEEKDAY_FULL[plan.dayOfWeek]} {shortDate(plan.date)}
                  </CardTitle>
                  <span className="text-[9px] text-muted-foreground/60">
                    US {(() => {
                      const d = new Date(plan.date);
                      d.setDate(d.getDate() - 1);
                      return shortDate(formatDateStr(d));
                    })()}
                  </span>
                </div>
                <Badge variant="outline" className={`w-fit ${colors.bg} ${colors.text} border-0 text-xs`}>
                  {plan.hostName}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="line-clamp-2 text-xs leading-relaxed">「{plan.card.originalText}」</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {plan.card.seriesName} / {plan.card.cardId}
                  </p>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-1">
                  {plan.channels.map((ch) => {
                    const cc = CHANNEL_COLORS[ch];
                    return (
                      <Badge
                        key={ch}
                        variant="outline"
                        className={`border-0 text-[10px] ${cc?.bg ?? ""} ${cc?.text ?? ""}`}
                      >
                        {ch}
                      </Badge>
                    );
                  })}
                </div>
                <Separator />
                <div className="space-y-0.5">
                  {(
                    [
                      ["cardImage", "圖卡"],
                      ["audio", "語音"],
                      ["videoStory", "Story"],
                      ["videoSquare", "Square"],
                      ["bgm", "BGM"],
                    ] as const
                  ).map(([k, label]) => (
                    <div key={k} className="flex items-center gap-1 text-[11px]">
                      {plan.assets[k] ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={plan.assets[k] ? "text-muted-foreground" : "text-red-600"}>{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Day View — editable timeline with scheduled entries + preparation phases
// ---------------------------------------------------------------------------

/** Static preparation phases (non-editable info) */
const PREP_SLOTS = [
  { time: "05:30", label: "資料收集", desc: "天氣 / 期貨 / 農曆資料蒐集" },
  { time: "06:00", label: "腳本生成", desc: "AI 生成當日播報腳本" },
  { time: "06:15", label: "圖卡渲染", desc: "智慧圖卡 + 播報圖卡生成" },
  { time: "06:30", label: "影片合成", desc: "TTS 語音 + 圖卡影片合成" },
];

function DayView({
  date,
  onCardClick,
  onEditDay,
  dayEntries,
}: {
  date: Date;
  onCardClick: (plan: DayPlan) => void;
  onEditDay: (dateStr: string, dow: number, entries: ScheduleEntry[]) => void;
  dayEntries: ScheduleEntry[];
}) {
  const dateStr = formatDateStr(date);
  const dow = date.getDay();

  const sortedEntries = [...dayEntries].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  const hasEntries = sortedEntries.length > 0;

  // Get unique hosts for this day from entries
  const dayHosts = useMemo(() => {
    if (!hasEntries) {
      const h = getHostForDay(dow);
      return [{ hostId: h.hostId, hostName: h.hostName }];
    }
    const seen = new Set<string>();
    const hosts: { hostId: string; hostName: string }[] = [];
    for (const e of sortedEntries) {
      if (!seen.has(e.hostId)) {
        seen.add(e.hostId);
        hosts.push({ hostId: e.hostId, hostName: HOST_OPTIONS_MINI[e.hostId]?.name ?? e.hostId });
      }
    }
    return hosts;
  }, [hasEntries, sortedEntries, dow]);

  // Get unique cards for image previews — dedupe by cardKey
  const uniqueCards = useMemo(() => {
    const seen = new Set<string>();
    const cards: { cardKey: string; classicId: string; cardId: string; hostId: string; contentType: string }[] = [];
    for (const e of sortedEntries) {
      if (!seen.has(e.cardKey)) {
        seen.add(e.cardKey);
        const [classicId, cardId] = e.cardKey.split(":");
        cards.push({ cardKey: e.cardKey, classicId, cardId, hostId: e.hostId, contentType: e.contentType });
      }
    }
    return cards;
  }, [sortedEntries]);

  // Group entries by time slot for compact timeline display
  type TimeSlotGroup = { time: string; entries: ScheduleEntry[] };
  const timeGroups = useMemo(() => {
    const map = new Map<string, ScheduleEntry[]>();
    for (const e of sortedEntries) {
      if (!map.has(e.time)) map.set(e.time, []);
      map.get(e.time)?.push(e);
    }
    return [...map.entries()].map(([time, entries]) => ({ time, entries })) as TimeSlotGroup[];
  }, [sortedEntries]);

  return (
    <div className="space-y-4">
      {/* Day header */}
      <Card>
        <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {dayHosts.map((h) => {
                const c = HOST_COLORS[h.hostId] ?? HOST_COLORS.xiaoqing;
                return (
                  <Badge key={h.hostId} variant="outline" className={`${c.bg} ${c.text} border-0 px-3 py-1 text-sm`}>
                    {h.hostName}
                  </Badge>
                );
              })}
            </div>
            <div>
              <p className="font-medium">
                {WEEKDAY_FULL[dow]} · {dateStr}{" "}
                <span className="font-normal text-muted-foreground text-xs">(台灣播報日)</span>
              </p>
              <p className="text-muted-foreground text-sm">
                {(() => {
                  const usDate = new Date(date);
                  usDate.setDate(usDate.getDate() - 1);
                  const usStr = formatDateStr(usDate);
                  return `US ${usStr} · `;
                })()}
                {hasEntries ? `${sortedEntries.length} 筆排程 · ${timeGroups.length} 時段` : "尚無排程"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEditDay(dateStr, dow, dayEntries)}>
            <Clock className="mr-1 h-3.5 w-3.5" /> 編輯排程
          </Button>
        </CardContent>
      </Card>

      {/* Two-column: card previews + timeline */}
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        {/* Card previews — show all unique cards for the day */}
        <div className="space-y-3">
          {uniqueCards.length > 0 ? (
            uniqueCards.map((card) => {
              const hostColors = HOST_COLORS[card.hostId] ?? HOST_COLORS.xiaoqing;
              return (
                <Card key={card.cardKey}>
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${hostColors.bg} ${hostColors.text} border-0 text-[10px]`}>
                        {HOST_OPTIONS_MINI[card.hostId]?.name ?? card.hostId}
                      </Badge>
                      <span className="font-medium text-xs">{card.cardId}</span>
                      <Badge variant="secondary" className="text-[9px]">
                        {card.contentType === "card" ? "圖卡" : card.contentType === "video" ? "影片" : "圖+影"}
                      </Badge>
                    </div>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src={`/api/v2/assets/card/${card.classicId}/${card.cardId}`}
                        alt={`${card.classicId} ${card.cardId}`}
                        className="w-full"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = "none";
                          el.parentElement!.innerHTML =
                            '<div class="flex items-center justify-center h-32 text-xs text-muted-foreground">圖片載入中...</div>';
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                尚無排程圖卡
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline — grouped by time slot */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" /> 時段排程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {/* Prep phases */}
              {PREP_SLOTS.map((slot, _i) => (
                <div key={`prep-${slot.time}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 shrink-0 rounded-full border-2 border-primary bg-primary/20" />
                    <div className="min-h-[40px] w-px flex-1 bg-border" />
                  </div>
                  <div className="pb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-11 font-medium font-mono text-muted-foreground text-xs">{slot.time}</span>
                      <span className="font-medium text-sm">{slot.label}</span>
                    </div>
                    <p className="mt-0.5 ml-[52px] text-muted-foreground text-xs">{slot.desc}</p>
                  </div>
                </div>
              ))}

              {/* Broadcast time groups */}
              {timeGroups.map((group, gi) => {
                const firstEntry = group.entries[0];
                const hostColors = HOST_COLORS[firstEntry.hostId] ?? HOST_COLORS.xiaoqing;
                const hostName = HOST_OPTIONS_MINI[firstEntry.hostId]?.name ?? firstEntry.hostId;
                const cardId = firstEntry.cardKey.split(":")[1] ?? "";
                const isLast = gi === timeGroups.length - 1;

                return (
                  <div key={`group-${group.time}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 shrink-0 rounded-full ${hostColors.dot}`} />
                      {!isLast && <div className="min-h-[40px] w-px flex-1 bg-border" />}
                    </div>
                    <div className={`flex-1 pb-5 ${isLast ? "pb-0" : ""}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-11 font-medium font-mono text-muted-foreground text-xs">{group.time}</span>
                        <Badge variant="outline" className={`border-0 text-[10px] ${hostColors.bg} ${hostColors.text}`}>
                          {hostName}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{cardId}</span>
                        <Badge variant="secondary" className="text-[9px]">
                          {firstEntry.contentType === "card"
                            ? "圖卡"
                            : firstEntry.contentType === "video"
                              ? "影片"
                              : "圖+影"}
                        </Badge>
                      </div>
                      {/* Channels for this time slot */}
                      <div className="mt-1 ml-[52px] flex items-center gap-1.5">
                        {group.entries.map((entry) => {
                          const chColor = CHANNEL_COLORS[entry.channel];
                          return (
                            <Badge
                              key={entry.id}
                              variant="outline"
                              className={`border-0 text-[9px] ${chColor?.bg ?? ""} ${chColor?.text ?? ""}`}
                            >
                              {entry.channel}
                            </Badge>
                          );
                        })}
                        <Badge
                          variant={firstEntry.status === "scheduled" ? "outline" : "secondary"}
                          className="text-[9px]"
                        >
                          {firstEntry.status === "published"
                            ? "已發佈"
                            : firstEntry.status === "scheduled"
                              ? "已排程"
                              : "草稿"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!hasEntries && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 shrink-0 rounded-full bg-gray-300" />
                  </div>
                  <div className="pb-0">
                    <p className="text-muted-foreground text-sm italic">尚無排程，點擊「編輯排程」新增</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calendar Legend
// ---------------------------------------------------------------------------

function CalendarLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground">
      <span className="font-medium">主播：</span>
      {Object.entries(HOST_COLORS).map(([id, c]) => (
        <span key={id} className="flex items-center gap-1">
          <span className={`inline-block h-2 w-2 rounded-full ${c.dot}`} />
          {id === "xiaoqing" ? "小青 (詩經)" : id === "xiaohe" ? "禾姊 (易經)" : "阿元 (莊子)"}
        </span>
      ))}
      <span className="ml-4 font-medium">頻道：</span>
      {Object.entries(CHANNEL_COLORS).map(([ch, color]) => (
        <span key={ch} className="flex items-center gap-1">
          <span className={`inline-block h-2 w-2 rounded-full ${color.dot}`} />
          {ch}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BroadcastPlanPage() {
  const now = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState(now);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewProps, setPreviewProps] = useState<Omit<PreviewDialogProps, "open" | "onOpenChange">>({});

  // Schedule editor state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [editDow, setEditDow] = useState(0);
  const [editEntries, setEditEntries] = useState<ScheduleEntry[]>([]);

  // Derived navigation values
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const sunday = getSunday(selectedDate);

  // Fetch schedule entries for the visible month
  const monthFrom = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const monthLastDay = new Date(year, month + 1, 0).getDate();
  const monthTo = `${year}-${String(month + 1).padStart(2, "0")}-${String(monthLastDay).padStart(2, "0")}`;
  const { data: monthEntries, refetch: refetchEntries } = useScheduleEntries({ from: monthFrom, to: monthTo });

  // Navigation helpers
  function shift(offset: number) {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "month") d.setMonth(d.getMonth() + offset);
      else if (viewMode === "week") d.setDate(d.getDate() + offset * 7);
      else d.setDate(d.getDate() + offset);
      return d;
    });
  }

  function goToday() {
    setSelectedDate(new Date());
  }

  // Label for current range
  const navLabel = useMemo(() => {
    if (viewMode === "month") {
      return new Date(year, month).toLocaleDateString("zh-TW", { year: "numeric", month: "long" });
    }
    if (viewMode === "week") {
      const sat = new Date(sunday);
      sat.setDate(sat.getDate() + 6);
      return `${shortDate(formatDateStr(sunday))} – ${shortDate(formatDateStr(sat))}`;
    }
    return `${formatDateStr(selectedDate)} ${WEEKDAY_FULL[selectedDate.getDay()]}`;
  }, [viewMode, year, month, sunday, selectedDate]);

  // Open preview
  function openMonthDayPreview(day: CalendarDay) {
    if (!day.card) return;
    setPreviewProps({
      hostId: day.hostId,
      hostName: day.hostName,
      classicId: day.classicId,
      card: day.card,
      dateStr: day.dateStr,
      channels: day.channels,
    });
    setDialogOpen(true);
  }

  function openWeekDayPreview(plan: DayPlan) {
    setPreviewProps({
      hostId: plan.hostId,
      hostName: plan.hostName,
      classicId: plan.classicId,
      classicName: plan.classicName,
      card: plan.card,
      dateStr: plan.date,
      channels: plan.channels,
      assets: plan.assets,
    });
    setDialogOpen(true);
  }

  // Open schedule editor
  function openDayEditor(dateStr: string, dow: number, entries: ScheduleEntry[]) {
    setEditDate(dateStr);
    setEditDow(dow);
    setEditEntries(entries);
    setEditDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="font-bold text-2xl tracking-tight">推播準備工作區</h1>
          <p className="text-muted-foreground text-sm">
            素材準備、排程管理與推播行事曆{" "}
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">台灣時間 UTC+8</span>
          </p>
        </div>
      </div>

      {/* Prep Check Alert */}
      <PrepCheckAlert />

      {/* Upcoming Broadcast Cards */}
      <UpcomingBroadcastCards />

      {/* Calendar Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">圖卡推播排程規劃行事曆</CardTitle>
            <div className="flex items-center gap-3">
              {/* View mode tabs */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList className="h-8">
                  <TabsTrigger value="day" className="px-3 text-xs">
                    日
                  </TabsTrigger>
                  <TabsTrigger value="week" className="px-3 text-xs">
                    週
                  </TabsTrigger>
                  <TabsTrigger value="month" className="px-3 text-xs">
                    月
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Navigation */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={goToday}>
                  今天
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shift(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[100px] text-center font-medium text-sm">{navLabel}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shift(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Views */}
          {viewMode === "month" && (
            <MonthView
              year={year}
              month={month}
              onDayClick={openMonthDayPreview}
              onDayEdit={openDayEditor}
              scheduleEntries={monthEntries ?? []}
            />
          )}
          {viewMode === "week" && <WeekView sunday={sunday} onDayClick={openWeekDayPreview} />}
          {viewMode === "day" && (
            <DayView
              date={selectedDate}
              onCardClick={openWeekDayPreview}
              onEditDay={openDayEditor}
              dayEntries={(monthEntries ?? []).filter((e) => e.date === formatDateStr(selectedDate))}
            />
          )}
        </CardContent>
      </Card>

      <PreviewDialog {...previewProps} open={dialogOpen} onOpenChange={setDialogOpen} />

      <DayScheduleDialog
        date={editDate}
        dayOfWeek={editDow}
        existingEntries={editEntries}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSaved={() => refetchEntries()}
      />
    </div>
  );
}
