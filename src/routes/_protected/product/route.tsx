import AppHeader from "@/components/common/app-header";
import { CustomLink, TopNav } from "@/components/common/top-nav";
import { Outlet } from "@tanstack/react-router";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/product")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();

  return (
    <>
      <AppHeader
        topNav={
          <TopNav>
            {!productId ? (
              <CustomLink to="/product">Products</CustomLink>
            ) : (
              <>
                <CustomLink
                  to="/product/$productId"
                  params={{ productId: productId }}
                >
                  Basic Info
                </CustomLink>
                <CustomLink
                  to="/product/varients/$productId"
                  params={{ productId: productId }}
                >
                  Varients
                </CustomLink>
              </>
            )}
          </TopNav>
        }
      />
      <section className="flex-grow p-4">
        <Outlet />
      </section>
    </>
  );
}
