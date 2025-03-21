import React from "react";
import { NextSeo } from "next-seo";
import ExploreHero from "@/components/ExploreHero";
import Trending from "@/components/Trending";
import DisplayArtsGrid from "@/components/DisplayArtsGrid";
import { db } from "../firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Explore({ arts }) {
	console.log("Fetched Arts:", arts);

	return (
		<>
			<NextSeo title="Explore | Sketchify" />
			<div className="content-container">
				<ExploreHero />
				<Trending />

				<div className="max-w-[1280px] mx-auto p-4">
					<DisplayArtsGrid arts={arts} />
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps() {
	try {
		const artsCollection = collection(db, "posts");
		const artsSnapshot = await getDocs(artsCollection);

		const arts = artsSnapshot.docs.map((doc) => {
			const data = doc.data();

			return {
				id: doc.id,
				...data,
				postedAt: data.postedAt?.seconds
					? new Date(data.postedAt.seconds * 1000).toISOString()
					: data.postedAt || null,
				createdAt: data.createdAt?.seconds
					? new Date(data.createdAt.seconds * 1000).toISOString()
					: data.createdAt || null,
			};
		});

		console.log("Fetched arts:", arts);

		return { props: { arts } };
	} catch (error) {
		console.error("Error fetching arts:", error);
		return { props: { arts: [] } };
	}
}
