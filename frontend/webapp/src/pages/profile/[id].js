import React from "react";
import Image from "next/image";
import pic from "../../../public/erik.png";

export default function profile() {
	// ex of user object we will use from firebase**
	const user = {
		username: "EHansen100",
		profilePic: pic,
		themes: ["Surrealism", "Abstract", "Cartoon"],
		// artworks: [artwork1, artwork2, artwork3]
	};

	return (
		<div className="content-container">
			<div className="flex gap-6">
				<Image
					className="rounded-full"
					src={user.profilePic}
					alt="alt text"
					width={200}
					height={200}
				/>
				<div className="flex flex-col py-4 justify-between w-full">
					<div>
						<h2 className="font-fraunces leading-9">
							{user.username}
						</h2>
						{/**Edit only if you are the user**/}
						<a className="font-roboto text-[16px] text-gray-700 pl-1 hover:underline hover:cursor-pointer">
							Edit profile
						</a>
					</div>
					{/*Themes - users most common themes? can also serve as filtering for their artworks maybe.*/}
					<div className="flex flex-row justify-between">
						<div className="flex flex-wrap gap-2">
							{user.themes.map((theme, index) => (
								<button key={index} className="btn">
									{theme}
								</button>
							))}
						</div>
						{/*Only if you are the user*/}
						<button className="btnRev">My Saved</button>
					</div>
				</div>
			</div>

			<h2 className="pt-12 font-fraunces">Artwork</h2>
			<div className="grid grid-cols-3 gap-4">
				{/* Use Cards here
                
                {user.artworks.map((artwork, index) => (
                    <Artwork key={index} artwork={artwork} />
                ))} */}
			</div>
		</div>
	);
}
