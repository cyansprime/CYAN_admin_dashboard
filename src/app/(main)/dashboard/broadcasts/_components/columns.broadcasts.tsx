import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { broadcastSchema } from "./schema";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Sent: "default",
  Scheduled: "secondary",
  Draft: "outline",
  Failed: "destructive",
};

export const broadcastsColumns: ColumnDef<z.infer<typeof broadcastSchema>>[] = [
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
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.title}</span>
        <p className="text-muted-foreground text-xs">{row.original.type}</p>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "audience",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Audience" />,
    cell: ({ row }) => (
      <div>
        <span className="text-sm">{row.original.audience}</span>
        <p className="text-muted-foreground text-xs tabular-nums">{row.original.audienceSize.toLocaleString()}</p>
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
    accessorKey: "scheduledAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Scheduled" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums text-sm">{row.original.scheduledAt}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "openRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Open %" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.openRate}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "clickRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Click %" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.clickRate}</span>,
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
