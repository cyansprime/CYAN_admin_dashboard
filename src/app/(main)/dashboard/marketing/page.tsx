import { ChannelPerformance } from "./_components/channel-performance";
import { ContentTypeChart } from "./_components/content-type-chart";
import { EngagementTrend } from "./_components/engagement-trend";
import { OverviewCards } from "./_components/overview-cards";
import { TopPosts } from "./_components/top-posts";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <OverviewCards />
      <EngagementTrend />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ChannelPerformance />
        </div>
        <div className="xl:col-span-2">
          <ContentTypeChart />
        </div>
      </div>
      <TopPosts />
    </div>
  );
}
