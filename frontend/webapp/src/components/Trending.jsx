import React, { useState } from "react";
import abs from "../../public/abs.jpg";
import min from "../../public/min.jpg";
import rea from "../../public/rea.jpg";
import Image from "next/image";

export default function Trending({ onThemeSelect }) {
	const trendingThemes = [
		{ name: "Cartoon", image: abs },
		{ name: "Minimalism", image: min },
		{ name: "Realism", image: rea },
	];

	const [selectedTheme, setSelectedTheme] = useState("");
	const reset = () => {
		setSelectedTheme("");
		onThemeSelect("");
	};

	const handleThemeSelect = (themeName) => {
		setSelectedTheme(themeName);
		onThemeSelect(themeName);
	};
	return (
		<div className="max-w-[1280px] mx-auto p-4">
			<h2 className="font-fraunces text-4xl pb-4 md:text-left text-center">
				Trending Themes
			</h2>
			<div className="flex md:flex-row flex-col xl:gap-12 lg:gap-6 gap-4 items-center">
				{trendingThemes.map((theme, index) => (
					<div
						key={index}
						className="md:w-[400px] md:h-[200px] w-full h-[120px] rounded-[20px] relative overflow-hidden hover:scale-[98%] transition-transform duration-300 hover:cursor-pointer"
						onClick={() => handleThemeSelect(theme.name)}
					>
						<Image
							className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
							src={theme.image.src}
							alt={theme.name}
							width={800}
							height={400}
						/>
						<div className="absolute inset-0 bg-black opacity-60"></div>
						<h3 className="absolute inset-0 flex items-center justify-center font-fraunces text-4xl text-white ">
							{theme.name}
						</h3>
					</div>
				))}
			</div>
			<div className="flex justify-between items-center pt-4">
				<div>
					Showing:{" "}
					<span className="font-bold">
						{selectedTheme ? selectedTheme : "All"}{" "}
					</span>
				</div>
				<button
					className="bg-secondary text-white font-roboto text-lg rounded-[20px]"
					onClick={reset}
				>
					See All
				</button>
			</div>
		</div>
	);
}
