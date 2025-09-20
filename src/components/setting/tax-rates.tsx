import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Accordion } from "../ui/accordion";
import NoDataFound from "../common/no-data-found";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import InputGroup from "../common/input-group";
import SettingAPI from "@/services/api/setting";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  igst: z.coerce
    .number("Invalid IGST rate")
    .int("Invalid IGST rate")
    .min(1, "IGST rate is required")
    .max(100, "IGST rate cannot be greater than 100"),
  sgst: z.coerce
    .number("Invalid SGST rate")
    .int("Invalid SGST rate")
    .min(1, "SGST rate is required")
    .max(100, "SGST rate cannot be greater than 100"),
  cgst: z.coerce
    .number("Invalid CGST rate")
    .int("Invalid CGST rate")
    .min(1, "CGST rate is required")
    .max(100, "CGST rate cannot be greater than 100"),
});

function TaxRates({ className }: React.ComponentProps<"div">) {
  const { data, refetch } = useQuery({
    queryKey: ["tax-rates"],
    queryFn: () => SettingAPI.getTax(),
    refetchOnWindowFocus: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      igst: "",
      sgst: "",
      cgst: "",
    },
  });

  useEffect(() => {
    if (data?.data?.data) {
      form.reset({
        igst: data?.data?.data?.igst.toString() || "",
        sgst: data?.data?.data?.sgst.toString() || "",
        cgst: data?.data?.data?.cgst.toString() || "",
      });
    }
  }, [data]);

  const onSubmit = async (data: any) => {
    try {
      const responce = await SettingAPI.updateTax(data);
      toast.success(
        responce?.data?.message || "Tax rates updated successfully"
      );
      refetch();
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message || "Operation failed. Please try again.";
      toast.error(message);
    }
  };
  const { isDirty, isSubmitting } = form.formState;
  return (
    <Card className={className}>
      <CardHeader className="sticky top-0 bg-card border-b border-muted z-30 !pb-2 ">
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Tax Rates</CardTitle>

          {/* <Plus
            className="text-theme-red cursor-pointer"
            // onClick={}
          /> */}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-2 border-b md:space-y-2  md:px-6">
              <FormField
                name={"igst"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IGST Rate</FormLabel>
                    <FormControl>
                      <InputGroup
                        {...field}
                        type="number"
                        step={".5"}
                        placeholder="Enter IGST Rate"
                        suffix={"%"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-2 border-b md:space-y-2  md:px-6">
              <FormField
                name={"sgst"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SGST Rate</FormLabel>

                    <FormControl>
                      <InputGroup
                        {...field}
                        type="number"
                        step={".5"}
                        placeholder="Enter SGST Rate"
                        suffix={"%"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-2 border-b md:space-y-2  md:px-6">
              <FormField
                name={"cgst"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGST Rate</FormLabel>
                    <FormControl>
                      <InputGroup
                        {...field}
                        type="number"
                        step={".5"}
                        placeholder="Enter CGST Rate"
                        suffix={"%"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
                <Button type="submit">
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default TaxRates;
