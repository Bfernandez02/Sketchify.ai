import React, { useState } from "react";
import Image from "next/image";
import pic from "../../../public/erik.png";
import ArtCard from "@/components/ArtCard";

export default function profile() {
	// ex of user object we will use from firebase**
	const user = {
		username: "EHansen100",
		profilePic: pic,
		themes: ["Nature", "Landscape", "Minimalism", "Urban", "Tranquility"],
	};

	// temp artData for testing
	const artsData = [
		{
			id: 1,
			title: "Sunset Over the Hills",
			image: "/astro.jpg",
			date: "2023-08-15",
			categories: [
				{ id: 1, name: "Nature" },
				{ id: 3, name: "Landscape" },
			],
			user: {
				id: 1,
				name: user.username,
				profile: user.profilePic,
			},
		},
		{
			id: 1,
			title: "Urban Exploration",
			image: "/abstract.jpg",
			date: "2023-07-22",
			categories: [
				{ id: 2, name: "Minimalism" },
				{ id: 4, name: "Urban" },
			],
			user: {
				id: 1,
				name: user.username,
				profile: user.profilePic,
			},
		},
		{
			id: 3,
			title: "Forest Tranquility",
			image: "/forest.jpg",
			date: "2023-06-10",
			categories: [
				{ id: 1, name: "Nature" },
				{ id: 5, name: "Tranquility" },
			],
			user: {
				id: 1,
				name: user.username,
				profile: user.profilePic,
			},
		},

		{
			id: 5,
			title: "Mountain Majesty",
			image: "/bunny.jpg",
			date: "2023-04-18",
			categories: [
				{ id: 1, name: "Nature" },
				{ id: 3, name: "Landscape" },
			],
			user: {
				id: 1,
				name: user.username,
				profile: user.profilePic,
			},
		},
	];

	const [arts, setArts] = useState(artsData);
	const [filter, setFilter] = useState("All");

	const filterArts = (theme) => {
		if (theme === "All") {
			setArts(artsData);
			setFilter("All");
		} else {
			const filteredArts = artsData.filter((art) => {
				const categories = art.categories.map(
					(category) => category.name
				);
				return categories.includes(theme);
			});
			setArts(filteredArts);
			setFilter(theme);
		}
	};

	return (
		<div className="max-w-[1280px] mx-auto p-4">
			<div className="flex gap-6">
				<Image
					className="rounded-full"
					src={user.profilePic}
					alt="alt text"
					width={200}
					height={200}
				/>
				<div className="flex flex-col py-4 justify-between w-full">
					<div>
						<h2 className="font-fraunces leading-9">
							{user.username}
						</h2>
						{/**Edit only if you are the user**/}
						<a className="font-roboto text-[16px] text-gray-700 pl-1 hover:underline hover:cursor-pointer">
							Edit profile
						</a>
					</div>
					{/*Themes - users most common themes? can also serve as filtering for their artworks maybe.*/}
					<div className="flex flex-row justify-between">
						<div className="flex flex-row gap-2">
							<button
								className={` ${
									filter === "All"
										? "font-roboto text-[18px] border-2 border-black"
										: "font-roboto text-[18px] border-2 border-transparent"
								}`}
								onClick={() => filterArts("All")}
							>
								All
							</button>
							{user.themes.map((theme, index) => (
								<button
									key={index}
									className={` ${
										filter === theme
											? "font-roboto text-[18px] border-2 border-black"
											: "font-roboto text-[18px] border-2 border-transparent"
									}`}
									onClick={() => filterArts(theme)}
								>
									{theme}
								</button>
							))}
						</div>
						{/*Only if you are the user*/}
						<button className="btnRev">My Saved</button>
					</div>
				</div>
			</div>

			<h2 className="pt-12 font-fraunces">Artwork</h2>
			<div className="flex flex-wrap gap-4 mb-4">
				{arts.map((art, index) => (
					<div key={index} className="w-[300px]">
						<ArtCard art={art} grid={true} />
					</div>
				))}
			</div>
		</div>
	);
}
