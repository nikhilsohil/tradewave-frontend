import AppHeader from "@/components/common/app-header";
import { CustomLink, TopNav } from "@/components/common/top-nav";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/staff")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AppHeader
        topNav={
          <TopNav>
            <CustomLink to="/staff">Staff</CustomLink>
          </TopNav>
        }
      />
      <section className="flex-grow p-4">
        <Outlet />
      </section>
    </>
  );
}
