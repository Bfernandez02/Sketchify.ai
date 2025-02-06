import React from "react";
import painters from "../../public/painters.png";

export default function LandingHero() {
	return (
		<>
			<div className="content-container flex flex-col md:flex-row justify-center pt-8 md:text-left text-center md:px-0 px-8">
				<div className="flex flex-col w-full pt-4 md:pl-8 pl-0">
					<h1 className="font-fraunces xl:text-8xl md:text-7xl text-5xl ">
						From Sketch to Stunning <br /> – Powered by AI.
					</h1>
					<h4 className="font-fraunces text-2xl mt-6">
						Start sketching and bring your ideas to life!
						<br /> Let your creativity flow and see where it takes
						you!
					</h4>
					<div className="flex md:flex-row gap-4 pt-8 md:justify-start justify-center flex-col ">
						<button className="bg-red text-white font-fraunces text-2xl rounded-[20px]">
							Explore
						</button>
						<button className="bg-blue text-white font-fraunces text-2xl rounded-[20px]">
							Start Sketching
						</button>
					</div>
				</div>
				<div className="md:w-[860px] w-[100%]">
					<img
						className="object-cover"
						src={painters.src}
						alt="painters"
					/>
				</div>
			</div>
		</>
	);
}
