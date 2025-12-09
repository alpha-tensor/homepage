import React from "react";
import { AboutSection } from "./components/AboutSection";
import { CapabilitiesGrid } from "./components/CapabilitiesGrid";
import { FinalCtaSection } from "./components/FinalCtaSection";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProofStrip } from "./components/ProofStrip";
import { SystemView } from "./components/SystemView";
import { TrustSection } from "./components/TrustSection";
import { UseCasesGrid } from "./components/UseCasesGrid";

function App(): React.JSX.Element {
	const handleScheduleClick = () => {
		// Replace with actual Cal.com link or integration
		window.open("https://cal.com/", "_blank");
	};

	return (
		<main>
			<Header />
			<Hero onCtaClick={handleScheduleClick} />
			<ProofStrip />
			<CapabilitiesGrid />
			<SystemView />
			<UseCasesGrid />
			<TrustSection />
			<AboutSection />
			<FinalCtaSection onCtaClick={handleScheduleClick} />
		</main>
	);
}

export default App;
