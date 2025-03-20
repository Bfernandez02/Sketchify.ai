import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import CategoryTag from "./CategoryTag";
import TagCarousel from "./TagCarousel";

export default function ArtCard({
	art,
	grid = true,
	simple = false,
	className, // for fixed carousel heights
}) {
	const [loading, setLoading] = useState("init");
	const [artist, setArtist] = useState(null); // Store user data

	const { id, title, image, categories, themes, userID, date } = art;

	useEffect(() => {
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
	}, [userID]);

	const heightClasses = [
		"h-[170px]",
		"h-[200px]",
		"h-[230px]",
		"h-[260px]",
		"h-[290px]",
	];
	const randomHeightClass =
		heightClasses[Math.floor(Math.random() * heightClasses.length)];

	return (
		<div
			data-simple={simple}
			className="group/art relative rounded-[20px] bg-white overflow-hidden"
		>
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

					{/* Categories */}
					{categories?.length > 0 && (
						<div className="-translate-x-0.5">
							<TagCarousel
								tags={categories}
								tagClassName="h-fit text-sm"
							>
								{categories.map((category) => (
									<CategoryTag
										key={category.id}
										id={category.name}
										className="text-sm transition-all duration-200 ease-in-out text-primary hover:bg-primary"
									/>
								))}
							</TagCarousel>
						</div>
					)}

					{/* Themes */}
					{themes?.length > 0 && (
						<TagCarousel tags={themes} tagClassName="text-sm">
							{themes.map((theme) => (
								<CategoryTag
									key={theme}
									id={theme}
									className="text-sm transition-all duration-200 ease-in-out text-primary hover:bg-primary"
								/>
							))}
						</TagCarousel>
					)}

					{/* Title */}
					<p className="font-bold z-0 text-wrap h-fit text-md text-black mb-1 pointer-events-none">
						{title}
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
								Posted {date}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
