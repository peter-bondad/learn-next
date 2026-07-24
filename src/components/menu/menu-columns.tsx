import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Archive } from "lucide-react";

export type MenuItem = {
  id: string;
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
  onEdit?: (item: MenuItem) => void;
  onArchive?: (item: MenuItem) => void;
};

export function createMenuColumns(
  actions: MenuTableActions,
): ColumnDef<MenuItem>[] {
  const { onEdit, onArchive } = actions;

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
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }
              />
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onSelect={() => onEdit(item)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem
                  onSelect={() => onArchive(item)}
                  variant="destructive"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
