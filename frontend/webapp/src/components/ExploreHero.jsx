import React from "react";
import exploreArt from "../../public/exploreArt.png";

export default function ExploreHero() {
	return (
		<div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto p-4">
			<div className="w-1/2">
			<h2 className="font-fraunces md:text-7xl text-5xl text-center">
				See What the Sketchify <br /> Community is Creating
			</h2>
			</div>
			
			<img
				className="md:w-[360px] w-[300px]"
				src={exploreArt.src}
				alt="exploreArt"
			/>
		</div>
	);
}
