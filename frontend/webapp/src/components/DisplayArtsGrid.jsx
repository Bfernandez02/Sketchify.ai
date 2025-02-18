import React from "react";
import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import ArtCard from "./ArtCard";

export default function DisplayArtsGrid({ arts, simple = false }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Set initial state and listen for resize events
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breakpointCols = {
    default: 5,
    1280: 4, // xl
    840: 3, // md
    700: 2, // min
    470: 1, // sm
  };

  return (
    <Masonry breakpointCols={breakpointCols} className="flex w-auto -ml-4" columnClassName="pl-4">
      {arts.map((art, index) => (
        <React.Fragment key={`fragment-${art.id}`}>
          <div key={`art-${art.id}`} className="mb-4 relative">
            <ArtCard art={art} simple={simple} grid = {true}/>
          </div>
        </React.Fragment>
      ))}
    </Masonry>
  );
}
