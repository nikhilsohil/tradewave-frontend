import { SummaryCards } from "@/components/summary-card";
import { createFileRoute } from "@tanstack/react-router";
import { SalesChart } from "../../../components/admin/sales-chart";
import { RecentOrdersTable } from "../../../components/admin/recent-order-table";

export const Route = createFileRoute("/_protected/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="px-6 py-6 space-y-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-pretty">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of your key business metrics
          </p>
        </div>
      </header>

      <section>
        <SummaryCards />
      </section>

      <section>
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
      </section>
      <section>
        <RecentOrdersTable />
      </section>
    </main>
  );
}
