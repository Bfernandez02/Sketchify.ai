import React from "react";
import LandingHero from "../components/LandingHero";
import FeaturedArtwork from "@/components/FeaturedArtwork";
import Overview from "@/components/Overview";
import { NextSeo } from "next-seo";
import { useAuth } from "@/context/authContext";

export default function Index() {
	const { currentUser } = useAuth();
	return (
		<>
			<NextSeo title="Home | Sketchify" />

			<LandingHero />
			<div className="2xl:mt-[-12vw] mt-[-9vw] max-w-[2000px] mx-auto">
				<FeaturedArtwork />
				<Overview />
			</div>
		</>
	);
}
