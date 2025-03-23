import React from "react";
import { useAuth } from "@/context/authContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function Edit() {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return null;
	}

	async function handleFormSubmit(e) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);

		const name = formData.get("username");
		const email = formData.get("email");
		const bio = formData.get("bio");
		const profilePic = formData.get("profilePic"); // File input

		// Update user profile
		const updatedUser = {
			name,
			email,
			bio,
		};

		// Update user in Firestore
		const userRef = doc(db, "users", currentUser.uid);
		await setDoc(userRef, updatedUser, { merge: true });

		console.log("Profile updated successfully!");

		// Handle file upload (if needed)
		if (profilePic && profilePic.size > 0) {
			console.log("Profile picture selected:", profilePic.name);
			// You need to upload the image to Firebase Storage (not handled here)
		}
	}

	return (
		<div className="max-w-[1280px] mx-auto px-4">
			<h3 className="text-center">Edit Profile</h3>
			<div className="my-8 w-[400px] mx-auto">
				<form onSubmit={handleFormSubmit} className="flex flex-col gap-4 w-full">
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
					<div className="flex space-between items-center">
						<label htmlFor="bio" className="w-[80px]">
							Bio
						</label>
						<input
							className="border border-gray-300 rounded-md p-2 text-gray-600 w-full"
							type="text"
							id="bio"
							name="bio"
							defaultValue={currentUser.bio}
						/>
					</div>
					<div className="flex gap-4">
						<label htmlFor="profilePic">Profile Picture</label>
						<input type="file" id="profilePic" name="profilePic" accept="image/*" />
					</div>
					<div className="flex justify-end">
						<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
