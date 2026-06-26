"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnalyticsService } from "@/lib/services/analytics.service";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if we are not on an admin route
    if (!pathname.startsWith("/admin")) {
      AnalyticsService.recordVisit(pathname);
    }
  }, [pathname]);

  return null;
}
