import React from "react";
import { ChevronsUpDown, Circle, FolderOpenDotIcon, Headset, LogOut, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserRound } from "lucide-react";
import { useAuth } from "@/providers/auth";

export default function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = useLocation();
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { logout } = useAuth();
    const data = {
        navMain: [
            {
                title: "MAIN",
                url: "#",
                items: [
                    {
                        title: "Dashboard",
                        url: "/dashboard",
                        // icon: Circle,
                        show: true,
                        color: "#ff0000",
                    },
                    {
                        title: "Products",
                        url: "/product",
                        icon: FolderOpenDotIcon,
                        show: true,

                    },
                    {
                        title: "Staff",
                        url: "/staff",
                        icon: UserRound,
                        show: true,
                    },
                    {
                        title: "Retailers",
                        url: "/retailer",
                        icon: FolderOpenDotIcon,
                        show: true,
                    },
                                        {
                        title: "Categories",
                        url: "/category",
                        icon: FolderOpenDotIcon,
                        show: true,
                    },


                ],
            },
        ],
    };


    return (
        <Sidebar collapsible="icon" {...props} className="flex flex-col ">
            <SidebarHeader className="border-b h-15 border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem className=" ">
                        <SidebarMenuButton
                            size="lg"
                            className="hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground "
                        >
                            <div className="bg-transparent text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <img src="/img/synergy.png" alt="logo" width={40} height={40} />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">TradeWare</span>
                                <span className="truncate text-xs">Retail management</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="flex-1 overflow-auto custom-scrollbar">
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarMenu className="gap-2 ">
                            {item.items.map((item2) => (
                                <SidebarMenuItem
                                    key={item2.title}
                                    className="ml-0 border-l-0 relative"
                                >
                                    <SidebarMenuButton
                                        tooltip={item2.title}
                                        className="2xl:text-base md:text-xs lg:text-sm h-10 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground relative data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                                        isActive={
                                            pathname?.pathname === item2.url ||
                                            pathname?.pathname.startsWith(`${item2.url}/`)
                                        }
                                    >
                                        <Link to={item2.url} className="absolute inset-0" />
                                        {/* {item2.icon && React.createElement(item2.icon)} */}
                                        {"icon" in item2 &&
                                            item2.icon &&
                                            React.createElement(item2.icon)}
                                        {"color" in item2 && (
                                            <Circle
                                                size={4}
                                                fill={item2.color}
                                                color={item2.color}
                                                strokeWidth={0}
                                            />
                                        )}
                                        {item2.title}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/*  This keeps logout pinned to bottom */}
            <SidebarFooter className="p-0 pr-2">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Settings"
                                className="text-base h-10 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground relative data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                <Link to="." className="absolute inset-0" />
                                <Settings />
                                Settings
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Support"
                                className="text-base h-10 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground relative data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                <Link to="." className="absolute inset-0" />
                                <Headset />
                                Support
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Logout"
                                className="text-base h-10 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground relative data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                                onClick={logout}
                            >
                                <Link to="." className="absolute inset-0" />
                                <LogOut />
                                Logout
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}