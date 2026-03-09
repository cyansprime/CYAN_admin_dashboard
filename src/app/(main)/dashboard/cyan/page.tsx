import { BreedingPipeline } from "./_components/breeding-pipeline";
import { InventoryAlerts } from "./_components/inventory-alerts";
import { MarketDistribution } from "./_components/market-distribution";
import { OverviewCards } from "./_components/overview-cards";
import { RecentOrders } from "./_components/recent-orders";
import { SalesTrend } from "./_components/sales-trend";
import { VarietyRanking } from "./_components/variety-ranking";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <OverviewCards />
      <SalesTrend />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <VarietyRanking />
        </div>
        <div className="xl:col-span-2">
          <MarketDistribution />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <BreedingPipeline />
        </div>
        <div className="xl:col-span-2">
          <InventoryAlerts />
        </div>
      </div>
      <RecentOrders />
    </div>
  );
}
