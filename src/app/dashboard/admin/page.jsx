import StatsCard from "@/components/admin/StatsCard";
import SalesTrendChart from "@/components/admin/SalesTrendChart";
import CategoryDonutChart from "@/components/admin/CategoryDonutChart";
import ManageCollections from "@/components/admin/ManageCollections";
import { ChevronDown } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <>
      {/* Overview header */}
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-semibold text-[var(--color-art-text)] sm:text-2xl">
          Overview
        </h2>
        <button className="flex w-fit items-center gap-1.5 rounded-full border border-[var(--color-art-border)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--color-art-secondary)] hover:bg-[var(--color-art-background)]">
          Last 30 days
          <ChevronDown size={16} />
        </button>
      </div>

      <StatsCard />

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5 sm:mt-8">
        <div className="lg:col-span-3">
          <SalesTrendChart />
        </div>
        <div className="lg:col-span-2">
          <CategoryDonutChart />
        </div>
      </div>

      <ManageCollections />
    </>
  );
}