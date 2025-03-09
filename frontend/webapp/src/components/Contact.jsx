import React, { useState } from "react";
import Image from "next/image";
import stroke from "../../public/stroke.png";
import brushes from "../../public/brushes.png";
import abstract from "../../public/abstract.jpg";
import astro from "../../public/astro.jpg";
import bunny from "../../public/bunny.jpg";
import cake from "../../public/cake.jpg";
import forest from "../../public/forest.jpg";
import Contact_Person from "../../public/Contact_Person.png";
import Phone from "../../public/Phone.png";
import Mail from "../../public/Mail.png";
import Location from "../../public/Location.png";
import Plane from "../../public/Plane.png";
import Link from "next/link";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		email: "",
		subject: "",
		message: "",
	});
	const [status, setStatus] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus("Sending...");

		const { name, email, message, phone, subject } = formData;

		try {
			await addDoc(collection(db, "contacts"), {
				name,
				email,
				message,
				phone,
				subject,
			});

			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			// const data = await response.json();
			// console.log(data);

			if (response.ok) {
				setStatus("Message sent successfully!");
				setFormData({
					name: "",
					phone: "",
					email: "",
					subject: "",
					message: "",
				});
			} else {
				setStatus("Failed to send message.");
			}
		} catch (error) {
			setStatus("An error occurred while sending the message.");
		}
	};

	return (
		<div>
			<link
				href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
				rel="stylesheet"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Fraunces&display=swap"
				rel="stylesheet"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"
				rel="stylesheet"
			/>

			<div className="w-full flex flex-wrap">
				{/* Left Section */}
				<div className="w-full md:w-2/3 p-5 flex items-center justify-start">
					<h1 className="font-fraunces xl:text-8xl md:text-7xl text-5xl">
						Have Questions? <br /> Get in Touch With Us!
					</h1>
				</div>

				{/* Right Section */}
				<div className="w-full md:w-1/3 text-center">
					<Image
						src={Contact_Person.src}
						alt="Contact Image"
						width={400}
						height={520}
						className="mx-auto"
					/>
				</div>
			</div>

			<div className="w-full flex flex-wrap bg-[#f8f6eb] p-5 rounded-lg mt-5 mb-[100px]">
				{/* Left Section */}
				<div className="w-full md:w-[35%] bg-[#2e3547] p-10 text-white rounded-tl-lg rounded-bl-lg mb-5">
					<h2 className="font-playfair text-4xl mb-10">Contact Us</h2>

					<p className="flex items-center mb-8 text-md xl:text-xl pl-0 lg:pl-10">
						<Image
							src={Phone}
							alt="Phone"
							width={20}
							height={20}
							className="object-contain mr-4 lg:mr-8"
						/>
						(123) 456-7890
					</p>

					<p className="flex items-center mb-8 text-md xl:text-xl pl-0 lg:pl-10">
						<Image
							src={Mail}
							alt="Mail"
							width={20}
							height={20}
							className="object-contain mr-4 lg:mr-8"
						/>
						<a
							href="mailto:placeholder@email.com"
							className="text-white"
						>
							placeholder@email.com
						</a>
					</p>

					<p className="flex items-center mb-8 text-md xl:text-xl pl-0 lg:pl-10">
						<Image
							src={Location}
							alt="Location"
							width={20}
							height={20}
							className="object-contain mr-4 lg:mr-8"
						/>
						123 placeholder drive, city, province, postal code
					</p>

					<div className="flex flex-col lg:flex-row pt-3 gap-x-6 gap-4 items-start lg:items-center">
						<Link
							href={"/team"}
							className="text-[18px] hover:underline"
						>
							OUR TEAM
						</Link>
						<div className="flex gap-4">
							<i className="fa-brands fa-facebook text-secondary fa-2x"></i>
							<i className="fa-brands fa-twitter text-primary text-xl bg-secondary rounded-full flex items-center justify-center w-[34px] h-[34px]"></i>
							<i className="fa-brands fa-pinterest-p text-primary text-xl bg-secondary rounded-full flex items-center justify-center w-[34px] h-[34px]"></i>
							<i className="fa-brands fa-instagram text-primary text-xl bg-secondary rounded-full flex items-center justify-center w-[34px] h-[34px]"></i>
						</div>
					</div>
				</div>

				{/* Right Section */}
				<div className="w-full md:w-[65%] p-6 mt-5">
					<form onSubmit={handleSubmit}>
						<div className="flex gap-5 mb-4 flex-wrap">
							<input
								type="text"
								placeholder="Full Name"
								className="flex-1 p-4 text-lg"
								name="name"
								value={formData.name}
								onChange={handleChange}
							/>
							<input
								type="text"
								placeholder="Phone Number"
								className="flex-1 p-4 text-lg"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>

						<div className="flex gap-5 mt-4 mb-4 flex-wrap">
							<input
								type="email"
								placeholder="Mail"
								className="flex-1 p-4 text-lg"
								name="email"
								value={formData.email}
								onChange={handleChange}
							/>
							<input
								type="text"
								placeholder="Subject"
								className="flex-1 p-4 text-lg"
								name="subject"
								value={formData.subject}
								onChange={handleChange}
							/>
						</div>

						<textarea
							placeholder="Message"
							className="w-full h-[150px] mt-4 p-4 text-lg"
							name="message"
							value={formData.message}
							onChange={handleChange}
						></textarea>

						<div className="text-center mt-4">
							<button
								type="submit"
								className="bg-[#d57c56] text-white py-5 px-24 mt-5 border-none cursor-pointer text-2xl font-playfair flex items-center"
							>
								Send Message
								<img
									src={Plane.src}
									alt="Plane"
									width={20}
									height={20}
									className="ml-4"
								/>
							</button>
						</div>
					</form>

					{/* Status message */}
					{status && (
						<p className="mt-4 text-center text-xl">{status}</p>
					)}
				</div>
			</div>
		</div>
	);
}
