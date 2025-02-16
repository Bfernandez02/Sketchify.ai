import React from "react";
import { NextSeo } from "next-seo";
import SketchPad from "@/components/SketchPad";

export default function sketch() {
	return (
		<>
			<NextSeo title="Sketch | Sketchify" />
			<div className="content-container ">
				<h1 className="font-fraunces"> Sketch, Enhance, and Create, Bring Your Ideas to Life</h1>
				<SketchPad/>
			</div>
		</>
	);
}
