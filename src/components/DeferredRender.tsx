import { Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";

type DeferredRenderProps = {
  children: ReactNode;
  fallback?: ReactNode;
  timeoutMs?: number;
};

export const DeferredRender = ({
  children,
  fallback = null,
  timeoutMs = 1200,
}: DeferredRenderProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setReady(true);
      return;
    }

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), { timeout: timeoutMs });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(timerId);
  }, [timeoutMs]);

  if (!ready) {
    return <>{fallback}</>;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};
