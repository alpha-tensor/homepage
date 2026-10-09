import React, { useCallback, useEffect, useSyncExternalStore } from "react";
import { CaseJourney } from "./components/CaseJourney";
import { ConsentBanner } from "./components/ConsentBanner";
import { ExistingSystems } from "./components/ExistingSystems";
import { FinalCtaSection } from "./components/FinalCtaSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LabPage } from "./lab/LabPage";
import { TaglineLab } from "./lab/TaglineLab";
import { NotFoundPage } from "./components/NotFoundPage";
import { PlatformSection } from "./components/PlatformSection";
import { PositioningBridge } from "./components/PositioningBridge";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { ProductEvidence } from "./components/ProductEvidence";
import { ProofStrip } from "./components/ProofStrip";
import { TrustSection } from "./components/TrustSection";

const HOME_TITLE =
  "AlphaTensor. Operational Automation for Immigration Law Firms.";
const PRIVACY_TITLE = "Privacy and cookie policy. AlphaTensor";
const LAB_TITLE = "Document lab. AlphaTensor";
const TAGLINE_LAB_TITLE = "Tagline experiment. AlphaTensor";
const NOT_FOUND_TITLE = "404. Page not found. AlphaTensor";

const normalizePathname = (pathname: string): string => {
  const trimmedPath = pathname.replace(/\/+$/, "");
  return trimmedPath === "" ? "/" : trimmedPath;
};

/* Window.location as an external store so the app can react to route changes
 * without a router. The server snapshot is the route the prerenderer stamped
 * into this document: the build emits a separate static page per route, so
 * hydration has to render the same tree the server did or React reports a
 * mismatch and the visitor sees the wrong page flash before it corrects. */
const subscribeToPathname = (onChange: () => void): (() => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

const getPathnameSnapshot = (): string =>
  normalizePathname(window.location.pathname);

/* The route to render on the server, and during hydration on the client.
 *
 * On the server it comes from the prerenderer, which knows which document it is
 * producing. In the browser it comes from the stamp the prerenderer wrote into
 * that document. The fallback covers the dev server and the non-prerendered
 * shell, where the client renders from scratch. */
const getBootRoute = (initialPath?: string): string => {
  if (initialPath) return normalizePathname(initialPath);
  if (typeof window !== "undefined" && window.__AT_BOOT_ROUTE__) {
    return normalizePathname(window.__AT_BOOT_ROUTE__);
  }
  return "/";
};

interface AppProps {
  /** Route the prerenderer rendered. Server render only. */
  initialPath?: string;
}

function App({ initialPath }: AppProps): React.JSX.Element {
  // Reads the real pathname as an external store. The server snapshot is the
  // route this document was prerendered for, so hydration matches; unknown paths
  // switch to the 404 page after hydration without a markup mismatch.
  const getServerSnapshot = useCallback(
    () => getBootRoute(initialPath),
    [initialPath],
  );
  const pathname = useSyncExternalStore(
    subscribeToPathname,
    getPathnameSnapshot,
    getServerSnapshot,
  );
  const isHomeRoute = pathname === "/" || pathname === "/index.html";
  const isPrivacyRoute = pathname === "/privacy";
  const isLabRoute = pathname === "/lab";
  const isTaglineLabRoute = pathname === "/lab/tagline";

  useEffect(() => {
    document.title = isHomeRoute
      ? HOME_TITLE
      : isPrivacyRoute
        ? PRIVACY_TITLE
        : isTaglineLabRoute
          ? TAGLINE_LAB_TITLE
          : isLabRoute
            ? LAB_TITLE
            : NOT_FOUND_TITLE;
  }, [isHomeRoute, isPrivacyRoute, isLabRoute, isTaglineLabRoute]);

  if (isPrivacyRoute) {
    return (
      <main>
        <Header />
        <PrivacyPolicy />
        <Footer />
        <ConsentBanner />
      </main>
    );
  }

  if (isTaglineLabRoute) {
    return (
      <main>
        <TaglineLab />
        <Footer />
        <ConsentBanner />
      </main>
    );
  }

  if (isLabRoute) {
    return (
      <main>
        <Header />
        <LabPage />
        <Footer />
        <ConsentBanner />
      </main>
    );
  }

  if (!isHomeRoute) {
    return (
      <main>
        <Header />
        <NotFoundPage />
        <ConsentBanner />
      </main>
    );
  }

  return (
    <main>
      <Header />

      {/* Five second test: outcome, immigration context, proof, next step */}
      <Hero />

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
      <FinalCtaSection />

      <Footer />
      <ConsentBanner />
    </main>
  );
}

export default App;
