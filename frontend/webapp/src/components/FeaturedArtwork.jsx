import React from "react";
import Image from "next/image";
import stroke from "../../public/stroke.png";
import brushes from "../../public/brushes.png";
import abstract from "../../public/abstract.jpg";
import astro from "../../public/astro.jpg";
import bunny from "../../public/bunny.jpg";
import cake from "../../public/cake.jpg";
import forest from "../../public/forest.jpg";

export default function FeaturedArtwork() {
	const featuredArtwork = [
		{
			src: abstract.src,
			alt: "Abstract",
		},
		{
			src: astro.src,
			alt: "Astro",
		},
		{
			src: bunny.src,
			alt: "Bunny",
		},
		{
			src: cake.src,
			alt: "Cake",
		},
		{
			src: forest.src,
			alt: "Forest",
		},
	];

	return (
		<>
			<div className="relative flex flex-col pb-24">
				<img
					className="relative md:w-[400px] w-[280px] ml-[14vw]"
					src={brushes.src}
					alt="Brushes"
				/>

				<img
					className="absolute mt-[200px]"
					src={stroke.src}
					alt="Stroke"
				/>

				<div className="flex gap-4 justify-center z-10 2xl:mt-0 xl:mt-[-20px] mt-[-32px]">
					<div className="w-[9vw]">
						<Image
							className="object-cover rounded-[20px] 2xl:h-[200px] lg:h-[140px] h-[92px]"
							src={abstract.src}
							alt="Abstract"
							width={500}
							height={500}
						/>
					</div>
					<div className="w-[13%]">
						<Image
							className="object-cover rounded-[20px] 2xl:h-[280px] lg:h-[200px] h-[140px]"
							src={cake.src}
							alt="cake"
							width={500}
							height={500}
						/>
					</div>
					<div className="w-[21%]">
						<Image
							className="object-cover rounded-[20px] 2xl:h-[340px] lg:h-[260px] h-[180px]"
							src={forest.src}
							alt="Forest"
							width={500}
							height={500}
						/>
					</div>
					<div className="flex flex-col gap-4 w-[30%]">
						<div className="w-[68%]">
							<Image
								className="object-cover rounded-[20px] 2xl:h-[126px] lg:h-[100px] h-[73px]"
								src={astro.src}
								alt="astro"
								width={500}
								height={500}
							/>
						</div>
						<div className="w-[90%]">
							<Image
								className="object-cover rounded-[20px] 2xl:h-[200px] lg:h-[145px] h-[92px]"
								src={bunny.src}
								alt="bunny"
								width={500}
								height={500}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
