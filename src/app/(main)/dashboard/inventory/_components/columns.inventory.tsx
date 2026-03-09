import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { inventorySchema } from "./schema";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Available: "default",
  Reserved: "secondary",
  "Low Stock": "destructive",
  "QC Pending": "outline",
};

export const inventoryColumns: ColumnDef<z.infer<typeof inventorySchema>>[] = [
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
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Batch" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "variety",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Variety" />,
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.variety}</span>
        <p className="text-muted-foreground text-xs">{row.original.varietyName}</p>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Qty (tons)" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.quantity.toFixed(1)}</span>,
  },
  {
    accessorKey: "warehouse",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Warehouse" />,
    cell: ({ row }) => <span className="text-sm">{row.original.warehouse}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "germination",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Germ %" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.germination}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "purity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Purity" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.purity}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: "batchDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Batch Date" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.batchDate}</span>,
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
