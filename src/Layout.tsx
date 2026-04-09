import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const Layout = () => (
  <>
    <Toaster />
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      }
    >
      <Outlet />
    </Suspense>
  </>
);

export default Layout;
