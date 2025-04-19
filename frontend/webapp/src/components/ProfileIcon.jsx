import React from "react";
import handleLogout from "@/firebase/handleLogout";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProfileIcon({ user }) {
	const [profileDropdown, setProfileDropdown] = useState(false);
	const profilePicture = user?.profileImage;
	let parsed = "";

	if (user?.name) {
		parsed = user?.name
			.split(" ")
			.map((n) => n[0])
			.join("");
	}

	return (
		<div className=" w-fit">
			{user && (
				<div className="relative">
					<button
						className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
						onClick={() => setProfileDropdown(!profileDropdown)}
					>
						{!profilePicture ? (
							parsed === "" ? (
								<i className="fa-solid fa-user text-xl text-gray-500"></i>
							) : (
								parsed
							)
						) : (
							<Image
								src={profilePicture}
								className="rounded-full max-w-12"
								layout="fill"
							/>
						)}
					</button>
					{profileDropdown && (
						<div className="absolute md:right-0 -right-24 top-14 rounded-lg border border-gray-200 bg-white shadow">
							<ul className="flex flex-col gap-2 p-3">
								<li className="flex max-w-[250px] flex-col">
									<span>Signed in as : </span>
									<span className="truncate text-sm md:text-base font-semibold">
										{user?.email}
									</span>
								</li>
								<hr />
								{user?.name && (
									<li className="rounded p-1 px-2 hover:text-secondary">
										<Link
											href={`/profile/${user.uid}`}
											className=" text-[16px] md:text-[18px] lg:text-[20px]"
											onClick={() =>
												setProfileDropdown(
													!profileDropdown
												)
											}
										>
											Profile
										</Link>
									</li>
								)}
								<li className="rounded  hover:text-secondary">
									<button
										className="flex size-full items-start text-[16px] md:text-[18px]"
										onClick={handleLogout}
									>
										Logout
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
