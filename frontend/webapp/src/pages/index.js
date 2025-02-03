import React from "react";

export default function index() {
	return (
		<>
			<div>
				<h1>Header 1 - Fraunces</h1>
				<h2>Header 2 - Fraunces</h2>
				<h3>Header 3 - Fraunces</h3>
				<h4>Header 4 - Fraunces</h4>
				<p>
					A bunch of Roboto Body Text, A bunch of Roboto Body Text, A
					bunch of Roboto Body Text, A bunch of Roboto Body Text,{" "}
				</p>
				<div className="flex gap-4 p-2">
					<button className="bg-red text-white font-fraunces">
						Explore
					</button>
					<button className="bg-blue text-white font-fraunces">
						Start Sketching
					</button>
				</div>
			</div>
		</>
	);
}
