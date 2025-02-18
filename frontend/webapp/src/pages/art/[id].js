import React from "react";
import Image from "next/image";
import Link from "next/link";
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
		<div className="content-container">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<h2 className="font-fraunces">{art.title}</h2>
					<div className="flex flex-row gap-2">
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
				<div className="flex flex-row gap-2">
					<div>
						<Image
							className="rounded-full w-[100px] h-[100px]"
							src={pic}
							alt="profile picture"
							width={500}
							height={500}
						/>
					</div>
					<div className="flex flex-col justify-center">
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
		</div>
	);
}
