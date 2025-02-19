// import UserIcon from "@/components/shared/UserIcon";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import Link from "next/link";
import CategoryTag from "./CategoryTag";
import TagCarousel from "./TagCarousel";

// simple only shows the image
// noPreview disables video preview, instead shows a static image
export default function ArtCard({
	art,
	grid = true,
	simple = false,
	className, // for fixed carousel heights
}) {
	const [loading, setLoading] = useState("init");

	const { id, title, image, categories, user, date } = art;

	const heightClasses = [
		"h-[170px]",
		"h-[200px]",
		"h-[230px]",
		"h-[260px]",
		"h-[290px]",
	];
	const randomHeightClass =
		heightClasses[Math.floor(Math.random() * heightClasses.length)];

	return (
		<div
			data-simple={simple}
			className="group/art relative rounded-[20px] bg-white overflow-hidden"
		>
			{loading === "init" && (
				<div className="bg-white w-full h-full absolute" />
			)}
			<div
				data-simple={simple}
				data-grid={grid}
				className="group flex h-[400px] w-[250px] flex-col rounded-[20px] shadow-md data-[grid=true]:h-fit data-[grid=true]:w-full md:w-[275px]"
			>
				<Link
					href={`/art/${id}`}
					className="relative overflow-hidden h-full"
				>
					{loading === "loading" && (
						<Spinner containerClassName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
					)}
					{/* <Image
						alt={title}
						src={image}
						width={500}
						height={500}
						placeholder="empty"
						onError={(e) => {
							setLoading("loaded");
							e.target.remove();
						}}
						onLoad={() => setLoading("loaded")}
						data-loading={loading}
						className={`data-[loading=true]:bg-background_darkened object-cover max-h-[400px] min-h-[200px] w-full rounded-t group-data-[simple=true]:rounded bg-white ${className}`}
					/> */}

					<Image
						alt={title}
						src={image}
						width={500}
						height={0} //dynamic height
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
						placeholder="empty"
						onError={(e) => {
							setLoading("loaded");
							e.target.remove();
						}}
						onLoad={() => setLoading("loaded")}
						data-loading={loading}
						className={`data-[loading=true]:bg-background_darkened object-cover w-full rounded-t group-data-[simple=true]:rounded bg-white ${className} ${randomHeightClass}`}
					/>
				</Link>
				<div
					className={`flex h-fit flex-col gap-1 rounded-b-[20px] bg-white p-4 group-data-[simple=true]:hidden ${
						grid
							? "w-full"
							: "absolute bottom-0 w-[250px] md:w-[275px]"
					}`}
				>
					<Link
						href={`/art/${id}`}
						className="w-full h-full absolute top-0 left-0"
					/>
					{categories.length > 0 && (
						<div className="-translate-x-0.5">
							<TagCarousel
								tags={categories}
								tagClassName="h-fit text-sm"
							>
								{categories.map((catergory) => (
									<CategoryTag
										key={catergory.id}
										id={catergory.name}
										className="text-sm transition-all duration-200 ease-in-out text-primary hover:bg-primary"
									/>
								))}
							</TagCarousel>
						</div>
					)}

					<p className="font-bold z-0 text-wrap h-fit text-md text-black mb-1 pointer-events-none">
						{title}
					</p>

					<div className="flex items-center gap-2">
						<div
							className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${className}`}
						>
							<Image
								src={user?.profile}
								alt={user?.name || "null user"}
								width={100}
								height={100}
								className="w-full h-full"
								style={{ objectFit: "cover" }}
							/>
						</div>
						<div className="">
							<p className="text-[16px] text-black font-fraunces ">
								{user?.name || "null user"}
							</p>
							<p className="text-[12px] text-gray-500">
								Posted {date}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
