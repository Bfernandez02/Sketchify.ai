import React, { useState } from "react";
import { NextSeo } from "next-seo";
import ExploreHero from "@/components/ExploreHero";
import Trending from "@/components/Trending";
import DisplayArtsGrid from "@/components/DisplayArtsGrid";
import { db } from "../firebase/config";
import { collectionGroup, getDocs, doc, getDoc } from "firebase/firestore";

export default function Explore({ arts }) {
	const [filteredArts, setFilteredArts] = useState(arts);

	const onThemeSelect = (theme) => {
		// console.log(`Selected theme: ${theme}`);
		const filtered = theme
			? arts.filter(
					(art) => art.theme.toLowerCase() === theme.toLowerCase()
			  )
			: arts;
		setFilteredArts(filtered);
		// console.log("Filtered arts:", filtered);
	};

	return (
		<>
			<NextSeo title="Explore | Sketchify" />
			<div className="content-container">
				<ExploreHero />
				<Trending onThemeSelect={onThemeSelect} />
				<div className="max-w-[1280px] mx-auto p-4">
					<DisplayArtsGrid arts={filteredArts} />
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps() {
	try {
		// Get all posts from nested "posts" subcollections
		const postsSnapshot = await getDocs(collectionGroup(db, "posts"));

		// Extract posts and include userID from path
		const postsWithUserIDs = postsSnapshot.docs.map((docSnap) => {
			const data = docSnap.data();
			const postId = docSnap.id;

			const pathSegments = docSnap.ref.path.split("/");
			const userIndex = pathSegments.indexOf("users");
			const userID =
				userIndex !== -1 ? pathSegments[userIndex + 1] : null;

			if (!userID) {
				console.warn(
					"Could not extract userID from path:",
					docSnap.ref.path
				);
			}

			return {
				id: postId,
				userID,
				...data,
				postedAt: data.postedAt?.seconds
					? new Date(data.postedAt.seconds * 1000).toISOString()
					: data.postedAt || null,
				createdAt: data.createdAt?.seconds
					? new Date(data.createdAt.seconds * 1000).toISOString()
					: data.createdAt || null,
			};
		});

		// Get unique userIDs and fetch corresponding user data
		const uniqueUserIDs = [
			...new Set(
				postsWithUserIDs
					.map((post) => post.userID)
					.filter((id) => id !== null)
			),
		];

		const userMap = {};

		await Promise.all(
			uniqueUserIDs.map(async (userID) => {
				try {
					const userRef = doc(db, "users", userID);
					const userDoc = await getDoc(userRef);
					if (userDoc.exists()) {
						const userData = userDoc.data();
						userMap[userID] = {
							name: userData.name || "Unknown User",
							profileImage:
								userData.profileImage || "/default-avatar.png",
						};
					} else {
						console.warn(`No user found for ID: ${userID}`);
					}
				} catch (err) {
					console.error(
						`Error fetching user ${userID}:`,
						err.message
					);
				}
			})
		);

		// Attach user info to each post
		const arts = postsWithUserIDs.map((post) => ({
			...post,
			user: userMap[post.userID] || {
				name: "Unknown User",
				profileImage: "/default-avatar.png",
			},
		}));

		return { props: { arts } };
	} catch (error) {
		return { props: { arts: [] } };
	}
}
