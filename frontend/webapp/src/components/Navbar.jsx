import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Spin as Hamburger } from "hamburger-react";

export default function Navbar() {
	const router = useRouter();
	const [mobileIsOpen, setMobileIsOpen] = useState(false);

	const menuItems = [
		{ name: "Home", path: "/" },
		{ name: "Sketch", path: "/sketch" },
		{ name: "Explore", path: "/explore" },
		{ name: "Contact", path: "/contact" },
	];

	return (
		<>
			<div className="hidden md:flex justify-between items-center px-8 lg:px-10 py-4 z-10 sticky top-0 bg-background">
				<Link
					className="hidden md:flex font-italianno lg:text-5xl text-4xl"
					href="/"
				>
					Sketchify
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-4 lg:space-x-8 font-fraunces font-normal text-xl lg:text-2xl uppercase">
					{menuItems.map(({ name, path }) => (
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
						className="bg-blue text-white px-3 py-2 lg:px-4 lg:py-2 rounded-[20px] hover:bg-red transition-all duration-100"
					>
						Login
					</Link>
				</nav>
			</div>

			<div className="flex justify-end sticky top-0 p-4">
				{/* Mobile Navigation */}
				<div className="md:hidden z-[21]">
					<Hamburger
						toggled={mobileIsOpen}
						toggle={setMobileIsOpen}
						size={25}
						color="black"
						duration={0.5}
					/>
				</div>

				{/* Mobile Menu Overlay */}
				{/* MOBILE NAV MENU */}
				<nav
					aria-description="Mobile Navbar"
					className={`bg-background fixed right-0 top-0 z-[20] flex text-center h-screen w-screen origin-top-right flex-col gap-8 px-10 pt-28 transition-all md:hidden max-h-screen overflow-y-scroll ${
						mobileIsOpen
							? "visible scale-100 opacity-100"
							: "invisible scale-0 opacity-0"
					}
                `}
				>
					<Link href="/" className="text-5xl font-italianno pb-8">
						Sketchify
					</Link>
					{menuItems.map(({ name, path }) => (
						<Link
							onClick={() => setMobileIsOpen(false)}
							key={path}
							href={path}
							className={`${
								router.pathname === path
									? "underline font-fraunces uppercase text-3xl"
									: "text-black font-fraunces uppercase text-3xl"
							}`}
						>
							{name}
						</Link>
					))}
					<Link
						onClick={() => setMobileIsOpen(false)}
						href="/sign-in"
						className="bg-blue font-fraunces uppercase text-3xl w-fit mx-auto text-white px-8 py-2 lg:px-4 lg:py-2 rounded-[20px] hover:bg-red transition-all duration-100"
					>
						Login
					</Link>
				</nav>
			</div>
		</>
	);
}
