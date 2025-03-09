import React from "react";
import Link from "next/link";

export default function Step1({ formData, setFormData, handleNextStep }) {
	const togglePasswordVisibility = (id) => {
		const input = document.getElementById(id);
		if (input.type === "password") {
			input.type = "text";
		} else {
			input.type = "password";
		}
	};
	return (
		<div className="flex flex-col gap-2">
			<h2 className="font-fraunces md:text-7xl text-5xl text-center">
				Sign Up
			</h2>

			<div className="flex flex-col gap-2 mt-4">
				<label htmlFor="email" className="text-primary">
					Email <span className="text-red-600">*</span>
				</label>
				<div className="flex items-center justify-between border border-primary rounded-md p-2">
					<input
						type="email"
						placeholder="email"
						id="email"
						className="focus:outline-none text-primary font-roboto w-full bg-transparent text-[16px]"
						maxLength={40}
						required
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
					/>
					<i className="fa-solid fa-envelope text-primary w-fit text-[18px] " />
				</div>
			</div>

			<div className="flex flex-col gap-2 mt-4">
				<label htmlFor="password" className="text-primary">
					Password <span className="text-red-600">*</span>
				</label>
				<div className="flex items-center justify-between border border-primary rounded-md px-2 h-[42px]">
					<i className="fa-solid fa-lock text-primary w-fit text-[16px] mr-2" />
					<input
						type="password"
						placeholder="password"
						id="password"
						maxLength={30}
						required
						value={formData.password}
						className="focus:outline-none text-primary font-roboto w-full bg-transparent text-[16px]"
						onChange={(e) =>
							setFormData({
								...formData,
								password: e.target.value,
							})
						}
					/>
					<button
						className="p-0"
						onClick={() => togglePasswordVisibility("password")}
					>
						<i className="fa-solid fa-eye text-gray-400 text-[18px] " />
					</button>
				</div>
			</div>

			{
				// If we are not focussed on the Password Inputs, and all checks pass we can hide the formatting
				<ul
					className={`list-inside list-none text-tertiary text-[14px] font-roboto text-primary`}
				>
					<label className="">Password must contain:</label>

					<li className={`flex items-center gap-x-2`}>
						{formData.password.length < 8 ? (
							<i className="text-red-500 fa-solid fa-xmark"></i>
						) : (
							<i className=" text-green-500 fa-solid fa-check"></i>
						)}
						<p>At least 8 characters</p>
					</li>
					<li className={`flex items-center gap-x-2`}>
						{/[A-Z]/.test(formData.password) ? (
							<i className="text-green-500 fa-solid fa-check"></i>
						) : (
							<i className=" text-red-500 fa-solid fa-xmark"></i>
						)}
						<p>At least 1 uppercase letter</p>
					</li>
					<li className={`flex items-center gap-x-2`}>
						{/[a-z]/.test(formData.password) ? (
							<i className="text-green-500 fa-solid fa-check"></i>
						) : (
							<i className=" text-red-500 fa-solid fa-xmark"></i>
						)}
						<p>At least 1 lowercase letter</p>
					</li>
					<li className={`flex items-center gap-x-2`}>
						{/[0-9]/.test(formData.password) ? (
							<i className="text-green-500 fa-solid fa-check"></i>
						) : (
							<i className=" text-red-500 fa-solid fa-xmark"></i>
						)}
						<p>At least 1 number</p>
					</li>
				</ul>
			}

			<div className="flex flex-col gap-2 mt-2">
				<label htmlFor="confirmPassword" className="text-primary">
					Confirm Password <span className="text-red-600">*</span>
				</label>
				<div className="flex items-center justify-between border border-primary rounded-md px-2 h-[42px]">
					<i className="fa-solid fa-lock text-primary w-fit text-[16px] mr-2" />
					<input
						type="password"
						placeholder="confirm Password"
						id="confirmPassword"
						maxLength={40}
						required
						value={formData.confirmPassword}
						className="focus:outline-none text-primary font-roboto w-full bg-transparent text-[16px]"
						onChange={(e) =>
							setFormData({
								...formData,
								confirmPassword: e.target.value,
							})
						}
					/>
					<button
						className="p-0"
						onClick={() =>
							togglePasswordVisibility("confirmPassword")
						}
					>
						<i className="fa-solid fa-eye text-gray-400 text-[18px] " />
					</button>
				</div>
			</div>

			<button
				className="btnRev w-full my-4 md:my-6"
				onClick={() => handleNextStep()}
			>
				Sign Up
			</button>

			<div className="flex flex-col gap-2 mt-4">
				<p className="text-primary text-center">
					Already have an account?{" "}
					<Link href="/sign-in" className="text-secondary">
						Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
