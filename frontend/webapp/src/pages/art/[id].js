import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import RelatedArt from "@/components/RelatedArt";
import wand from "../../../public/wand.svg";
import { db } from "@/firebase/config";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { formatTimeAgo } from "@/utils/generalUtils";

export default function Art() {
	const [art, setArt] = useState(null); // Store post data
	const [user, setUser] = useState(null); // Store user data
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const { id } = router.query; // Get the post ID from the URL

	// Fetch post data
	useEffect(() => {
		if (!id) return;

		const fetchArt = async () => {
			setLoading(true);
			try {
				// Fetch all users to find the user who created the post
				const usersRef = collection(db, "users");
				const usersSnapshot = await getDocs(usersRef);

				let foundUser = null;
				let postData = null;
				let userID = null; // Declare userID outside the loop

				// Search through each user to find the post
				for (const userDoc of usersSnapshot.docs) {
					const postsRef = collection(userDoc.ref, "posts"); // Get the posts subcollection for each user
					const postSnap = await getDocs(postsRef);

					postSnap.forEach((post) => {
						if (post.id === id) {
							postData = post.data();
							foundUser = userDoc.data();
							userID = userDoc.id; // Capture the user ID when the post is found
						}
					});

					// If the post is found, stop iterating
					if (foundUser && postData) break;
				}

				if (postData && foundUser) {
					setArt({
						id: id,
						...postData,
						createdAt: postData.createdAt.toDate(),
					});

					setUser({
						...foundUser,
						uid: userID, // Use captured user ID here
					});
				} else {
					console.log("No such post found!");
				}
			} catch (error) {
				console.error("Error fetching art or user:", error);
			}
			setLoading(false);
		};

		fetchArt();
	}, [id]);

	if (loading) return <p>Loading...</p>;
	if (!art || !user) return <p>Art or user not found</p>;

	// console.log(art);
	return (
		<div className="content-container px-4">
			{/* title and categories */}
			<div className="flex md:flex-row md:justify-between flex-col mb-10 mt-2 max-w-[1200px] mx-auto md:gap-0 gap-4">
				<div className="flex flex-col w-100% md:w-1/2 md:gap-0 gap-4">
					<h2 className="font-fraunces md:w-3/4 leading-[3rem] pb-4 px-4 md:text-[36px] md:text-left md:px-0 text-[30px] text-center">
						{art.title?.trim() || "Untitled Art"}
					</h2>
					<div className="flex flex-row gap-2 md:justify-start justify-center flex-wrap">
						{art.theme && (
							<div
								key={art.theme}
								className="text-white bg-primary px-[16px] py-[8px] rounded-[20px]"
							>
								{art.theme}
							</div>
						)}
					</div>
				</div>

				{/* user info */}
				<div className="flex md:flex-row flex-col gap-2 items-center md:justify-end justify-center md:w-1/2 md:px-0 px-4">
					<div>
						<Image
							className="rounded-full w-[80px] h-[80px]"
							src={user.profileImage}
							alt="profile picture"
							width={500}
							height={500}
						/>
					</div>
					<div className="flex flex-col">
						<Link
							className="font-fraunces text-[24px] leading-6 hover:underline"
							href={`/profile/${user.uid}`}
						>
							{user.name}
						</Link>
						<p className="text-gray-500 text-[16px]">
							Posted {formatTimeAgo(art.createdAt)} ago
						</p>
					</div>
				</div>
			</div>

			{/* images */}
			<div className="flex md:flex-row md:justify-between items-center flex-col justify-center max-w-[1200px] mx-auto mb-10">
				<Image
					className="md:w-[35%] w-[80vw] h-auto rounded-[20px]"
					src={art.drawing}
					alt="original sketch"
					width={500}
					height={500}
				/>
				<Image
					className="w-[80px] h-[80px] md:my-0 my-8"
					src={wand}
					alt="wand"
					width={500}
					height={500}
				/>
				<Image
					className="md:w-[35%] w-[80vw] h-auto rounded-[20px]"
					src={art.image}
					alt="enhanced sketch"
					width={500}
					height={500}
				/>
			</div>

			{/* Related artwork */}
			{/* <RelatedArt /> -- to do, use current arts theme to find up to 3 related artworks from all users? */}
		</div>
	);
}
