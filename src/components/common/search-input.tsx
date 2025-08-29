import * as React from "react";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
interface SearchInputProps extends React.ComponentProps<"input"> {
    onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, onClear, ...props }, ref) => {
        const disabled = props.value === "" || props.value === undefined || props.disabled;


        return (
            <div className="relative ">
                <Input
                    id="input-26"
                    className={cn("peer px-9", className)}
                    ref={ref}
                    placeholder={props.placeholder || "Search"}
                    {...props}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Search size={16} strokeWidth={2} />
                </div>
                <button
                    className={cn(
                        "absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-0",
                        disabled && "hidden"
                    )}
                    type="button"
                    aria-label="Clear search"
                    onClick={onClear}
                >
                    <X size={16} strokeWidth={2} aria-hidden="true" />
                </button>
            </div>
        );
    }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
