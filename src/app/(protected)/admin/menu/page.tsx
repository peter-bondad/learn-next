"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee, CupSoda, Plus, Star } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCard } from "@/components/dashboard/status-card";
import { MenuTable } from "@/components/menu/menu-table";

const menuItems = [
  {
    name: "Hazelnut Velvet Latte",
    category: "Coffee",
    price: "$5.50",
    status: "Available",
  },
  {
    name: "Caramel Macchiato",
    category: "Coffee",
    price: "$5.20",
    status: "Available",
  },
  {
    name: "Matcha Latte",
    category: "Tea",
    price: "$4.80",
    status: "Unavailable",
  },
  {
    name: "Blueberry Cheesecake",
    category: "Dessert",
    price: "$4.50",
    status: "Available",
  },
];

export default function MenuPage() {
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <div className="flex h-full flex-col">
      {/* Hero */}

      <div className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-6 text-[#fff9f2] shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#f5d5ae]">
              BrewFlow
            </p>

            <h1 className="mt-2 text-3xl font-bold">Menu Management</h1>

            <p className="mt-1 max-w-2xl text-sm text-[#f6e7d4]">
              Manage menu items, categories, pricing, and availability across
              your coffee shop.
            </p>
          </div>

          <Button className="cursor-pointer bg-[#fff8ef] text-[#5b3318] hover:bg-[#f4eadf]">
            <Plus className="mr-2 h-4 w-4" />
            New Menu Item
          </Button>
        </div>
      </div>

      {/* Stats */}

      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatusCard
          title="Total Items"
          value="42"
          description="All menu entries"
          icon={CupSoda}
        />

        <StatusCard
          title="Best Seller"
          value="Hazelnut Latte"
          description="Top performing item"
          icon={Star}
        />

        <StatusCard
          title="Available Items"
          value="38"
          description="Currently in stock"
          icon={Coffee}
        />
      </section>

      {/* Table */}

      <div className="mt-6 flex flex-1 min-h-0 flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3d2413]">
              <Coffee className="h-5 w-5 text-[#8d5a2b]" />
              Menu Items
            </h2>

            <p className="mt-1 text-sm text-[#7b5f46]">
              Browse and manage your coffee shop menu.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Input placeholder="Search menu..." className="pl-9" />
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <MenuTable
            data={menuItems}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>
      </div>
    </div>
  );
}

