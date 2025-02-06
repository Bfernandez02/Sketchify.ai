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
				<div className="2xl:mt-[-12vw] mt-[-9vw] max-w-[2000px] mx-auto">
					<FeaturedArtwork />
				</div>
			</div>
		</>
	);
}
