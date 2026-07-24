import { useMemo } from "react";

import { DataTable } from "@/components/data-table/data-table";
import type { MenuItem } from "./menu-columns";
import { createMenuColumns, type MenuTableActions } from "./menu-columns";

type MenuTableProps = {
  data: MenuItem[];
  loading?: boolean;
  error?: { message: string };
  maxHeight?: string;
} & MenuTableActions;

export function MenuTable({
  data,
  loading = false,
  error,
  maxHeight = "100%",
  ...actions
}: MenuTableProps) {
  const columns = useMemo(() => createMenuColumns(actions), [actions]);

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      sorting={actions.sorting}
      onSortingChange={actions.onSortingChange}
      maxHeight={maxHeight}
    />
  );
}
