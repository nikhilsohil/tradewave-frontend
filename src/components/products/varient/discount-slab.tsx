import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function DiscountSlab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Good Will Discount Slab</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={control}
              name={`ProductDiscountByGroup.${index}.retailerGroupId`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Min</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`ProductDiscountByGroup.${index}.retailerGroupId`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Max</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`ProductDiscountByGroup.${index}.discount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => append({ retailerGroupId: 0, discount: 0 })}
        >
          Add Group Discount
        </Button>
      </CardContent>
    </Card>
  );
}

export default DiscountSlab;
