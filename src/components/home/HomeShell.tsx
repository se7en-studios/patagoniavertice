import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import "./home-clara.css";

/** Cáscara clara solo para la home: reemplaza navbar, footer y dock oscuros. */
export default function HomeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hc">
      <GoogleAnalytics />
      <HomeHeader />
      <main>{children}</main>
      <HomeFooter />
    </div>
  );
}
