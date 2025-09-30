import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";

type DatePickerProps = {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  formatString?: string; // default: "MMMM dd, yyyy"
};

export default function DatePicker({
  value = null,
  onChange,
  placeholder = "Select a date",
  formatString = "dd/mm/yyyy",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(value);
  const [month, setMonth] = useState<Date | null>(value);
  const [inputValue, setInputValue] = useState<string>(
    value ? format(value, formatString) : ""
  );

  useEffect(() => {
    if (value) {
      setDate(value);
      setMonth(value);
      setInputValue(format(value, formatString));
    }
  }, [value, formatString]);

  const tryParseDate = (input: string): Date | null => {
    try {
      const parsed = parse(input, formatString, new Date());
      return isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  };

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={inputValue}
        placeholder={placeholder}
        className="bg-background pr-10"
        onChange={(e) => {
          const input = e.target.value;
          setInputValue(input);

          const parsed = tryParseDate(input);
          if (parsed) {
            setDate(parsed);
            setMonth(parsed);
            onChange?.(parsed);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        onBlur={() => {
          const parsed = tryParseDate(inputValue);
          if (!parsed) {
            setInputValue(""); // clear input
            setDate(null);
            setMonth(null);
            onChange?.(null);
          }
        }}
        // onFocus={() => setOpen(true)} // 👈 open calendar on focus
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date ?? undefined}
            captionLayout="dropdown"
            month={month ?? undefined}
            onMonthChange={setMonth}
            onSelect={(d) => {
              setDate(d ?? null);
              setInputValue(d ? format(d, formatString) : "");
              onChange?.(d ?? null);
              setOpen(false);
            }}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
