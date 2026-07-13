import { DashboardStats } from "@/app/components/dashboard/overview/dashboard-stats";
import { InventoryAlerts } from "@/app/components/dashboard/overview/inventory-alerts";
import { RecentOrders } from "@/app/components/dashboard/overview/recent-orders";
import { TopSellingItems } from "@/app/components/dashboard/overview/top-selling-items";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-4xl font-bold text-[#3d2413]">Overview</h1>

        <p className="mt-2 text-[#7b5f46]">
          Monitor today&apos;s sales, inventory, and operational insights across
          your coffee shop.
        </p>
      </section>

      <DashboardStats />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders />

        <TopSellingItems />
      </div>

      <InventoryAlerts />
    </div>
  );
}
