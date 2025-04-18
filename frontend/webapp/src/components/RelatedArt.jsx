"use client";
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

	useEffect(() => {
		const fetchRelatedArt = async () => {
			try {
				const relatedQuery = query(
					collectionGroup(db, "posts"),
					where("theme", "==", theme),
					orderBy("createdAt", "desc"),
					limit(3)
				);
				const relatedQuerySnapshot = await getDocs(relatedQuery);

				const related = await Promise.all(
					relatedQuerySnapshot.docs.map(async (doc) => {
						const data = doc.data();
						const userRef = doc.ref.parent.parent;
						let userData = {
							name: "Unknown User",
							profileImage: "/default-avatar.png",
						};

						if (userRef) {
							const userSnap = await getDoc(userRef);
							if (userSnap.exists()) {
								const user = userSnap.data();

								userData = {
									name: user?.name || "Unknown User",
									profileImage:
										user?.profileImage ||
										"/default-avatar.png",
								};
								// console.log(userData);
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

				console.log(related);

				setRelatedArtwork(related);

				// console.log("Related artwork:", related);
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
				<h2 className="font-fraunces md:text-[36px] text-[30px]">
					More{" "}
					<span className="font-fraunces text-[36px] text-primary font-bold">
						{theme.charAt(0).toUpperCase() + theme.slice(1)}{" "}
					</span>
					from the Community
				</h2>
				<div className="flex md:flex-row flex-col gap-4 justify-between mt-4 md:h-[320px]">
					{relatedArtwork.map((art) => (
						<ArtCard key={art.id} art={art} grid={false} />
					))}
				</div>
			</div>
		</div>
	);
}
