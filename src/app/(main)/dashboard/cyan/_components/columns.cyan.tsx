import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { recentOrderSchema } from "./schema";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Shipped: "default",
  Processing: "secondary",
  Pending: "outline",
  Delivered: "secondary",
};

export const recentOrdersColumns: ColumnDef<z.infer<typeof recentOrderSchema>>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.id}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => <span>{row.original.customer}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "variety",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Variety" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.variety}</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Qty" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.quantity}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "destination",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Destination" />,
    cell: ({ row }) => <span>{row.original.destination}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.date}</span>,
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
