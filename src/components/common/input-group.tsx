import React from "react";
import { Input } from "@/components/ui/input";

type InputGroupProps = {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputGroup: React.FC<InputGroupProps> = ({
  prefix,
  suffix,
  className,
  ...props
}) => {
  return (
    <div className="relative">
      <Input
        {...props}
        className={`peer ${prefix ? "ps-6" : ""} ${suffix ? "pe-12" : ""} ${className || ""}`}
      />
      {prefix && (
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
          {prefix}
        </span>
      )}
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
          {suffix}
        </span>
      )}
    </div>
  );
};

export default InputGroup;
