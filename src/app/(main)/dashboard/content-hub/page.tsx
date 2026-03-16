"use client";
"use no memo";

import { BookOpen, Download, Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodayCards } from "@/hooks/use-content-schedule";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useWisdomStats } from "@/hooks/use-wisdom-cards";

import { contentColumns } from "./_components/columns.content";
import { contentData } from "./_components/content-hub.config";
import { OilPriceCard } from "./_components/oil-price-card";
import { SolarTermsCard } from "./_components/solar-terms-card";

const classicColors: Record<string, string> = {
  shijing: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  yijing: "bg-amber-500/10 text-amber-700 border-amber-200",
  zhuangzi: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
};

const classicNames: Record<string, string> = {
  shijing: "詩經",
  yijing: "易經",
  zhuangzi: "莊子",
};

export default function Page() {
  const table = useDataTableInstance({
    data: contentData,
    columns: contentColumns,
    getRowId: (row) => row.id,
  });

  const { data: stats, isLoading: statsLoading } = useWisdomStats();
  const { data: todayCards, isLoading: todayLoading } = useTodayCards();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SolarTermsCard />
      <OilPriceCard />

      {/* Wisdom Cards Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5" />
            智慧圖卡系統
          </CardTitle>
          <CardDescription>
            {statsLoading
              ? "載入中..."
              : stats
                ? `${stats.totalCards} 張卡片 · ${stats.totalSeries} 系列 · 詩經 ${stats.byClassic.shijing} / 易經 ${stats.byClassic.yijing} / 莊子 ${stats.byClassic.zhuangzi}`
                : "Content Hub 未連線"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : todayCards ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {(["xiaoqing", "xiaohe", "ayuan"] as const).map((host) => {
                const card = todayCards[host];
                if (!card) return null;
                return (
                  <div key={host} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-sm">{card.hostName}</span>
                      <Badge variant="outline" className={classicColors[card.classicId]}>
                        {classicNames[card.classicId]}
                      </Badge>
                    </div>
                    <p className="mb-1 text-muted-foreground text-xs">
                      {card.seriesName} · {card.cardId}
                    </p>
                    <p className="mb-2 font-medium text-sm leading-relaxed">「{card.originalText}」</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{card.scenario}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {card.keywords?.map((kw: string) => (
                        <span key={kw} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground text-sm">
              無法連線 Content Hub API — 請確認服務已啟動在 port 8081
            </p>
          )}
        </CardContent>
      </Card>

      {/* Existing content table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Hub</CardTitle>
          <CardDescription>Manage videos, images, and copy across all channels.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm">
                <Download />
                <span className="hidden lg:inline">Export</span>
              </Button>
              <Button size="sm">
                <Plus />
                <span className="hidden lg:inline">New Content</span>
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={contentColumns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
