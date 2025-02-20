import React from "react";
import Image from "next/image";
import pencil from "../../public/pencil.png";
import nodes from "../../public/nodes.png";
import upload from "../../public/upload.png";

export default function Overview() {
	return (
		<div className="flex flex-col md:gap-2 gap-8 px-8 md:pt-0 pt-20">
			<h1 className="text-center md:text-[3rem] text-[28px] font-bold">
				{" "}
				Where Creativity Meets Simplicity
			</h1>
			<div className="flex md:flex-row flex-col justify-center items-center md:gap-36">
				<h4 className="md:w-[350px] w-fit md:text-left text-center">
					<b>Sketch your idea</b> <br /> Start from scratch or upload
					an existing sketch.
				</h4>
				<Image src={pencil} alt="Pencil" width={350} height={350} />
			</div>
			<div className="flex md:flex-row flex-col-reverse justify-center items-center md:gap-36 md:text-right text-center">
				<Image src={nodes} alt="Nodes" width={300} height={300} />
				<h4 className="md:w-[350px] w-fit">
					<b>AI-Powered Enhancements</b> <br /> Let Sketchify's
					advanced AI transform your work into polished art.
				</h4>
			</div>
			<div className="flex md:flex-row flex-col justify-center items-center md:gap-36">
				<h4 className="md:w-[350px] w-fit md:text-left text-center">
					<b>Save & Share</b>
					<br />
					Save your creations to your profile and share them with
					friends, family, or the Sketchify community.
				</h4>
				<Image src={upload} alt="upload" width={350} height={350} />
			</div>
		</div>
	);
}
