import React from "react";
import Image from "next/image";
import pencil from "../../public/pencil.png";
import nodes from "../../public/nodes.png";
import upload from "../../public/upload.png";

export default function Overview() {
	return (
		<div className="flex flex-col gap-2 px-8">
			<h1 className="text-center"> Where Creativity Meets Simplicity</h1>
			<div className="flex md:flex-row flex-col justify-center items-center gap-36">
				<h4 className="w-[350px]">
					<b>Sketch your idea</b> <br /> Start from scratch or upload
					an existing sketch.
				</h4>
				<Image src={pencil} alt="Pencil" width={350} height={350} />
			</div>
			<div className="flex md:flex-row flex-col-reverse justify-center items-center gap-36 text-right">
				<Image src={nodes} alt="Nodes" width={300} height={300} />
				<h4 className="w-[350px]">
					<b>AI-Powered Enhancements</b> <br /> Let Sketchify's
					advanced AI transform your work into polished art.
				</h4>
			</div>
			<div className="flex md:flex-row flex-col justify-center items-center gap-36">
				<h4 className="w-[350px]">
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
