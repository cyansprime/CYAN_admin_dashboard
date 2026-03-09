"use client";
"use no memo";

import { Download } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { recentOrdersColumns } from "./columns.cyan";
import { recentOrdersData } from "./cyan.config";

export function RecentOrders() {
  const table = useDataTableInstance({
    data: recentOrdersData,
    columns: recentOrdersColumns,
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Track international seed shipments and order status.</CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
            <Button variant="outline" size="sm">
              <Download />
              <span className="hidden lg:inline">Export</span>
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex size-full flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          <DataTable table={table} columns={recentOrdersColumns} />
        </div>
        <DataTablePagination table={table} />
      </CardContent>
    </Card>
  );
}
