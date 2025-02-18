import React from "react";
import { NextSeo } from "next-seo";
import { useState } from "react";

export default function sigin() {
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
    console.log(formData);
  };

  return (
    <div>
      <NextSeo
        title={"Sketchify.ai | Sign In"}
        description="Sign in to Sketchify to start creating and sharing your art."
      />
      <div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto p-4">
        <h2 className="font-fraunces md:text-7xl text-5xl">
          Join Sketchify <br /> Start Creating Today!
        </h2>
        <img
          className="md:w-[360px] w-[300px]"
          src={"/signupArt.png"}
          alt="exploreArt"
        />
      </div>

      <div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto p-4">
        <div className="w-full px-[20px] lg:px-[80px] xl:px-[160px] py-[80px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-primary">
              Email <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center justify-between border border-primary rounded-md p-2">
              <input
                type="email"
                placeholder="email"
                id="email"
                className="focus:outline-none text-primary font-roboto w-full"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <i className="fa-solid fa-envelope text-primary w-fit fa-lg " />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-primary">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center justify-between border border-primary rounded-md p-2">
              <i className="fa-solid fa-lock text-primary w-fit fa-lg mr-2" />
              <input
                type="password"
                placeholder="password"
                id="password"
                required
                className="focus:outline-none text-primary font-roboto w-full"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                className="h-fit w-fit"
                onClick={() => togglePasswordVisibility("password")}
              >
                <i className="fa-solid fa-eye text-gray-400 w-fit fa-lg " />
              </button>
            </div>
          </div>

          <button className="btn md:mx-[80px]" onClick={handleSubmit}>
            Sign In
          </button>

          <p className="text-primary text-center">
            Don't have an account?{" "}
            <a href="/signup" className="text-accent">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
