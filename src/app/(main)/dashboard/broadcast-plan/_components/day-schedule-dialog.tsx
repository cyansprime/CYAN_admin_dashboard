"use client";

import { useEffect, useState } from "react";

import { Check, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getHostForDay } from "@/hooks/use-broadcast-plan";
import {
  ALL_CHANNELS,
  type ChannelId,
  type ContentType,
  type EntryStatus,
  type ScheduleEntry,
  useSaveDaySchedule,
} from "@/hooks/use-schedule-entries";
import { useWisdomCards } from "@/hooks/use-wisdom-cards";

const HOST_OPTIONS = [
  { id: "xiaoqing", name: "小青", classic: "shijing", classicName: "詩經" },
  { id: "xiaohe", name: "禾姊", classic: "yijing", classicName: "易經" },
  { id: "ayuan", name: "阿元", classic: "zhuangzi", classicName: "莊子" },
];

const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: "card", label: "圖卡" },
  { value: "video", label: "影片" },
  { value: "card+video", label: "圖+影" },
];

const CHANNEL_COLORS: Record<string, string> = {
  LINE: "bg-green-500/10 text-green-700",
  Instagram: "bg-pink-500/10 text-pink-700",
  Facebook: "bg-blue-500/10 text-blue-700",
  YouTube: "bg-red-500/10 text-red-700",
};

interface EntryRow {
  uid: string; // unique row ID for React key
  channel: ChannelId;
  time: string;
  hostId: string;
  cardKey: string;
  contentType: ContentType;
  status: EntryStatus;
}

let _uid = 0;
function nextUid() {
  return `row-${++_uid}-${Date.now()}`;
}

interface DayScheduleDialogProps {
  date: string | null;
  dayOfWeek: number;
  existingEntries: ScheduleEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export function DayScheduleDialog({
  date,
  dayOfWeek,
  existingEntries,
  open,
  onOpenChange,
  onSaved,
}: DayScheduleDialogProps) {
  const [rows, setRows] = useState<EntryRow[]>([]);
  const saveMutation = useSaveDaySchedule();
  const { data: cardsData } = useWisdomCards();

  useEffect(() => {
    if (!date || !open) return;

    if (existingEntries.length > 0) {
      // Load all existing entries as rows
      const newRows: EntryRow[] = existingEntries
        .map((e) => ({
          uid: nextUid(),
          channel: e.channel,
          time: e.time,
          hostId: e.hostId,
          cardKey: e.cardKey,
          contentType: e.contentType,
          status: e.status,
        }))
        .sort((a, b) => a.time.localeCompare(b.time));
      setRows(newRows);
    } else {
      setRows([]);
    }
  }, [date, open, existingEntries]);

  function updateRow(uid: string, updates: Partial<EntryRow>) {
    setRows((prev) => {
      const updated = prev.map((r) => (r.uid === uid ? { ...r, ...updates } : r));
      if (updates.time !== undefined) {
        updated.sort((a, b) => a.time.localeCompare(b.time));
      }
      return updated;
    });
  }

  function removeRow(uid: string) {
    setRows((prev) => prev.filter((r) => r.uid !== uid));
  }

  function addRow() {
    const defaultHost = getHostForDay(dayOfWeek);
    setRows((prev) =>
      [
        ...prev,
        {
          uid: nextUid(),
          channel: "Facebook" as ChannelId,
          time: "08:00",
          hostId: defaultHost.hostId,
          cardKey: "",
          contentType: "card" as ContentType,
          status: "scheduled" as EntryStatus,
        },
      ].sort((a, b) => a.time.localeCompare(b.time)),
    );
  }

  async function handleSave() {
    if (!date) return;
    const validRows = rows.filter((r) => r.cardKey);
    await saveMutation.mutateAsync({
      date,
      entries: validRows.map((r) => ({
        channel: r.channel,
        time: r.time,
        hostId: r.hostId,
        cardKey: r.cardKey,
        contentType: r.contentType,
        status: r.status,
      })),
    });
    onOpenChange(false);
    onSaved?.();
  }

  const cardsByClassic =
    cardsData?.cards?.reduce(
      (acc: Record<string, Record<string, unknown>[]>, card: Record<string, unknown>) => {
        const key = card.classicId as string;
        if (!acc[key]) acc[key] = [];
        acc[key].push(card);
        return acc;
      },
      {} as Record<string, Record<string, unknown>[]>,
    ) ?? {};

  if (!date) return null;

  const weekdayNames = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1200px] max-h-[90vh] w-[95vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            排程編輯 — {date} {weekdayNames[dayOfWeek]}{" "}
            <span className="font-normal text-muted-foreground text-sm">(台灣播報日)</span>
          </DialogTitle>
          <DialogDescription>
            {(() => {
              if (!date) return "";
              const d = new Date(date);
              d.setDate(d.getDate() - 1);
              const usStr = d.toISOString().slice(0, 10);
              return `US ${usStr} · `;
            })()}
            設定每個時段的推播頻道、角色、圖卡與內容格式（支援多時段）
          </DialogDescription>
        </DialogHeader>

        {/* Column labels */}
        <div className="grid grid-cols-[130px_110px_1fr_1fr_90px_36px] gap-3 px-3 font-medium text-muted-foreground text-xs">
          <span>時段</span>
          <span>頻道</span>
          <span>角色</span>
          <span>圖卡</span>
          <span>格式</span>
          <span />
        </div>

        <div className="space-y-2">
          {rows.length === 0 && (
            <div className="py-6 text-center text-muted-foreground text-sm">尚無排程，點擊下方「新增時段」開始編輯</div>
          )}

          {rows.map((row) => {
            const selectedHost = HOST_OPTIONS.find((h) => h.id === row.hostId);
            const availableCards = selectedHost ? (cardsByClassic[selectedHost.classic] ?? []) : [];

            return (
              <div key={row.uid} className="rounded-lg border p-3 transition">
                <div className="grid grid-cols-[130px_110px_1fr_1fr_90px_36px] items-center gap-3">
                  {/* Time input */}
                  <Input
                    type="time"
                    value={row.time}
                    onChange={(e) => updateRow(row.uid, { time: e.target.value })}
                    className="h-9 px-2 font-mono text-sm"
                  />

                  {/* Channel select */}
                  <Select value={row.channel} onValueChange={(v) => updateRow(row.uid, { channel: v as ChannelId })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_CHANNELS.map((ch) => (
                        <SelectItem key={ch} value={ch}>
                          <span className={CHANNEL_COLORS[ch] ?? ""}>{ch}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Host */}
                  <Select value={row.hostId} onValueChange={(v) => updateRow(row.uid, { hostId: v, cardKey: "" })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOST_OPTIONS.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.name} ({h.classicName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Card */}
                  <Select value={row.cardKey} onValueChange={(v) => updateRow(row.uid, { cardKey: v })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="選擇圖卡" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {availableCards.map((card: Record<string, unknown>) => (
                        <SelectItem
                          key={(card.key as string) ?? `${card.classicId}:${card.cardId}`}
                          value={(card.key as string) ?? `${card.classicId}:${card.cardId}`}
                        >
                          {card.cardId as string} — {card.seriesName as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Content type */}
                  <Select
                    value={row.contentType}
                    onValueChange={(v) => updateRow(row.uid, { contentType: v as ContentType })}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRow(row.uid)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add row button */}
        <Button variant="outline" size="sm" onClick={addRow} className="w-full gap-1">
          <Plus className="h-3.5 w-3.5" /> 新增時段
        </Button>

        <Separator />

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending} className="gap-1">
            {saveMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
