import React, { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
	collectionGroup,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	doc,
	getDoc,
} from "firebase/firestore";
import ArtCard from "./ArtCard";

export default function RelatedArt({ theme }) {
	const [relatedArtwork, setRelatedArtwork] = useState([]);
	const [gridSetting, setGridSetting] = useState();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) {
				setGridSetting(false);
			} else {
				setGridSetting(true);
			}
		};

		handleResize(); // Set initial value
		window.addEventListener("resize", handleResize); // Add event listener

		return () => window.removeEventListener("resize", handleResize); // Cleanup
	}, []);

	useEffect(() => {
		const fetchRelatedArt = async () => {
			try {
				const relatedQuery = query(
					collectionGroup(db, "posts"),
					where("theme", "==", theme),
					orderBy("createdAt", "desc"),
					limit(15) // how many posts to fetch (these get shuffled and max of 3 are picked)
				);
				const relatedQuerySnapshot = await getDocs(relatedQuery);

				let allRelated = await Promise.all(
					relatedQuerySnapshot.docs.map(async (doc) => {
						const data = doc.data();
						const userRef = doc.ref.parent.parent;
						let userData = {
							name: null,
							profileImage: null,
						};

						if (userRef) {
							const userSnap = await getDoc(userRef);
							if (userSnap.exists()) {
								const user = userSnap.data();
								userData = {
									name: user?.name,
									profileImage: user?.profileImage,
								};
							}
						}

						return {
							id: doc.id,
							...data,
							createdAt:
								data.createdAt?.toDate().toISOString() || null,
							user: userData,
						};
					})
				);

				// Randomly pick 3 from limit results
				const shuffled = allRelated.sort(() => 0.5 - Math.random());
				const randomThree = shuffled.slice(0, 3);

				setRelatedArtwork(randomThree);
			} catch (error) {
				console.error("Error fetching related artwork:", error);
			}
		};

		if (theme) fetchRelatedArt();
	}, [theme]);

	// console.log("Related artwork:", relatedArtwork);

	return (
		<div className="content-container max-w-[1200px] py-8">
			<div>
				<h2 className="font-fraunces md:text-[36px] text-[30px] pb-8 md:text-left text-center">
					<span className="font-fraunces md:text-[36px] text-[30px] text-primary font-bold">
						{theme.charAt(0).toUpperCase() + theme.slice(1)}{" "}
					</span>
					from the Sketchify Community
				</h2>
				<div className="flex md:flex-row flex-col justify-between mt-4 md:h-[320px] md:gap-4 gap-10">
					{relatedArtwork.map((art) => (
						<ArtCard key={art.id} art={art} grid={gridSetting} />
					))}
				</div>
			</div>
		</div>
	);
}
