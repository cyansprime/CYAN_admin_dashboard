import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { contentSchema } from "./schema";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Published: "default",
  Scheduled: "secondary",
  Draft: "outline",
  "In Review": "outline",
};

const channelColor: Record<string, string> = {
  LINE: "bg-green-500/10 text-green-600 border-green-200",
  Facebook: "bg-blue-500/10 text-blue-600 border-blue-200",
  Instagram: "bg-pink-500/10 text-pink-600 border-pink-200",
};

export const contentColumns: ColumnDef<z.infer<typeof contentSchema>>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.title}</span>
        <p className="text-muted-foreground text-xs">
          {row.original.type} · {row.original.format}
        </p>
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
    accessorKey: "publishDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Publish Date" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.publishDate}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "reach",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reach" />,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.reach > 0 ? row.original.reach.toLocaleString() : "—"}</span>
    ),
  },
  {
    accessorKey: "engagement",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Engagement" />,
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.engagement > 0 ? row.original.engagement.toLocaleString() : "—"}
      </span>
    ),
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
