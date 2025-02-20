import React from "react";
import { useState } from "react";
import { NextSeo } from "next-seo";
import SignUpForm from "@/components/auth/SignUnForm";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "bf22wk@brocku.ca",
    password: "Testdata123",
    confirmPassword: "Testdata123",
    profile : null,
    banner : null,
    bio : "",
  });

  return (
    <div className="mb-[120px]">
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

      <div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto rounded-[20px] bg-white">
        <SignUpForm formData={formData} setFormData={setFormData} />

        <div className="md:grid grid-cols-2 w-full hidden rounded-r-[20px] overflow-clip">
          <img src="/astro.jpg" alt="signinArt" className=" h-[365px]" />
          <img src="/bunny.jpg" alt="signinArt" className=" h-[365px]" />
          <img src="/abstract.jpg" alt="signinArt" className=" h-[365px]" />
          <img src="/forest.jpg" alt="signinArt" className=" h-[365px]" />
        </div>
      </div>
    </div>
  );
}
