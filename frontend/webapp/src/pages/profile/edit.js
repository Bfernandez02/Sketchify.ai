import React from "react";
import { useAuth } from "@/context/authContext";
import { redirect } from "next/dist/server/api-utils";

export default function Edit() {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return null;
	}


	return (
		<div className="max-w-[1280px] mx-auto px-4">
			<h3 className="text-center">Edit Profile</h3>
			<div className="my-8 w-[400px] mx-auto">
				<form className="flex flex-col gap-4 w-full">
					<div className="flex space-between items-center">
						<label htmlFor="username" className="w-[80px]">
							Name
						</label>
						<input
							className="border border-gray-300 rounded-md p-2 text-gray-600 w-full"
							type="text"
							id="username"
							name="username"
							defaultValue={currentUser.name}
						/>
					</div>
					<div className="flex space-between items-center">
						<label htmlFor="email" className="w-[80px]">
							Email
						</label>
						<input
							className="border border-gray-300 rounded-md p-2 text-gray-600 w-full"
							type="email"
							id="email"
							name="email"
							defaultValue={currentUser.email}
						/>
					</div>
					<div className="flex gap-4">
						<label htmlFor="profilePic">Profile Picture</label>
						<input
							type="file"
							id="profilePic"
							name="profilePic"
							accept="image/*"
						/>
					</div>
					<div className="flex justify-end">
						<button type="submit">Save</button>
					</div>
				</form>
			</div>
		</div>
	);
}
