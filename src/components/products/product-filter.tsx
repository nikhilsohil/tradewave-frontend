import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
    SelectGroup,
} from "@/components/ui/select";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { useCategory } from "@/hooks/common";



function ProductFilter() {
    const [open, setOpen] = useState(false);


    const handleApply = () => {
        setOpen(false);
    };

    const handleClear = () => {
        setOpen(false);
    };

    const { categories } = useCategory()


    return (
        <div className="flex gap-2 items-center">
            <Popover
                open={open}
                onOpenChange={setOpen}
            >
                <PopoverTrigger asChild>
                    <Button variant="outline">Filters</Button>
                </PopoverTrigger>

                <PopoverContent className="w-[350px] grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm" htmlFor="min">
                            Price from
                        </label>
                        <Input type="number" placeholder="Price to" />
                    </div>
                    <div>
                        <label className="text-sm" htmlFor="max">
                            Price to
                        </label>
                        <Input type="number" placeholder="Price to" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm" htmlFor="category">
                            Category
                        </label>
                        <Select  >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectGroup>
                                    {
                                        categories.map((category) => (

                                            <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm" htmlFor="received">
                            Cards Received
                        </label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="10">Recived ID</SelectItem>
                                <SelectItem value="11">Not Recive ID</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="flex gap-2 justify-end col-span-2">
                        <Button variant="outline" size="sm" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button size="sm" onClick={handleApply}>
                            Apply
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default ProductFilter;
