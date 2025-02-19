import React from "react";
import { useState, useEffect } from "react";
import ArtCard from "./ArtCard";
import pic from "../../public/erik.png";
import guy from "../../public/guy.jpg";

export default function RelatedArt() {
	// test relatedArtwork data
	const relatedArtwork = [
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
				name: "EHansen100",
				profile: pic,
			},
		},
		{
			id: 2,
			title: "Urban Exploration",
			image: "/abstract.jpg",
			date: "2023-07-22",
			categories: [
				{ id: 2, name: "Minimalism" },
				{ id: 4, name: "Urban" },
			],
			user: {
				id: 1,
				name: "AnotherUser2",
				profile: guy,
			},
		},
		{
			id: 3,
			title: "Something Different",
			image: "/bunny.jpg",
			date: "2023-07-22",
			categories: [
				{ id: 2, name: "Minimalism" },
				{ id: 4, name: "Urban" },
			],
			user: {
				id: 1,
				name: "AnotherUser2",
				profile: guy,
			},
		},
	];

	const [isGrid, setIsGrid] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsGrid(window.innerWidth < 768);
		};

		handleResize(); // Set initial state
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="content-container max-w-[1200px] px-4 py-8">
			<div>
				<h2 className="font-fraunces md:text-[36px] text-[30px]">
					More like this
				</h2>
				<div className="flex md:flex-row flex-col gap-4 justify-between mt-4 md:h-[320px]">
					{relatedArtwork.map((art) => (
						<ArtCard key={art.id} art={art} grid={isGrid} />
					))}
				</div>
			</div>
		</div>
	);
}
