import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

import type { campaignSchema } from "./schema";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Active: "default",
  Completed: "secondary",
  Scheduled: "outline",
  Draft: "outline",
  Paused: "destructive",
};

const channelColor: Record<string, string> = {
  LINE: "bg-green-500/10 text-green-600",
  Facebook: "bg-blue-500/10 text-blue-600",
  Instagram: "bg-pink-500/10 text-pink-600",
};

export const campaignsColumns: ColumnDef<z.infer<typeof campaignSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Campaign" />,
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.name}</span>
        <p className="text-muted-foreground text-xs">{row.original.type}</p>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "channels",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Channels" />,
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.channels.map((ch) => (
          <span key={ch} className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${channelColor[ch] ?? ""}`}>
            {ch}
          </span>
        ))}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: "budget",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Budget" />,
    cell: ({ row }) => {
      const pct = row.original.budget > 0 ? Math.round((row.original.spent / row.original.budget) * 100) : 0;
      return (
        <div className="space-y-1">
          <span className="text-xs tabular-nums">
            {formatCurrency(row.original.spent)} / {formatCurrency(row.original.budget)}
          </span>
          <Progress value={pct} className="h-1" />
        </div>
      );
    },
  },
  {
    accessorKey: "reach",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reach" />,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.reach > 0 ? row.original.reach.toLocaleString() : "—"}</span>
    ),
  },
  {
    accessorKey: "leads",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Leads" />,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.leads > 0 ? row.original.leads.toLocaleString() : "—"}</span>
    ),
  },
  {
    accessorKey: "conversion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Conv %" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.conversion}</span>,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" className="flex size-8 text-muted-foreground" size="icon">
        <EllipsisVertical />
        <span className="sr-only">Open menu</span>
      </Button>
    ),
    enableSorting: false,
  },
];
