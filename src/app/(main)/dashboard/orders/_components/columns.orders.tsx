import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";

import type { orderSchema } from "./schema";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Shipped: "default",
  Processing: "secondary",
  Pending: "outline",
  Delivered: "default",
  Cancelled: "destructive",
};

const paymentVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Paid: "default",
  Partial: "secondary",
  Unpaid: "destructive",
};

export const ordersColumns: ColumnDef<z.infer<typeof orderSchema>>[] = [
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
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.customer}</span>
        <p className="text-muted-foreground text-xs">{row.original.contactPerson}</p>
      </div>
    ),
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
    accessorKey: "totalAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{formatCurrency(row.original.totalAmount)}</span>,
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
    accessorKey: "paymentStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment" />,
    cell: ({ row }) => (
      <Badge variant={paymentVariant[row.original.paymentStatus] ?? "secondary"}>{row.original.paymentStatus}</Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order Date" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.orderDate}</span>,
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
