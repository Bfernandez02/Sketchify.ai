import React from "react";
import { NextSeo } from "next-seo";
import { useState } from "react";
import Link from "next/link";
import { validateSignInForm } from "@/utils/authUtils";
import toast from "react-hot-toast";

export default function Sigin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = (id) => {
    const input = document.getElementById(id);
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  };

  const handleSubmit = () => {
    if (!validateSignInForm(formData)) return;

    console.log(formData);
  };

  return (
    <div className="mb-[120px]">
      <NextSeo
        title={"Sketchify.ai | Sign In"}
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
          <div className="flex flex-col gap-2">
            <h2 className="font-fraunces md:text-7xl text-5xl text-center mb-[20px]">
              Sign In
            </h2>

            <div className="flex gap-2 items-center">
              <button className="btn w-full flex items-center justify-center gap-2">
                <i className="fa-brands fa-google fa-lg"></i>
                Sign in with Google
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center justify-between h-[1px] w-full bg-slate-400"></div>
              <span className="text-slate-400">or</span>
              <div className="flex items-center justify-between h-[1px] w-full bg-slate-400"></div>
            </div>

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
              <i className="fa-solid fa-lock text-primary w-fit text-[16px] mr-2 " />
              <input
                type="password"
                placeholder="password"
                id="password"
                required
                className="focus:outline-none text-primary font-roboto w-full bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
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

          <button className="btnRev w-full my-4 md:my-6" onClick={handleSubmit}>
            Sign In
          </button>

          <p className="text-primary text-center">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-secondary">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="md:grid grid-cols-2 w-full hidden rounded-r-[20px] overflow-clip">
          <img src="/astro.jpg" alt="signinArt" className=" h-[300px]" />
          <img src="/bunny.jpg" alt="signinArt" className=" h-[300px]" />
          <img src="/abstract.jpg" alt="signinArt" className=" h-[300px]" />
          <img src="/forest.jpg" alt="signinArt" className=" h-[300px]" />
        </div>
      </div>
    </div>
  );
}
