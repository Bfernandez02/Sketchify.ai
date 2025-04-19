import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import CategoryTag from "./CategoryTag";
import TagCarousel from "./TagCarousel";
import { formatTimeAgo } from "@/utils/generalUtils";
import { useAuth } from "@/context/authContext";
import SaveButton from "./SaveButton";

export default function ArtCard({
	art,
	grid = true,
	simple = false,
	className, // for fixed carousel heights
}) {
	const [loading, setLoading] = useState("init");
	const { currentUser } = useAuth();
	const [artist, setArtist] = useState(null);

	const { id, title, image, theme, userID, createdAt, user } = art;

	const posted = formatTimeAgo(createdAt);

	// Use user from props first, otherwise fetch it
	useEffect(() => {
		if (user) {
			setArtist(user);
			return;
		}

		if (!userID) return;

		const fetchUser = async () => {
			try {
				const userDoc = await getDoc(doc(db, "users", userID));
				if (userDoc.exists()) {
					setArtist(userDoc.data());
				} else {
					console.error("User not found");
				}
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		fetchUser();
	}, [user, userID]);

	const heightClasses = [
		"h-[160px]",
		"h-[190px]",
		"h-[220px]",
		"h-[250px]",
		"h-[280px]",
	];
	const randomHeightClass =
		heightClasses[Math.floor(Math.random() * heightClasses.length)];

	return (
		<div
			data-simple={simple}
			className="group/art relative rounded-[20px] bg-white overflow-hidden"
		>
			<div className="absolute top-2 right-2 z-10">
				<SaveButton artID={id} />
			</div>
			{loading === "init" && (
				<div className="bg-white w-full h-full absolute" />
			)}
			<div
				data-simple={simple}
				data-grid={grid}
				className="group flex h-[400px] w-[250px] flex-col rounded-[20px] shadow-md data-[grid=true]:h-fit data-[grid=true]:w-full md:w-[275px]"
			>
				<Link
					href={`/art/${id}`}
					className="relative overflow-hidden h-full"
				>
					<Image
						alt={title}
						src={image}
						width={500}
						height={0} //dynamic height
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
						placeholder="empty"
						onError={(e) => {
							setLoading("loaded");
							e.target.remove();
						}}
						onLoad={() => setLoading("loaded")}
						data-loading={loading}
						className={`data-[loading=true]:bg-background_darkened object-cover w-full rounded-t group-data-[simple=true]:rounded bg-white ${className} ${randomHeightClass}`}
					/>
				</Link>
				<div
					className={`flex h-fit flex-col gap-1 rounded-b-[20px] bg-white p-4 group-data-[simple=true]:hidden ${
						grid
							? "w-full"
							: "absolute bottom-0 w-[250px] md:w-[275px]"
					}`}
				>
					<Link
						href={`/art/${id}`}
						className="w-full h-full absolute top-0 left-0"
					/>

					{/* Themes */}
					{theme && (
						<TagCarousel tags={[theme]} tagClassName="text-sm">
							<CategoryTag
								key={theme}
								id={theme}
								className="text-sm transition-all duration-200 ease-in-out text-primary hover:bg-primary"
							/>
						</TagCarousel>
					)}

					{/* Title */}
					<p className="font-bold z-0 text-wrap h-fit text-md text-black mb-1 pointer-events-none">
						{title?.trim() || "Untitled Art"}
					</p>

					{/* User Details */}
					<div className="flex items-center gap-2">
						<div
							className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${className}`}
						>
							<Image
								src={
									artist?.profileImage ||
									"/default-avatar.png"
								}
								alt={artist?.name || "Unknown User"}
								width={100}
								height={100}
								className="w-full h-full object-cover"
							/>
						</div>
						<div>
							<p className="text-[16px] text-black font-fraunces">
								{artist?.name || "Unknown User"}
							</p>
							<p className="text-[12px] text-gray-500">
								Posted {posted} ago
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
