import React from "react";
import stroke from "../../public/stroke.png";
import brushes from "../../public/brushes.png";

export default function FeaturedArtwork() {
	return (
		<>
			<div className="relative flex flex-col">
				<img
					className="relative md:w-[400px] w-[280px] ml-[14vw]"
					src={brushes.src}
					alt="Brushes"
				/>
				<img
					className="relative mt-[-28px]"
					src={stroke.src}
					alt="Stroke"
				/>
			</div>
		</>
	);
}
