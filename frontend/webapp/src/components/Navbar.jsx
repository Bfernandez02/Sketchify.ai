import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Spin as Hamburger } from "hamburger-react";
import { useAuth } from "@/context/authContext";
import ProfileIcon from "./ProfileIcon";

export default function Navbar() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [mobileIsOpen, setMobileIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Sketch", path: "/sketch" },
    { name: "Explore", path: "/explore" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="sticky top-0 z-20">
      <div
        className={`hidden md:flex justify-between items-center px-8 lg:px-10 py-4 z-20 sticky top-0 bg-background transition-shadow duration-300 ${
          hasScrolled ? "shadow-md" : ""
        }`}
      >
        <Link
          className="hidden md:flex font-italianno lg:text-5xl text-4xl"
          href="/"
        >
          Sketchify
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 font-fraunces font-normal text-xl lg:text-2xl ">
          {menuItems.map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              className={`relative text-black transition-all duration-300 ${
                router.pathname === path ? "border-b-2 border-black" : ""
              }`}
            >
              <span className="relative uppercase pb-[4.8px] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-black after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">
                {name}
              </span>
            </Link>
          ))}

          {currentUser ? (
            <ProfileIcon user={currentUser} />
          ) : (
            <Link href="/sign-in" className="btnLarge">
              Login
            </Link>
          )}
        </nav>
      </div>

      <div
        className={
          `flex justify-end sticky top-0 py-2 px-4 bg-background transition-all duration-300 md:hidden ` +
          (hasScrolled ? " shadow-md" : "")
        }
      >
        {/* Mobile Navigation */}
        <div className="md:hidden z-[21] flex justify-between items-center w-full px-4">
          <Link className="font-italianno lg:text-5xl text-4xl" href="/">
            Sketchify
          </Link>

          <Hamburger
            toggled={mobileIsOpen}
            toggle={setMobileIsOpen}
            size={25}
            color="black"
            duration={0.5}
          />
        </div>

        {/* Mobile Menu Overlay */}
        {/* MOBILE NAV MENU */}
        <nav
          data-testid="mobile-nav"
          aria-description="Mobile Navbar"
          className={`z-20 bg-background/80 backdrop-blur-2xl fixed right-0 top-0 flex text-center h-screen w-screen origin-top-right flex-col gap-8 px-10 pt-28 transition-all md:hidden max-h-screen overflow-y-scroll items-center ${
            mobileIsOpen
              ? "visible scale-100 opacity-100 z-20"
              : "invisible scale-0 opacity-0"
          }
                `}
        >
          <Link href="/" className="text-5xl font-italianno pb-8">
            Sketchify
          </Link>
          {menuItems.map(({ name, path }) => (
            <Link
              onClick={() => setMobileIsOpen(false)}
              key={path}
              href={path}
              className={`${
                router.pathname === path
                  ? "underline font-fraunces uppercase text-3xl"
                  : "text-black font-fraunces uppercase text-3xl"
              }`}
            >
              {name}
            </Link>
          ))}

          {currentUser ? (
            <ProfileIcon user={currentUser} />
          ) : (
            <Link
              onClick={() => setMobileIsOpen(false)}
              href="/sign-in"
              className="bg-primary font-fraunces uppercase text-3xl w-fit mx-auto text-white px-8 py-2 lg:px-4 lg:py-2 rounded-[20px] hover:bg-secondary transition-all duration-100"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
