"use client";

import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpcomingAlmanac } from "@/hooks/use-almanac";

const ANCHOR_COLOR: Record<string, string> = {
  xiao_qing: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  xiao_he: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  a_yuan: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
};

function formatDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${parseInt(m)}/${parseInt(d)}`;
}

export function SolarTermsCard() {
  const { data, isLoading } = useUpcomingAlmanac(14);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="size-4" />
          兩週播報計畫
        </CardTitle>
        <CardDescription>主播排程 × 節氣 × 每日諺語 — 每日播報內容自動帶入</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="text-muted-foreground text-sm">載入中…</div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {data.map((day) => (
              <div
                key={day.date}
                className={`rounded-lg border p-3 flex flex-col gap-2 text-sm transition-colors
                  ${
                    day.is_today
                      ? "border-primary ring-1 ring-primary bg-primary/5"
                      : day.solar_term
                        ? "border-primary/30 bg-muted/40"
                        : "bg-muted/20"
                  }`}
              >
                {/* 日期列 */}
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${day.is_today ? "text-primary" : ""}`}>{formatDate(day.date)}</span>
                  <span className="text-xs text-muted-foreground">週{day.weekday}</span>
                </div>

                {/* 主播 */}
                <span className={`text-xs font-medium rounded px-1.5 py-0.5 w-fit ${ANCHOR_COLOR[day.anchor_id]}`}>
                  {day.anchor}
                </span>

                {/* 節氣 */}
                {day.solar_term ? (
                  <Badge variant="outline" className="w-fit text-xs gap-1">
                    {day.solar_term.icon} {day.solar_term.name}
                  </Badge>
                ) : (
                  <div className="h-5" />
                )}

                {/* 節氣說明 */}
                {day.solar_term && <p className="text-xs text-muted-foreground leading-snug">{day.solar_term.desc}</p>}

                {/* 諺語 */}
                <blockquote className="text-xs text-foreground/75 border-l-2 border-primary/30 pl-2 leading-snug mt-auto">
                  {day.proverb.text}
                  <span className="block text-muted-foreground/60 mt-0.5">—— {day.proverb.source}</span>
                </blockquote>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
