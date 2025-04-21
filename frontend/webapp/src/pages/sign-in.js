import React, { useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import toast from "react-hot-toast";
import { validateSignInForm } from "@/utils/authUtils";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, googleProvider, db } from "@/firebase/config";

export default function SignIn() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);

	// ✅ Toggle Password Visibility
	const togglePasswordVisibility = (id) => {
		const input = document.getElementById(id);
		input.type = input.type === "password" ? "text" : "password";
	};

	// ✅ Handle Email/Password Sign-In
	const handleEmailSignIn = async () => {
		if (!validateSignInForm(formData)) return;
		setLoading(true);
		try {
			await signInWithEmailAndPassword(
				auth,
				formData.email,
				formData.password
			);
			toast.success("Signed in successfully!");
			window.location.href = "/"; // Redirect after login
		} catch (error) {
			toast.error(error.message);
		}
		setLoading(false);
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;

			// Check if this is a new user by looking up their document in Firestore
			const userRef = doc(db, "users", user.uid);
			const userDoc = await getDoc(userRef);

			if (!userDoc.exists()) {
				const userData = {
					uid: user.uid,
					name: user.displayName || "",
					email: user.email,
					bio: "",
					profileImage: user.photoURL || "",
					bannerImage: "",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				await setDoc(userRef, userData);
				toast.success("Welcome to Sketchify!");
			} else {
				toast.success("Welcome back!");
			}

			window.location.href = "/";
		} catch (error) {
			console.error("Google sign-in error:", error);
			toast.error(error.message);
		}
		setLoading(false);
	};

	return (
		<div className="mb-[120px]">
			<NextSeo
				title="Sign In | Sketchify"
				description="Sign in to Sketchify to start creating and sharing your art."
			/>

			<div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto p-4">
				<h2 className="font-fraunces md:text-7xl text-5xl">
					Welcome Back <br /> Let&apos;s Get Creative!
				</h2>
				<img
					className="md:w-[360px] w-[300px]"
					src={"/signupArt.png"}
					alt="exploreArt"
				/>
			</div>

			<div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto rounded-[20px] bg-white">
				<div className="w-full px-[20px] lg:px-[80px] xl:px-[160px] py-[60px]">
					<h2 className="font-fraunces md:text-7xl text-5xl text-center mb-[20px]">
						Sign In
					</h2>

					{/* ✅ Google Sign-In Button */}
					<div className="flex gap-2 items-center">
						<button
							className="btn w-full flex items-center justify-center gap-2"
							onClick={handleGoogleSignIn}
							disabled={loading}
						>
							<i className="fa-brands fa-google fa-lg"></i>
							{loading ? "Signing In..." : "Sign in with Google"}
						</button>
					</div>

					<div className="flex gap-2 items-center">
						<div className="flex items-center justify-between h-[1px] w-full bg-slate-400"></div>
						<span className="text-slate-400">or</span>
						<div className="flex items-center justify-between h-[1px] w-full bg-slate-400"></div>
					</div>

					{/* ✅ Email Input */}
					<label htmlFor="email" className="text-primary">
						Email <span className="text-red-600">*</span>
					</label>
					<div className="flex items-center justify-between border border-primary rounded-md p-2 h-[42px]">
						<input
							type="email"
							placeholder="email"
							id="email"
							className="focus:outline-none text-primary font-roboto w-full bg-transparent"
							required
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
						/>
						<i className="fa-solid fa-envelope text-primary w-fit text-[18px] " />
					</div>

					{/* ✅ Password Input */}
					<div className="flex flex-col gap-2 mt-4">
						<label htmlFor="password" className="text-primary">
							Password <span className="text-red-600">*</span>
						</label>
						<div className="flex items-center justify-between border border-primary rounded-md px-2 h-[42px]">
							<i className="fa-solid fa-lock text-primary w-fit text-[16px] mr-2 " />
							<input
								type="password"
								placeholder="password"
								id="password"
								required
								className="focus:outline-none text-primary font-roboto w-full bg-transparent"
								onChange={(e) =>
									setFormData({
										...formData,
										password: e.target.value,
									})
								}
							/>
							<button
								className="p-0"
								onClick={() =>
									togglePasswordVisibility("password")
								}
							>
								<i className="fa-solid fa-eye text-gray-400 text-[18px] " />
							</button>
						</div>
					</div>

					{/* ✅ Sign-In Button */}
					<button
						className="btnRev w-full my-4 md:my-6"
						onClick={handleEmailSignIn}
						disabled={loading}
					>
						{loading ? "Signing In..." : "Sign In"}
					</button>

					<p className="text-primary text-center">
						Don't have an account?{" "}
						<Link href="/sign-up" className="text-secondary">
							Sign Up
						</Link>
					</p>
				</div>

				<div className="md:grid grid-cols-2 w-full hidden rounded-r-[20px] overflow-clip">
					<img
						src="/astro.jpg"
						alt="signinArt"
						className=" h-[300px] object-cover"
					/>
					<img
						src="/bunny.jpg"
						alt="signinArt"
						className=" h-[300px] object-cover"
					/>
					<img
						src="/abstract.jpg"
						alt="signinArt"
						className=" h-[300px] object-cover"
					/>
					<img
						src="/forest.jpg"
						alt="signinArt"
						className=" h-[300px] object-cover"
					/>
				</div>
			</div>
		</div>
	);
}
