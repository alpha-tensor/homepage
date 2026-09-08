import React, { useEffect, useSyncExternalStore } from "react";
import { CaseJourney } from "./components/CaseJourney";
import { ExistingSystems } from "./components/ExistingSystems";
import { FinalCtaSection } from "./components/FinalCtaSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NotFoundPage } from "./components/NotFoundPage";
import { PlatformSection } from "./components/PlatformSection";
import { PositioningBridge } from "./components/PositioningBridge";
import { ProductEvidence } from "./components/ProductEvidence";
import { ProofStrip } from "./components/ProofStrip";
import { TrustSection } from "./components/TrustSection";
import { DEMO_URL } from "./content/landingPage";

const HOME_TITLE =
  "AlphaTensor. Operational Automation for Immigration Law Firms.";
const NOT_FOUND_TITLE = "404. Page not found. AlphaTensor";

const normalizePathname = (pathname: string): string => {
  const trimmedPath = pathname.replace(/\/+$/, "");
  return trimmedPath === "" ? "/" : trimmedPath;
};

/* Window.location as an external store so the app can react to route changes
 * without a router. The server snapshot is always "/": the build-time
 * prerender only stamps the home route, and hydration must match it before
 * the client re-evaluates the real path (e.g. for the 404 page). */
const subscribeToPathname = (onChange: () => void): (() => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

const getPathnameSnapshot = (): string =>
  normalizePathname(window.location.pathname);

const getPathnameServerSnapshot = (): string => "/";

function App(): React.JSX.Element {
  const handleScheduleClick = () => {
    window.open(DEMO_URL, "_blank", "noreferrer");
  };

  // Reads the real pathname as an external store (SSR-safe: the server
  // snapshot is "/", matching the prerendered home page). Unknown paths switch
  // to the 404 page after hydration without a markup mismatch.
  const pathname = useSyncExternalStore(
    subscribeToPathname,
    getPathnameSnapshot,
    getPathnameServerSnapshot,
  );
  const isHomeRoute = pathname === "/" || pathname === "/index.html";

  useEffect(() => {
    document.title = isHomeRoute ? HOME_TITLE : NOT_FOUND_TITLE;
  }, [isHomeRoute]);

  if (!isHomeRoute) {
    return (
      <main>
        <Header />
        <NotFoundPage />
      </main>
    );
  }

  return (
    <main>
      <Header />

      {/* Five second test: outcome, immigration context, proof, next step */}
      <Hero onCtaClick={handleScheduleClick} />

      {/* Immediate proof */}
      <ProofStrip />

      {/* Scroll-driven case story: arrival to next action */}
      <CaseJourney />

      {/* Keep the CMS, remove the work around it */}
      <PositioningBridge />

      {/* Real product evidence */}
      <ProductEvidence />

      {/* Second half: the platform is broader than intake */}
      <PlatformSection />

      {/* Fits the way the firm already works */}
      <ExistingSystems />

      {/* Trust and operational depth */}
      <TrustSection />

      {/* Final CTA */}
      <FinalCtaSection onCtaClick={handleScheduleClick} />

      <Footer />
    </main>
  );
}

export default App;
