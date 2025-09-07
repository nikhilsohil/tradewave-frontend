import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Accordion } from "../ui/accordion";
import NoDataFound from "../common/no-data-found";
import { Form, FormField, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import InputGroup from "../common/input-group";

function TaxRates({ className }: React.ComponentProps<"div">) {
  const form = useForm({
    defaultValues: {
      igst: "",
      sgst: "",
      cgst: "",
    },
  });

  const onSubmit = (data: any) => console.log(data);
  const { isDirty } = form.formState;
  return (
    <Card className={className}>
      <CardHeader className="sticky top-0 bg-card border-b border-muted z-30 !pb-2 ">
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Tax Rates</CardTitle>

          <Plus
            className="text-theme-red cursor-pointer"
            // onClick={}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-2 border-b md:space-y-2  md:px-6">
              <label className="text-unfocused md:text-sm ">IGST Rate</label>
              <FormField
                name={"igst"}
                control={form.control}
                render={({ field }) => (
                  <div className="col-span-2">
                    <InputGroup
                      {...field}
                      type="number"
                      step={".5"}
                      placeholder="Enter IGST Rate"
                      suffix={"%"}
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
            <div className="p-2 border-b md:space-y-2  md:px-6">
              <label className="text-unfocused md:text-sm ">SGST Rate</label>
              <FormField
                name={"sgst"}
                control={form.control}
                render={({ field }) => (
                  <div className="col-span-2">
                    <InputGroup
                      {...field}
                      type="number"
                      step={".5"}
                      placeholder="Enter SGST Rate"
                      suffix={"%"}
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
            <div className="p-2 border-b md:space-y-2  md:px-6">
              <label className="text-unfocused md:text-sm ">CGST Rate</label>
              <FormField
                name={"cgst"}
                control={form.control}
                render={({ field }) => (
                  <div className="col-span-2">
                    <InputGroup
                      {...field}
                      type="number"
                      step={".5"}
                      placeholder="Enter CGST Rate"
                      suffix={"%"}
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
            {isDirty && (
              <div className="p-2 flex float-right gap-4 py-6">
                <Button
                  type="reset"
                  onClick={() => {
                    form.reset();
                  }}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default TaxRates;
