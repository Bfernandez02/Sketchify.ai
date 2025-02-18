import React from "react";
import { NextSeo } from "next-seo";
import SketchPad from "@/components/SketchPad";
import pencil from "../../public/pencil.png";

export default function sketch() {
  return (
    <>
      <NextSeo title="Sketch | Sketchify" />
      <div className="content-container ">
        <div className="flex flex-row space-x-10 w-full items-center justify-center">
          <div className=" w-1/2">
            <h1 className="font-fraunces justify-center">
              {" "}
              Sketch, Enhance, and Create, Bring Your Ideas to Life
            </h1>
          </div>
          <img className="w-50 h-40" src={pencil.src} alt="Pencil" />
        </div>
        <SketchPad />
      </div>
    </>
  );
}
