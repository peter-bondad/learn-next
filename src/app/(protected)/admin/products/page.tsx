"use client";

import { useMemo, useState } from "react";
import { Coffee, CupSoda, Star } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";

import { StatusCard } from "@/components/dashboard/status-card";
import { MenuTable } from "@/components/menu/menu-table";
import { ProductToolbar } from "@/components/products/product-toolbar";
import { useProducts } from "@/lib/api/product/product.query";
import type { ProductListItem } from "@/server/shared/product/product.interface";
import { ProductFormDialog } from "./components/product-form-dialog";
import { ArchiveConfirmDialog } from "./components/archive-confirm-dialog";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  status: string;
};

function formatPrice(cents: number): string {
  return `₱${(cents / 100).toFixed(2)}`;
}

function mapProductToMenuItem(product: ProductListItem): MenuItem {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: formatPrice(product.primaryVariant?.price ?? 0),
    status: product.isAvailable ? "Available" : "Unavailable",
  };
}

export default function MenuPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [archivingProduct, setArchivingProduct] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, error } = useProducts({
    limit: 100,
    offset: 0,
    includeInactive: true,
    search: search || undefined,
  });

  const menuItems = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapProductToMenuItem);
  }, [data]);

  const total = data?.stats?.total ?? menuItems.length;
  const available = useMemo(
    () => menuItems.filter((item) => item.status === "Available").length,
    [menuItems],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Hero */}
      <div className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-6 text-[#fff9f2] shadow-lg">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="max-w-2xl text-sm text-[#f6e7d4]">
            Manage menu items, categories, pricing, and availability across
            your coffee shop.
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-3">
        <StatusCard
          title="Total Items"
          value={String(total)}
          description="All menu entries"
          icon={CupSoda}
        />

        <StatusCard
          title="Best Seller"
          value={total > 0 ? menuItems[0].name : "—"}
          description="Top performing item"
          icon={Star}
        />

        <StatusCard
          title="Available Items"
          value={String(available)}
          description="Currently in stock"
          icon={Coffee}
        />
      </section>

      {/* Toolbar + Table */}
      <div className="mt-6 flex flex-1 min-h-0 flex-col gap-4">
        <ProductToolbar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
          }}
          onAddProduct={() => {
            // TODO: open create product dialog if added later
          }}
        />

        <div className="flex-1 min-h-0">
          <MenuTable
            data={menuItems}
            loading={isLoading}
            error={error ? { message: error.message } : undefined}
            sorting={sorting}
            onSortingChange={setSorting}
            onEdit={(item) => setEditingProductId(item.id)}
            onArchive={(item) => setArchivingProduct({ id: item.id, name: item.name })}
          />
        </div>
      </div>

      <ProductFormDialog
        open={!!editingProductId}
        onOpenChange={(open) => {
          if (!open) setEditingProductId(null);
        }}
        productId={editingProductId}
      />

      <ArchiveConfirmDialog
        open={!!archivingProduct}
        onOpenChange={(open) => {
          if (!open) setArchivingProduct(null);
        }}
        productId={archivingProduct?.id ?? ""}
        productName={archivingProduct?.name ?? ""}
      />
    </div>
  );
}
