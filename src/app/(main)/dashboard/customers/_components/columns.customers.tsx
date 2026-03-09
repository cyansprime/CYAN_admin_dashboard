import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";

import type { customerSchema } from "./schema";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Active: "default",
  Inactive: "secondary",
  Prospect: "outline",
};

const tierColors: Record<string, string> = {
  Platinum: "bg-violet-500/10 text-violet-600",
  Gold: "bg-amber-500/10 text-amber-600",
  Silver: "bg-slate-400/10 text-slate-500",
  Bronze: "bg-orange-600/10 text-orange-600",
};

export const customersColumns: ColumnDef<z.infer<typeof customerSchema>>[] = [
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
    accessorKey: "company",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.company}</span>
        <p className="text-muted-foreground text-xs">{row.original.contactPerson}</p>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "country",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
    cell: ({ row }) => (
      <div>
        <span>{row.original.country}</span>
        <p className="text-muted-foreground text-xs">{row.original.region}</p>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "tier",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tier" />,
    cell: ({ row }) => {
      const tier = row.original.tier;
      if (tier === "—") return <span className="text-muted-foreground">—</span>;
      return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${tierColors[tier] ?? ""}`}>{tier}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "totalOrders",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Orders" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.totalOrders}</span>,
  },
  {
    accessorKey: "totalVolume",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Volume" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.totalVolume}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Revenue" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{formatCurrency(row.original.totalRevenue)}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: "lastOrder",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Order" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.lastOrder}</span>,
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
