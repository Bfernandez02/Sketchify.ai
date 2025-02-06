import React from "react";
import LandingHero from "../components/LandingHero";
import FeaturedArtwork from "@/components/FeaturedArtwork";
import { NextSeo } from "next-seo";

export default function index() {
	return (
		<>
			<NextSeo title="Home | Sketchify" />
			<div className="">
				<LandingHero />
				<div className="mt-[-9vw]">
					<FeaturedArtwork />
				</div>
			</div>
		</>
	);
}
