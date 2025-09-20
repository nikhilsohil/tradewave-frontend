import AppHeader from "@/components/common/app-header";
import { CustomLink, TopNav } from "@/components/common/top-nav";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/group")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AppHeader
        topNav={
          <TopNav>
            {/* The Group page is now part of the Settings page. */}
          </TopNav>
        }
      />
      <section className="flex-grow p-4">
        <Outlet />
      </section>
    </>
  );
}
