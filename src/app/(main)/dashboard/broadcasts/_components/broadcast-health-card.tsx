"use client";

import { AlertTriangle, CheckCircle2, Clock, Flame, Radio, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type HealthStatus, useBroadcastHealth } from "@/hooks/use-broadcast-health";

const STATUS_CONFIG: Record<
  HealthStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  ok: { label: "正常播出", icon: CheckCircle2, color: "text-green-500", badgeVariant: "default" },
  fallback: { label: "使用備用稿", icon: AlertTriangle, color: "text-yellow-500", badgeVariant: "secondary" },
  failed: { label: "推播失敗", icon: XCircle, color: "text-red-500", badgeVariant: "destructive" },
  missing: { label: "尚未播出", icon: Clock, color: "text-gray-400", badgeVariant: "outline" },
};

const SOURCE_LABEL: Record<string, string> = {
  real: "✅ 真實",
  mock: "⚠️ 備用",
  pending: "⏳",
};

export function BroadcastHealthCard() {
  const { data, isLoading } = useBroadcastHealth();

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="size-4" />
            今日播報狀態
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">載入中…</div>
        </CardContent>
      </Card>
    );
  }

  const status = data.today_status;
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  // 取最新一筆 Daily Report 的 data_sources
  const mainRecord = data.today_records[0];
  const sources = mainRecord?.data_sources ?? {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="size-4" />
          今日播報狀態
        </CardTitle>
        <CardDescription>
          {data.last_broadcast_at ? `上次成功：${data.last_broadcast_at}` : "尚無成功紀錄"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* 主狀態 */}
        <div className="flex items-center gap-3">
          <Icon className={`size-8 ${cfg.color}`} />
          <div>
            <div className="font-semibold text-base">{cfg.label}</div>
            <Badge variant={cfg.badgeVariant} className="mt-1">
              {status.toUpperCase()}
            </Badge>
          </div>
          {data.streak > 0 && (
            <div className="ml-auto flex items-center gap-1 text-orange-500">
              <Flame className="size-4" />
              <span className="font-bold text-lg">{data.streak}</span>
              <span className="text-xs text-muted-foreground">天連勝</span>
            </div>
          )}
        </div>

        {/* 資料來源明細 */}
        {Object.keys(sources).length > 0 && (
          <div className="rounded-md border p-3 text-sm space-y-1">
            <div className="font-medium text-muted-foreground mb-2">資料來源</div>
            {Object.entries(sources).map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}</span>
                <span>{SOURCE_LABEL[val] ?? val}</span>
              </div>
            ))}
          </div>
        )}

        {/* 今日所有播報記錄 */}
        {data.today_records.length > 0 && (
          <div className="space-y-1">
            {data.today_records.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{r.type}</span>
                <div className="flex items-center gap-2">
                  {r.used_fallback === 1 && <span className="text-yellow-500 text-xs">備用稿</span>}
                  <Badge
                    variant={r.status === "Sent" ? "default" : r.status === "Failed" ? "destructive" : "outline"}
                    className="text-xs"
                  >
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
