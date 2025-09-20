"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactElement } from "react";
// import GenerateQRDailog from "./generate-qr-dailog";

interface AppHeaderProps {
  topNav: ReactElement; // Expecting a JSX element like <TopNav>...</TopNav>
  className?: string;
}

const AppHeader = ({ className, topNav }: AppHeaderProps) => {
  return (
    // <header className="flex sticky top-0 z-50 shrink-0 items-center justify-between gap-2 border-b px-4 bg-card text-card-foreground">
    <header
      className={cn(
        `flex sticky top-0 z-50 shrink-0 items-center justify-between gap-2 border-b pb-1 px-4 bg-card text-card-foreground`,
        className
      )}
    >
      <div className="flex items-center gap-2 ">
        <SidebarTrigger className="-ml-1" />
        {topNav}
      </div>
      <div className="flex gap-2 items-center">
        {/* <GlobalSearch /> */}

        <Avatar className={"h-7 w-7 aspect-square"}>
          <AvatarImage src="/hrms/temp/profile.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default AppHeader;
