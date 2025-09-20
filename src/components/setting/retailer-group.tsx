import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Accordion } from "../ui/accordion";
import NoDataFound from "../common/no-data-found";

function RetailerGroup({ className }: React.ComponentProps<"div">) {
  const group: any = [];
  return (
    <Card className={className}>
      <CardHeader className="sticky top-0 bg-card border-b border-muted z-30 !pb-2 ">
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Retailer Groups</CardTitle>

          <Plus
            className="text-theme-red cursor-pointer"
            // onClick={}
          />
        </div>
      </CardHeader>
      <CardContent>
        {group.length > 0 ? (
          group.map((group: any) => {
            return (
              <Accordion
                type="single"
                defaultValue={"cancelRideReasons"}
                collapsible
                className="w-full h-[25rem] overflow-y-scroll"
              ></Accordion>
            );
          })
        ) : (
          <NoDataFound />
        )}
      </CardContent>
    </Card>
  );
}

export default RetailerGroup;
