import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export type MenuItem = {
  name: string;
  category: string;
  price: string;
  status: string;
};

export type MenuTableActions = {
  sorting?: import("@tanstack/react-table").SortingState;
  onSortingChange?: (
    sorting: import("@tanstack/react-table").SortingState,
  ) => void;
};

export function createMenuColumns(
  _actions: MenuTableActions,
): ColumnDef<MenuItem>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              status === "Available"
                ? "bg-[#e8f5e2] text-[#2d6a32]"
                : "bg-[#fce8e4] text-[#8a2be2]"
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];
}
