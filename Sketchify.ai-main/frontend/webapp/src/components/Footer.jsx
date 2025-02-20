import React from "react";
import Link from "next/link";

const quickLinks = [
  { title: "Home", url: "/" },
  { title: "Sketch", url: "/sketch" },
  { title: "explore", url: "/explore" },
  { title: "Contact", url: "/contact" },
];

const BlockComponent = ({ title, customBody }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-[300px] lg:max-w-[500px]">
      <div className="text-[22px] text-secondary font-serif font-bold">
        {title}
      </div>
      {customBody}
    </div>
  );
};

export default function Footer() {
  const [email, setEmail] = React.useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Email submitted: ${email}`);
  };

  return (
    <div
      className="w-full bg-primary h-fit py-4 text-white rounded-t-[20px]"
      suppressHydrationWarning={true}
    >
      <div className="w-full py-[10px] md:lg:px-[140px] md:lg:pt-[20px] h-auto ">
        <div className="flex md:lg:justify-start gap-5">
          {/* logo */}
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
            {/* email component */}
            <div className="flex flex-row items-center outline outline-2 rounded w-[268px] md:lg:h-[35px] md:lg:w-[350px]">
              <form onSubmit={handleSubmit} className="flex w-full">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange} // Update the email state on each change
                  required
                  className="bg-primary font-sans text-white rounded px-2 py-1 outline-none w-[160px] md:lg:w-[250px]"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="bg-primary text-white rounded flex-shrink-0 border-l-2 hover:text-secondary transition-colors text-[14px] px-2 py-1 md:lg:px-4 md:lg:py-2"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Logo and Copyright*/}
      <div className="pt-5 w-full flex flex-col px-3 gap-1 content-center items-center justify-center md:px-[80px] h-auto">
        <div className="order-2 content-center text-[11px] py-2 md:lg:text-[14px] md:lg:order-1">
          2025 © Town of Lincoln. All rights reserved. Official Tourism Site for
          the town of Lincoln{" "}
        </div>
      </div>
    </div>
  );
}
