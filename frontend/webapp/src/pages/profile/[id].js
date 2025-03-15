import React, { useState, useEffect } from "react";
import Image from "next/image";
import pic from "../../../public/erik.png";
import ArtCard from "@/components/ArtCard";
import { useRouter } from "next/router";
import { db } from "@/firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";

export default function profile() {
	// ex of user object we will use from firebase**
	// const user = {
	// 	username: "EHansen100",
	// 	profilePic: pic,
	// 	themes: ["Nature", "Landscape", "Minimalism", "Urban", "Tranquility"],
	// };

	// // temp artData for testing
	// const artsData = [
	// 	{
	// 		id: 1,
	// 		title: "Sunset Over the Hills",
	// 		image: "/astro.jpg",
	// 		date: "2023-08-15",
	// 		categories: [
	// 			{ id: 1, name: "Nature" },
	// 			{ id: 3, name: "Landscape" },
	// 		],
	// 		user: {
	// 			id: 1,
	// 			name: user.username,
	// 			profile: user.profilePic,
	// 		},
	// 	},
	// 	{
	// 		id: 1,
	// 		title: "Urban Exploration",
	// 		image: "/abstract.jpg",
	// 		date: "2023-07-22",
	// 		categories: [
	// 			{ id: 2, name: "Minimalism" },
	// 			{ id: 4, name: "Urban" },
	// 		],
	// 		user: {
	// 			id: 1,
	// 			name: user.username,
	// 			profile: user.profilePic,
	// 		},
	// 	},
	// 	{
	// 		id: 3,
	// 		title: "Forest Tranquility",
	// 		image: "/forest.jpg",
	// 		date: "2023-06-10",
	// 		categories: [
	// 			{ id: 1, name: "Nature" },
	// 			{ id: 5, name: "Tranquility" },
	// 		],
	// 		user: {
	// 			id: 1,
	// 			name: user.username,
	// 			profile: user.profilePic,
	// 		},
	// 	},

	// 	{
	// 		id: 5,
	// 		title: "Mountain Majesty",
	// 		image: "/bunny.jpg",
	// 		date: "2023-04-18",
	// 		categories: [
	// 			{ id: 1, name: "Nature" },
	// 			{ id: 3, name: "Landscape" },
	// 		],
	// 		user: {
	// 			id: 1,
	// 			name: user.username,
	// 			profile: user.profilePic,
	// 		},
	// 	},
	// ];

	// const [arts, setArts] = useState(artsData);
	const [filter, setFilter] = useState("All");
	const [selectedOption, setSelectedOption] = useState("My Artwork");

	const filterArts = (theme) => {
		if (theme === "All") {
			setArts(artsData);
			setFilter("All");
		} else {
			const filteredArts = artsData.filter((art) => {
				const categories = art.categories.map(
					(category) => category.name
				);
				return categories.includes(theme);
			});
			setArts(filteredArts);
			setFilter(theme);
		}
	};

	const router = useRouter();
	const { id } = router.query;
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { currentUser } = useAuth();

	useEffect(() => {
		if (!id) return; // Prevent unnecessary Firestore queries

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

	console.log(user);

	if (loading) return <p>Loading...</p>;
	if (!user) return <p>User not found</p>;

	return (
		<div className="max-w-[1280px] mx-auto px-4">
			<div className="flex gap-6 justify-center items-center">
				{/*User profile pic Desktop*/}
				<Image
					className="rounded-full w-[164px] h-[164px] md:flex hidden object-cover"
					src={user.profileImage}
					alt="alt text"
					width={500}
					height={500}
				/>
				<div className="flex flex-col py-4 w-full">
					<div>
						<h2 className="font-fraunces leading-9">{user.name}</h2>
						<p>{user.bio}</p>

						{/* Edit Profile link will only render if currentUser = profile/user */}
						{currentUser.email === user.email && (
							<a
								className="font-roboto text-[16px] text-gray-700 pl-1 hover:underline hover:cursor-pointer"
								href="/profile/edit"
							>
								Edit profile
							</a>
						)}
					</div>
					{/*Themes - users most common themes? can also serve as filtering for their artworks maybe.*/}
					<div className="flex flex-row justify-between pt-4">
						<div className="flex flex-wrap gap-2">
							<button
								className={` ${
									filter === "All"
										? "font-roboto text-[18px] border-2 border-black"
										: "font-roboto text-[18px] border-2 border-transparent"
								}`}
								onClick={() => filterArts("All")}
							>
								All
							</button>
							{/* {user.themes.map((theme, index) => (
								<button
									key={index}
									className={` ${
										filter === theme
											? "font-roboto text-[18px] border-2 border-black"
											: "font-roboto text-[18px] border-2 border-transparent"
									}`}
									onClick={() => filterArts(theme)}
								>
									{theme}
								</button>
							))} */}
						</div>
						{/*Only if you are the user*/}
						{/* <button className="btnRev h-fit">My Saved</button> */}
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
				{/* {arts.map((art, index) => (
					<div key={index} className="w-[300px]">
						<ArtCard art={art} grid={true} />
					</div>
				))} */}
			</div>
		</div>
	);
}
