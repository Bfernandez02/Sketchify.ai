import React from "react";
import { NextSeo } from "next-seo";
import SketchPad from "@/components/SketchPad";
import pencil from "../../public/pencil.png";
import { useAuth } from "@/context/authContext";

export default function Sketch() {
	const user = useAuth();

	if (user.userLoggedIn === false) {
		return (
			<div className="flex flex-col items-center h-[75vh] pt-24">
				<h1 className="text-5xl font-fraunces font-bold mb-8">
					Log in to get started with Sketchify
				</h1>
				<a href="/sign-in" className="btn">
					Log in
				</a>
			</div>
		);
	}

	return (
		<>
			<NextSeo title="Sketch | Sketchify" />
			<div className="flex flex-col items-center px-4 py-8">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row items-center justify-center w-full space-y-6 md:space-y-0 md:space-x-10">
					<div className="w-full md:w-1/2">
						<h1 className="font-fraunces text-center text-3xl md:text-6xl">
							Sketch, Enhance, and Create. Bring Your Ideas to
							Life.
						</h1>
					</div>
					<img
						className="w-40 h-40 md:w-48 md:h-48"
						src={pencil.src}
						alt="Pencil"
					/>
				</div>
				{/* SketchPad Section */}
				<div className="w-full mt-8">
					<SketchPad />
				</div>
			</div>
		</>
	);
}
