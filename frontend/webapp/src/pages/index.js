import React from "react";
import LandingHero from "../components/LandingHero";
import { NextSeo } from "next-seo";

export default function index() {
	return (
		<>
			<NextSeo title="Home | Sketchify" />
			<div className="content-container">
				<LandingHero />
			</div>
		</>
	);
}
