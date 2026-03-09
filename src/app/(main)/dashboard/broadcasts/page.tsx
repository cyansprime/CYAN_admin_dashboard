"use client";
"use no memo";

import { Download, Plus } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { broadcastsData } from "./_components/broadcasts.config";
import { broadcastsColumns } from "./_components/columns.broadcasts";

export default function Page() {
  const table = useDataTableInstance({
    data: broadcastsData,
    columns: broadcastsColumns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Broadcasts</CardTitle>
          <CardDescription>Schedule and track daily push messages on LINE.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm">
                <Download />
                <span className="hidden lg:inline">Export</span>
              </Button>
              <Button size="sm">
                <Plus />
                <span className="hidden lg:inline">New Broadcast</span>
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={broadcastsColumns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
