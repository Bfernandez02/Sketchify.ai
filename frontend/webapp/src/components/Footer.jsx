import React, { useState } from "react";
import Link from "next/link";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const quickLinks = [
  { title: "Home", url: "/" },
  { title: "Sketch", url: "/sketch" },
  { title: "explore", url: "/explore" },
  { title: "Contact", url: "/contact" },
];

const BlockComponent = ({ title, customBody }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-[500px] lg:max-w-[700px]">
      <div className="text-[22px] text-secondary font-serif font-bold">
        {title}
      </div>
      {customBody}
    </div>
  );
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackState, setFeedbackState] = useState({
    message: "",
    type: ""
  });

  const handleChange = (event) => {
    setEmail(event.target.value);
    setFeedbackState({ message: "", type: "" });
  };

  const checkExistingSubscriber = async (email) => {
    const q = query(
      collection(db, "newsletter-subscribers"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setFeedbackState({ message: "", type: "" });

    try {
      const exists = await checkExistingSubscriber(email);
      if (exists) {
        setFeedbackState({
          message: "This email is already subscribed to our newsletter!",
          type: "error"
        });
        setIsLoading(false);
        return;
      }

      await addDoc(collection(db, "newsletter-subscribers"), {
        email: email,
        subscribedAt: new Date(),
        status: "active"
      });
      
      setFeedbackState({
        message: "Thank you for subscribing! You'll receive our newsletter soon.",
        type: "success"
      });
      setEmail("");
    } catch (error) {
      console.error("Error during subscription:", error);
      let errorMessage = "Failed to subscribe. Please try again later.";
      
      if (error.code === 'permission-denied') {
        errorMessage = "Unable to subscribe due to permission issues. Please try again later.";
      } else if (error.code === 'unavailable') {
        errorMessage = "Service temporarily unavailable. Please try again in a few minutes.";
      }
      
      setFeedbackState({
        message: errorMessage,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full bg-primary h-fit py-4 text-white rounded-t-[20px]"
      suppressHydrationWarning={true}
    >
      <div className="w-full py-[10px] lg:px-[140px] lg:pt-[20px] h-auto px-[20px] ">
        <div className="flex md:lg:justify-start gap-5">
          <Link
            className="font-italianno lg:text-5xl text-4xl text-white px-5 "
            href="/"
          >
            Sketchify
          </Link>
        </div>
        <div className="w-full px-5 py-2 flex flex-col md:lg:flex-row gap-[120px] md:py-[10px] justify-between">
          <BlockComponent
            title={"Quick Links"}
            customBody={
              <div className="flex flex-col gap-1 pt-3 justify-between">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-[18px] hover:underline"
                  >
                 
                    {link.title}
                  </a>
                ))}
              </div>
            }
          />
          <BlockComponent
            title={"Contact Us"}
            customBody={
              <div className="flex flex-col gap-2 pt-3 justify-between">
                <div className="flex col gap-x-2">
                  <i
                    suppressHydrationWarning
                    className="fa-solid fa-phone content-center text-secondary"
                  ></i>
                  <div className="text-[18px]">+1 (234) 567 - 890</div>
                </div>
                <div className="flex col gap-x-2">
                  <i
                    suppressHydrationWarning
                    className="fa-solid fa-envelope content-center text-secondary"
                  ></i>
                  <div className="text-[18px]">info@lincoln.ca</div>
                </div>
                <div className="flex items-start gap-x-2">
                  <i
                    suppressHydrationWarning
                    className="fa-solid fa-location-dot text-secondary mt-1"
                  ></i>
                  <div className="text-[18px]">
                    4800 South Service Road Beamsville, ON L3J 1L3
                  </div>
                </div>
                <div className="flex flex-row pt-3 gap-x-6 md:lg:pt-7 items-center">
                    <Link href={"/team"} className="text-[18px] hover:underline">
                        OUR TEAM
                    </Link>
                  <i
                    suppressHydrationWarning
                    className="fa-brands fa-facebook text-secondary fa-2x"
                  ></i>
                  <i
                    suppressHydrationWarning
                    className="fa-brands fa-twitter text-primary text-xl bg-secondary rounded-full flex items-center justify-center w-[34px] h-[34px]"
                  ></i>
                  <i
                    suppressHydrationWarning
                    className="fa-brands fa-pinterest-p text-primary text-xl bg-secondary rounded-full flex items-center justify-center w-[34px] h-[34px]"
                  ></i>
                  <i
                    suppressHydrationWarning
                    className="fa-brands fa-instagram text-primary text-xl bg-secondary rounded-full flex items-center justify-center w-[34px] h-[34px]"
                  ></i>
                </div>
              </div>
            }
          />
          <div className="flex flex-col gap-8">
            <BlockComponent
              title={"Newsletter"}
              customBody={
                <div className="text-[18px]">
                  Subscribe for our upcoming latest articles and news resources
                </div>
              }
            />
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center outline outline-2 rounded w-[268px] md:lg:h-[35px] md:lg:w-[350px]">
                <form onSubmit={handleSubmit} className="flex w-full">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="bg-primary font-sans text-white rounded px-2 py-1 outline-none w-[160px] md:lg:w-[250px] disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-primary text-white rounded flex-shrink-0 border-l-2 
                      hover:text-secondary transition-colors text-[14px] px-2 py-1 
                      md:lg:px-4 md:lg:py-2 disabled:opacity-50 disabled:cursor-not-allowed
                      ${isLoading ? 'animate-pulse' : ''}`}
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </div>
              {feedbackState.message && (
                <div className={`text-sm ${
                  feedbackState.type === 'success' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                  } transition-all duration-300 ease-in-out`}>
                  {feedbackState.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5 w-full flex flex-col px-3 gap-1 content-center items-center justify-center md:px-[80px] h-auto">
        <div className="order-2 content-center text-[11px] py-2 md:lg:text-[14px] md:lg:order-1">
          2025 © Skethchify.ai . All rights reserved. Privacy Policy | Terms of Service | Sitemap
        </div>
      </div>
    </div>
  );
}