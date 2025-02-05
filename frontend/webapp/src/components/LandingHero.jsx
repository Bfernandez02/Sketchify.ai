import React from "react";
import Image from "next/image";
import painters from "../../public/painters.png";

export default function LandingHero() {
	return (
		<>
			<div className="flex justify-center pt-8">
				<div className="flex flex-col w-full pt-4 pl-8">
					<h1 className="font-fraunces text-8xl ">
						From Sketch to Stunning <br /> – Powered by AI.
					</h1>
					<h4 className="font-fraunces text-2xl mt-4">
						Start sketching and bring your ideas to life!
						<br /> Let your creativity flow and see where it takes
						you!
					</h4>
				</div>
				<div className="w-[800px]">
					<img src={painters.src} alt="painters" />
				</div>
			</div>
		</>
	);
}
