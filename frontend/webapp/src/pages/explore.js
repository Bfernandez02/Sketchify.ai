import React from "react";
import { NextSeo } from "next-seo";
import ExploreHero from "@/components/ExploreHero";
import Trending from "@/components/Trending";
import DisplayArtsGrid from "@/components/DisplayArtsGrid";
import artsData from "@/utils/artsData";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function explore({arts}) {

	console.log(arts);
	return (
		<>
			<NextSeo title="Explore | Sketchify" />
			<div className="content-container">
				<ExploreHero />
				<Trending />

				<div className="max-w-[1280px] mx-auto p-4">
					<DisplayArtsGrid arts={artsData} />
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps() {
	const artsCollection = collection(db, "posts");
	const artsSnapshot = await getDocs(artsCollection);
	const arts = artsSnapshot.docs.map(doc => doc.data());

	return {
		props: {
			arts,
		},
	};
}

