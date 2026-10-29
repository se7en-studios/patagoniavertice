"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import FloatingDock from "@/components/marketing/FloatingDock";
import MobileCtaBar from "@/components/marketing/MobileCtaBar";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminOrAuth =
    pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  if (isAdminOrAuth) {
    return (
      <main className="min-h-screen bg-[#060913] text-[#F5EFE6]">
        {children}
      </main>
    );
  }

  return (
    <SmoothScroll>
      <GoogleAnalytics />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
      {/* Espacio para que la barra fija móvil no tape el final de la página */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <FloatingDock />
      <MobileCtaBar />
    </SmoothScroll>
  );
}
