import React from "react";
import Image from "next/image";
import Link from "next/link";
import RelatedArt from "@/components/RelatedArt";
import pic from "../../../public/erik.png";
import wand from "../../../public/wand.svg";
import sketch from "../../../public/drawing.png";
import enhanced from "../../../public/drawingEnh.png";

export default function art() {
	// example of art object we will use from firebase**
	const art = {
		id: 1,
		title: "Swing hanging from tree on a beach, during a sunset",
		categories: [
			{ id: 1, name: "Surrealism" },
			{ id: 2, name: "Nature" },
		],
		user: { id: 1, username: "EHansen100", profilePic: pic },
		date: "2025-02-14",
		original: sketch,
		enhanced: enhanced,
	};

	// we might not actually need this help fnc depending on firebase date data I guess?
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

	const dateFormatted = art.date ? timeAgo(new Date(art.date)) : "";

	return (
		<div className="content-container px-4">
			{/* title and categories */}
			<div className="flex md:flex-row md:justify-between flex-col mb-10 mt-2 max-w-[1200px] mx-auto md:gap-0 gap-4">
				<div className="flex flex-col">
					<h2 className="font-fraunces md:w-3/4 leading-[3rem] pb-4 px-4 md:text-[36px] md:text-left md:px-0 text-[30px] text-center">
						{art.title}
					</h2>
					<div className="flex flex-row gap-2 md:justify-start justify-center flex-wrap">
						{art.categories.map((category) => (
							<div
								key={category.id}
								id={category.name}
								className="text-white bg-primary px-[16px] py-[8px] rounded-[20px]"
							>
								{category.name}
							</div>
						))}
					</div>
				</div>

				{/* user info */}
				<div className="flex md:flex-row flex-col gap-2 items-center md:justify-end justify-center md:w-1/2 md:px-0 px-4">
					<div>
						<Image
							className="rounded-full w-[80px] h-[80px]"
							src={pic}
							alt="profile picture"
							width={500}
							height={500}
						/>
					</div>
					<div className="flex flex-col">
						<Link
							className="font-fraunces text-[24px] leading-6 hover:underline"
							href={`/profile/${art.user.id}`}
						>
							{art?.user?.username}
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
					src={art.original}
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
					src={art.enhanced}
					alt="enhanced sketch"
					width={500}
					height={500}
				/>
			</div>

			{/* related art */}
			<RelatedArt />
		</div>
	);
}
