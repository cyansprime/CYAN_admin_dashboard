"use client";

import { AlertTriangle, CircleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { inventoryAlerts } from "./cyan.config";

export function InventoryAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Alerts</CardTitle>
        <CardDescription>Varieties below restock threshold</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {inventoryAlerts.map((item) => {
            const pct = Math.round((item.stock / item.threshold) * 100);
            const isCritical = item.status === "critical";

            return (
              <div key={item.variety} className="flex items-center gap-3">
                {isCritical ? (
                  <CircleAlert className="size-4 shrink-0 text-destructive" />
                ) : (
                  <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.variety}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {item.stock}/{item.threshold} {item.unit}
                      </span>
                      <Badge variant={isCritical ? "destructive" : "secondary"} className="text-[10px]">
                        {isCritical ? "Critical" : "Low"}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
