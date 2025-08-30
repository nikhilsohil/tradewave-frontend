import { cn } from "@/lib/utils"
import type React from "react"
import { FileX } from "lucide-react"

interface NoDataFoundProps extends React.ComponentProps<"div"> {
  message?: string
  title?: string
  icon?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

function NoDataFound({
  className,
  message = "There are no data to show right now.",
  title = "No data found!",
  icon,
  size = "md",
  ...props
}: NoDataFoundProps) {
  const sizeClasses = {
    sm: {
      container: "gap-2",
      iconWrapper: "w-12 h-12",
      icon: "w-6 h-6",
      title: "text-sm",
      message: "text-xs",
    },
    md: {
      container: "gap-3",
      iconWrapper: "w-16 h-16",
      icon: "w-8 h-8",
      title: "text-base",
      message: "text-sm",
    },
    lg: {
      container: "gap-4",
      iconWrapper: "w-20 h-20",
      icon: "w-10 h-10",
      title: "text-lg",
      message: "text-base",
    },
  }

  const currentSize = sizeClasses[size]

  const defaultIcon = <FileX className={cn("text-muted-foreground", currentSize.icon)} />

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center text-center py-8",
        currentSize.container,
        className,
      )}
      {...props}
    >
      <div className={cn("flex items-center justify-center rounded-full bg-muted/50", currentSize.iconWrapper)}>
        {icon || defaultIcon}
      </div>

      <div className="space-y-1">
        <h6 className={cn("font-medium text-foreground", currentSize.title)}>{title}</h6>
        <p className={cn("text-muted-foreground", currentSize.message)}>{message}</p>
      </div>
    </div>
  )
}

export default NoDataFound
