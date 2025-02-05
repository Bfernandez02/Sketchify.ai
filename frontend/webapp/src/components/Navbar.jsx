import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
	const router = useRouter();

	return (
		<div className="flex justify-between items-center px-8 lg:px-10 py-4 z-10 sticky top-0 bg-background">
			<Link className="font-italianno lg:text-5xl text-4xl" href="/">
				Sketchify
			</Link>
			<nav className="flex items-center space-x-4 lg:space-x-8 font-fraunces font-normal text-xl lg:text-2xl uppercase">
				{[
					{ name: "Home", path: "/" },
					{ name: "Sketch", path: "/sketch" },
					{ name: "Explore", path: "/explore" },
					{ name: "Contact", path: "/contact" },
				].map(({ name, path }) => (
					<Link
						key={path}
						href={path}
						className={`${
							router.pathname === path
								? "underline"
								: "text-black hover:underline"
						}`}
					>
						{name}
					</Link>
				))}
				<Link
					href="/sign-in"
					className="bg-blue text-white px-3 py-2 lg:px-4 lg:py-2 rounded-[20px] hover:bg-red tranisition-all duration-200"
				>
					Login
				</Link>
			</nav>
		</div>
	);
}
