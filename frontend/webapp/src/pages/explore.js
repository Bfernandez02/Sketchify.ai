import React from "react";
import { NextSeo } from "next-seo";
import ExploreHero from "@/components/ExploreHero";
import Trending from "@/components/Trending";
import DisplayArtsGrid from "@/components/DisplayArtsGrid";
import artsData from "@/utils/artsData";

export default function explore() {
  return (
    <>
      <NextSeo title="Explore | Sketchify" />
      <div className="content-container">
        <ExploreHero />
        <Trending />

        <div className="max-w-[1280px] mx-auto p-4">
          <DisplayArtsGrid arts={artsData} simple = {false} />
        </div>
      </div>
    </>
  );
}
