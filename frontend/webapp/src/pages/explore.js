import React from "react";
import { NextSeo } from "next-seo";
import ExploreHero from "@/components/ExploreHero";

export default function explore() {
	return (
		<>
			<NextSeo title="Explore | Sketchify" />
			<div className="content-container">
				<ExploreHero />
			</div>
		</>
	);
}
