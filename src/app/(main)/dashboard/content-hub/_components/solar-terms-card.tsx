"use client";

import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpcomingAlmanac } from "@/hooks/use-almanac";

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
          未來兩週節氣與諺語
        </CardTitle>
        <CardDescription>節氣播報素材參考，諺語依節氣自動帶入每日播報。</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="text-muted-foreground text-sm">載入中…</div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
            {data.map((day) => (
              <div
                key={day.date}
                className={`rounded-lg border p-3 text-sm flex flex-col gap-1.5
                  ${day.solar_term ? "border-primary/40 bg-primary/5" : "bg-muted/30"}`}
              >
                {/* 日期 */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-base">{formatDate(day.date)}</span>
                  <span className="text-xs text-muted-foreground">週{day.weekday}</span>
                </div>

                {/* 節氣 Badge */}
                {day.solar_term ? (
                  <Badge variant="default" className="w-fit text-xs">
                    {day.solar_term.icon} {day.solar_term.name}
                  </Badge>
                ) : (
                  <div className="h-5" /> // 佔位，保持對齊
                )}

                {/* 節氣描述 */}
                {day.solar_term && <p className="text-xs text-muted-foreground leading-snug">{day.solar_term.desc}</p>}

                {/* 諺語 */}
                <blockquote className="text-xs text-foreground/80 border-l-2 border-primary/30 pl-2 leading-snug mt-auto">
                  {day.proverb.text}
                  <span className="block text-muted-foreground mt-0.5">—— {day.proverb.source}</span>
                </blockquote>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
