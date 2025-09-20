import Profile from "@/components/setting/profile";
import RetailerGroup from "@/components/setting/retailer-group";
import TaxRates from "@/components/setting/tax-rates";
import { createFileRoute } from "@tanstack/react-router";
import GroupComponent from "../group";

export const Route = createFileRoute("/_protected/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-1 px-2 sm:px-4">
      <Profile className=" sm:col-span-32 md:col-span-32 lg:col-span-16 2xl:col-span-8 overflow-y-auto" />
      {/* <TaxRates className="col-span-1 sm:col-span-32 md:col-span-32 lg:col-span-16 2xl:col-span-8 overflow-y-auto" /> */}

      {/* <RetailerGroup className="col-span-1 sm:col-span-32 md:col-span-32 lg:col-span-16 2xl:col-span-8 overflow-y-auto" /> */}
      <div className="col-span-1 sm:col-span-32 md:col-span-32 lg:col-span-16 2xl:col-span-8 overflow-y-auto">
        <GroupComponent />
      </div>
    </div>
  );
}
