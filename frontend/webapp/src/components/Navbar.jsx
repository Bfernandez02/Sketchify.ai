import Link from "next/link";
import React from "react";

export default function Navbar() {
	return (
		<>
			<div className="flex justify-between items-center px-10 py-4">
				<div className="font-italianno text-5xl">Sketchify</div>
				<nav className="flex items-center space-x-8 font-fraunces font-normal text-2xl uppercase">
					<Link href="/"> Home </Link>
					<Link href="/sketch"> Sketch </Link>
					<Link href="/explore"> Explore </Link>
					<Link href="/contact"> Contact </Link>
					<Link
						href="/sign-in"
						className="bg-blue text-white px-4 py-2  rounded-[20px]"
					>
						Login
					</Link>
				</nav>
			</div>
		</>
	);
}
