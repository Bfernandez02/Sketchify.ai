import React from "react";
import handleLogout from "@/firebase/handlelogout";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProfileIcon({ user }) {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profilePicture = user?.profileImage;
  let parsed = "";

  if (user?.name) {
    parsed = user?.name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }

  return (
    <div>
      {user && (
        <div className="relative">
          <button
            className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            onClick={() => setProfileDropdown(!profileDropdown)}
          >
            {!profilePicture ? (
              parsed === "" ? (
                <i className="fa-solid fa-user text-xl text-gray-500"></i>
              ) : (
                parsed
              )
            ) : (
              <Image src={profilePicture} className="rounded-full" layout="fill"/>
            )}
          </button>
          {profileDropdown && (
            <div className="absolute right-0 top-14 rounded-lg border border-gray-200 bg-white shadow">
              <ul className="flex flex-col gap-2 p-3">
                <li className="flex max-w-[250px] flex-col">
                  <span>Signed in as : </span>
                  <span className="truncate text-sm font-semibold">
                    {user?.email}
                  </span>
                </li>
                <hr />
                {user?.name && (
                  <li className="rounded p-1 px-2 hover:bg-gray-50 hover:text-gray-800">
                    <Link
                      href="/profile"
                      className=""
                      onClick={() => setProfileDropdown(!profileDropdown)}
                    >
                      Profile
                    </Link>
                  </li>
                )}
                <li className="rounded p-1 px-2 hover:bg-gray-50 hover:text-gray-800">
                  <button
                    className="flex size-full items-start"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
