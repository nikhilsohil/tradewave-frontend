import React, { useState } from "react";
import { format, parse, isValid, isBefore, isAfter } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(value);
  const [inputValue, setInputValue] = useState(
    value ? format(value, "dd/MM/yyyy") : ""
  );

  const finalValue = value !== undefined ? value : internalValue;
  const handleChange = (date: Date | undefined) => {
    if (onChange) {
      onChange(date);
    } else {
      setInternalValue(date);
    }
    setInputValue(date ? format(date, "dd/MM/yyyy") : "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const parsedDate = parse(val, "dd/MM/yyyy", new Date());
    if (isValid(parsedDate)) {
      if (
        (minDate && isBefore(parsedDate, minDate)) ||
        (maxDate && isAfter(parsedDate, maxDate))
      ) {
        handleChange(undefined); // outside range
      } else {
        handleChange(parsedDate);
      }
    } else {
      handleChange(undefined); // invalid date
    }
  };

  const clearDate = () => {
    handleChange(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            value={inputValue}
            placeholder="dd/mm/yyyy"
            onChange={handleInputChange}
          />
          {finalValue && (
            <button
              type="button"
              onClick={clearDate}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Calendar
          mode="single"
          selected={finalValue}
          onSelect={handleChange}
          //   disabled={(date) =>
          //     (minDate && isBefore(date, minDate)) ||
          //     (maxDate && isAfter(date, maxDate))||undefined
          //   }
        />
      </PopoverContent>
    </Popover>
  );
}
