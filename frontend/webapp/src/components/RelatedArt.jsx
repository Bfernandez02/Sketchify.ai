import React from "react";
import { useState, useEffect } from "react";
import ArtCard from "./ArtCard";

export default function RelatedArt() {
	const [relatedArtwork, setRelatedArtwork] = useState([]);

	return (
		<div className="content-container max-w-[1200px] py-8">
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
