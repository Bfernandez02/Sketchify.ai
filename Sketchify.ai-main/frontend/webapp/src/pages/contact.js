import React from "react";
import { NextSeo } from "next-seo";
import Contact from "@/components/Contact";

export default function contact() {
	return (
		<>
			<NextSeo title="Contact | Sketchify" />

			<div className="content-container">
				<Contact />
			</div>





		</>
	);
}
