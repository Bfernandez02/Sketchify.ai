import { useState } from "react";
import React from "react";
import { useAuth } from "@/context/authContext";
import { doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast } from "react-hot-toast";

export default function SaveButton({ artID }) {
  const { currentUser } = useAuth();

  const [bookmarkActive, setBookmarkActive] = useState(
    currentUser?.savedPosts?.includes(artID) || false
  );

  
  const handleSave = async () => {
    if (!currentUser || !artID) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);

      const savedPosts = currentUser.savedPosts || [];

      if (savedPosts.includes(artID)) {
        // Remove the artwork from savedPosts
        const updatedPosts = savedPosts.filter((id) => id !== artID);
        await updateDoc(userDocRef, {
          savedPosts: updatedPosts,
        });
        toast.success("Artwork removed from your saved posts!");
      } else {
        // Add the artwork to savedPosts
        const updatedPosts = [...savedPosts, artID];
        await updateDoc(userDocRef, {
          savedPosts: updatedPosts,
        });
        toast.success("Artwork saved to your posts!");
      }

      // Update the currentUser object to reflect the changes
      currentUser.savedPosts = savedPosts.includes(artID)
        ? savedPosts.filter((id) => id !== artID)
        : [...savedPosts, artID];
    } catch (error) {
      console.error("Error updating saved posts:", error);
    }
  };

  return (
    <div>
      <button
        className={`${
          bookmarkActive
            ? "text-secondary bg-primary border border-primary"
            : "text-gray-300 bg-white border border-primary"
        } hover:bg-primary hover:text-secondary transition-all duration-300 rounded-[20px] px-3 py-[1px]`}
        onClick={() => {
          setBookmarkActive(!bookmarkActive);
          handleSave();
        }}
      >
        <i className="fa-solid fa-bookmark text-[20px]"></i>
      </button>
    </div>
  );
};
