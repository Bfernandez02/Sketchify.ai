import React from "react";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";

export default function Confirmation({ formData }) {
  return (
    <div>
      <div className="mx-auto mt-8 flex max-w-[420px] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-fraunces md:text-5xl text-3xl w-full">
          Thank you for signing up {formData.name}!
        </h2>
        <p className="text-lg">
          You are now a part of the Sketchify community.
        </p>

        <Image src="/painters.png" alt="" width={250} height={250} />

        <p className="">
          Explore the world of art and start creating today! Check out posts
          from other artists and share your AI enhanced art.
        </p>

        <Link className="btn w-full" href={"sketch"}>
          Create Art
        </Link>
      </div>
    </div>
  );
}
