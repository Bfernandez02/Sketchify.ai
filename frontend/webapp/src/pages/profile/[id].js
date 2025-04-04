import React, { useState } from "react";
import Image from "next/image";
import { db } from "@/firebase/config";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import ArtCard from "@/components/ArtCard";

export async function getServerSideProps(context) {
	const { id } = context.params;

	let user = null;
	let posts = [];

	try {
		// Fetch user data
		const userDoc = await getDoc(doc(db, "users", id));
		if (userDoc.exists()) {
			user = { id: userDoc.id, ...userDoc.data() };
		}

		// Fetch user's posts
		const postsRef = collection(db, "posts");
		const q = query(postsRef, where("userID", "==", id));
		const postSnap = await getDocs(q);
		posts = postSnap.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
				createdAt: data.createdAt?.toDate().toISOString() || null, // Convert Firestore Timestamp
				postedAt: data.postedAt?.toDate().toISOString() || null,  // Ensure all timestamps are converted
			};
		});
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	return {
		props: {
			user,
			posts,
		},
	};
}


export default function Profile({ user, posts }) {
	const [selectedOption, setSelectedOption] = useState("My Artwork");
	const { currentUser } = useAuth();

	if (!user) return <p>User not found</p>;

	return (
		<div className="max-w-[1280px] mx-auto px-4">
			<div className="flex gap-6 justify-center items-center">
				<Image
					className="rounded-full w-[164px] h-[164px] md:flex hidden object-cover"
					src={user.profileImage}
					alt="Profile picture"
					width={500}
					height={500}
				/>
				<div className="flex flex-col py-4 w-full">
					<h2 className="font-fraunces leading-9">{user.name}</h2>
					<p>{user.bio}</p>
					{currentUser?.email === user.email && (
						<a className="font-roboto text-[16px] text-gray-700 pl-1 hover:underline hover:cursor-pointer" href="/profile/edit">
							Edit profile
						</a>
					)}
				</div>
			</div>

			<div className="flex justify-between items-center pt-12">
				<h2 className="font-fraunces">Artwork</h2>
				<select
					className="bg-transparent border border-black rounded pr-2 py-2 cursor-pointer focus:outline-none text-left"
					value={selectedOption}
					onChange={(e) => setSelectedOption(e.target.value)}
				>
					<option value="My Artwork">My Artwork</option>
					<option value="My Saved">Favourites</option>
				</select>
			</div>

			<div className="flex flex-wrap gap-4 mb-4">
				{posts.length === 0 ? (
					<p>No artwork posted yet.</p>
				) : (
					posts.map((post) => (
						<div key={post.id} className="w-[300px]">
							<ArtCard art={post} grid={true} />
						</div>
					))
				)}
			</div>
		</div>
	);
}