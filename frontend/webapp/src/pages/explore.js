import React from "react";
import { NextSeo } from "next-seo";
import ExploreHero from "@/components/ExploreHero";
import Trending from "@/components/Trending";

export default function explore() {
	return (
		<>
			<NextSeo title="Explore | Sketchify" />
			<div className="content-container">
				<ExploreHero />
				<Trending />
			</div>
		</>
	);
}
