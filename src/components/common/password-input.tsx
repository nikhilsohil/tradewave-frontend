import React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

type InputGroupProps = {} & React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput: React.FC<InputGroupProps> = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`peer pe-12 ${className || ""}`}
      />

      <span
        className="absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm cursor-pointer peer-disabled:opacity-50"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </span>
    </div>
  );
};

export default PasswordInput;
