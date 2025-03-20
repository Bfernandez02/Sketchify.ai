import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { db } from "@/firebase/config";
import {
	getDoc,
	doc,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import ArtCard from "@/components/ArtCard";

export default function Profile() {
	const [filter, setFilter] = useState("All");
	const [selectedOption, setSelectedOption] = useState("My Artwork");
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState([]); // Store user's posts

	const router = useRouter();
	const { id } = router.query;
	const { currentUser } = useAuth();

	// Fetch user data
	useEffect(() => {
		if (!id) return;

		const fetchUser = async () => {
			setLoading(true);
			try {
				const userDoc = await getDoc(doc(db, "users", id));
				if (userDoc.exists()) {
					setUser(userDoc.data());
				} else {
					console.error("User not found");
				}
			} catch (error) {
				console.error("Error fetching user:", error);
			}
			setLoading(false);
		};

		fetchUser();
	}, [id]);

	// Fetch user's posts from posts userID field
	useEffect(() => {
		if (!id) return;

		const fetchUserPosts = async () => {
			try {
				const postsRef = collection(db, "posts");
				const q = query(postsRef, where("userID", "==", id));
				const postSnap = await getDocs(q);
				setPosts(
					postSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};

		fetchUserPosts();
	}, [id]);

	console.log(posts);

	if (loading) return <p>Loading...</p>;
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
					<div>
						<h2 className="font-fraunces leading-9">{user.name}</h2>
						<p>{user.bio}</p>

						{currentUser?.email === user.email && (
							<a
								className="font-roboto text-[16px] text-gray-700 pl-1 hover:underline hover:cursor-pointer"
								href="/profile/edit"
							>
								Edit profile
							</a>
						)}
					</div>
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
