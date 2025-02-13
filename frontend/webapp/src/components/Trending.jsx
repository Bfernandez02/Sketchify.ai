import React from "react";
import abs from "../../public/abs.jpg";
import min from "../../public/min.jpg";
import rea from "../../public/rea.jpg";
import Image from "next/image";

export default function Trending() {
	const trendingThemes = [
		{ name: "Nature", image: abs },
		{ name: "Minimalism", image: min },
		{ name: "Realism", image: rea },
	];

	return (
		<div className="max-w-[1280px] mx-auto p-4">
			<h2 className="font-fraunces text-4xl pb-4">Trending Themes</h2>
			<div className="flex flex-row gap-12">
				{trendingThemes.map((theme, index) => (
					<div
						key={index}
						className="w-[400px] h-[200px] rounded-[20px] relative overflow-hidden"
					>
						{/* Image */}
						<Image
							className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
							src={theme.image.src}
							alt={theme.name}
							width={800}
							height={400}
						/>

						{/* Dark Overlay Mask */}
						<div className="absolute inset-0 bg-black opacity-60"></div>

						{/* Centered Text */}
						<h3 className="absolute inset-0 flex items-center justify-center font-fraunces text-4xl text-white ">
							{theme.name}
						</h3>
					</div>
				))}
			</div>
		</div>
	);
}
