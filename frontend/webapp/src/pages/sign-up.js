import React from "react";

export default function signup() {
  return (
    <div>

      <div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto p-4">
        <h2 className="font-fraunces md:text-7xl text-5xl text-center">
          Join Sketchify <br /> Start Creating Today
        </h2>
        <img
          className="md:w-[360px] w-[300px]"
          src={"/signupArt.png"}
          alt="exploreArt"
        />
      </div>

      
    </div>
  );
}
