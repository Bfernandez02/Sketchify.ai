import React from "react";
import Image from "next/image";
import pic from "../../../public/erik.png";
import wand from "../../../public/wand.svg";
import sketch from "../../../public/drawing.png";
import enhanced from "../../../public/drawingEnh.png";

export default function art() {
	// example of art object we will use from firebase**
	const art = {
		id: 1,
		title: "Swing hanging from tree on a beach, during a sunset",
		categories: [{ id: 1, name: "Surrealism" }],
		user: [{ username: "EHansen100" }, { profilePic: pic }],
		date: "2023-08-15",
		original: sketch,
		enhanced: enhanced,
	};

	return (
		<div className="content-container">
			<div className="flex justify-between">
				<h2>{art.title}</h2>
			</div>
		</div>
	);
}
