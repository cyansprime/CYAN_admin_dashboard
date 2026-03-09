import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { varietySchema } from "./schema";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Commercial: "default",
  "Pre-commercial": "secondary",
  "Regional Trial": "outline",
  Testcross: "outline",
  "Inbred Selection": "outline",
};

export const varietiesColumns: ColumnDef<z.infer<typeof varietySchema>>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: "maturity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Maturity" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.maturity}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "yieldPotential",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Yield" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.yieldPotential}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: "generation",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gen" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.generation}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "region",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Region" />,
    cell: ({ row }) => <span>{row.original.region}</span>,
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
