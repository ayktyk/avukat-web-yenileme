import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import WebMCPProvider from "@/components/WebMCPProvider";

const Layout = () => (
  <>
    <Toaster />
    <WebMCPProvider />
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
