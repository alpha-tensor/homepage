import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root") as HTMLElement;

if (rootEl.childNodes.length > 0) {
  // Build-time prerender already stamped real markup into #root. Hydrate so
  // React takes over without discarding the server-rendered content.
  hydrateRoot(
    rootEl,
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  // No prerendered content (dev server or fallback). Render client-side and
  // dismiss the boot screen once React has painted.
  const bootScreen = document.getElementById("boot-screen");
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  window.setTimeout(() => {
    bootScreen?.remove();
  }, 160);
}
