import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import RelatedArt from "@/components/RelatedArt";
import wand from "../../../public/wand.svg";
import { db } from "@/firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";

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
				const artRef = doc(db, "posts", id); // ref to post document
				const artSnap = await getDoc(artRef);

				if (artSnap.exists()) {
					const artData = artSnap.data();
					setArt({
						id: artSnap.id,
						...artData,
						postedAt:
							artData.postedAt?.toDate()?.toISOString() || null, // Converts Firestore timestamp to ISO string
					});

					// Fetch user data using the userID field
					const userRef = doc(db, "users", artData.userID); // ref to user document
					const userSnap = await getDoc(userRef);

					if (userSnap.exists()) {
						setUser(userSnap.data());
					}
				} else {
					console.log("No such document!");
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

	// Time ago function for formatting the date
	const timeAgo = (date) => {
		const now = new Date();
		const diff = now - date;
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(months / 12);

		const format = (value, unit) =>
			`${value} ${unit}${value === 1 ? "" : "s"} ago`;

		if (years > 0) return format(years, "year");
		if (months > 0) return format(months, "month");
		if (days > 0) return format(days, "day");
		if (hours > 0) return format(hours, "hour");
		if (minutes > 0) return format(minutes, "minute");
		return format(seconds, "second");
	};

	const dateFormatted = art.postedAt ? timeAgo(new Date(art.postedAt)) : "";

	return (
		<div className="content-container px-4">
			{/* title and categories */}
			<div className="flex md:flex-row md:justify-between flex-col mb-10 mt-2 max-w-[1200px] mx-auto md:gap-0 gap-4">
				<div className="flex flex-col">
					<h2 className="font-fraunces md:w-3/4 leading-[3rem] pb-4 px-4 md:text-[36px] md:text-left md:px-0 text-[30px] text-center">
						{art.title}
					</h2>
					<div className="flex flex-row gap-2 md:justify-start justify-center flex-wrap">
						{art.themes.map((category, index) => (
							<div
								key={index}
								className="text-white bg-primary px-[16px] py-[8px] rounded-[20px]"
							>
								{category}
							</div>
						))}
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
							{dateFormatted}
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

			{/* related art */}
			{/* <RelatedArt /> --- can add this back in later? maybe find and show other posts by user or other posts with same themes? */}
		</div>
	);
}
