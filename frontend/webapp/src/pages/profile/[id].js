import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/firebase/config";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import ArtCard from "@/components/ArtCard";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { id } = context.params;

  let user = null;
  let posts = [];

  try {
    // Fetch user data
    const userDoc = await getDoc(doc(db, "users", id));
    if (userDoc.exists()) {
      user = { id: userDoc.id, ...userDoc.data() };
      console.log(user);
    }

    // Get all posts from the user's "posts" subcollection
    const postsRef = collection(db, "users", id, "posts"); // User's posts subcollection
    const postSnap = await getDocs(postsRef);
    posts = postSnap.docs.map((doc) => {
      const data = doc.data();
      const postId = doc.id;

      return {
        id: postId,
        userID: id, // We know the userID is the user's ID here
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null, // Convert Firestore Timestamp
        postedAt: data.postedAt?.toDate().toISOString() || null, // Ensure all timestamps are converted
      };
    });

    // Attach user data to each post (same method as in Explore page)
    posts = await Promise.all(
      posts.map(async (post) => {
        try {
          const userRef = doc(db, "users", post.userID);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            post.user = {
              name: userData.name || "Unknown User",
              profileImage: userData.profileImage || "/default-avatar.png",
            };
          } else {
            console.warn(`No user found for ID: ${post.userID}`);
            post.user = {
              name: "Unknown User",
              profileImage: "/default-avatar.png",
            };
          }
        } catch (err) {
          console.error(`Error fetching user ${post.userID}:`, err.message);
        }
        return post;
      })
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return {
    props: {
      user,
      posts,
    },
  };
}

export default function Profile({ user, posts }) {
  const [savedPosts, setSavedPosts] = useState([]);
  const { currentUser } = useAuth();

  const isOwnProfile = currentUser?.uid === user?.uid;

  console.log(user);

  const [activeTab, setActiveTab] = useState("Artwork");

  // console.log("posts", posts);
  if (!user) return <p>User not found</p>;

  useEffect(() => {
    if (activeTab === "Liked" && user?.savedPosts?.length > 0) {
      const fetchSavedPosts = async () => {
        try {
          const saved = await Promise.all(
            user.savedPosts.map(async (postId) => {
              // You don’t know the exact user path, so loop through all users to find the post
              const usersSnapshot = await getDocs(collection(db, "users"));
              for (const userDoc of usersSnapshot.docs) {
                const postRef = doc(db, "users", userDoc.id, "posts", postId);
                const postSnap = await getDoc(postRef);
                if (postSnap.exists()) {
                  const postData = postSnap.data();
                  const userData = userDoc.data();
                  return {
                    id: postId,
                    userID: userDoc.id,
                    ...postData,
                    createdAt:
                      postData.createdAt?.toDate().toISOString() || null,
                    postedAt: postData.postedAt?.toDate().toISOString() || null,
                    user: {
                      name: userData.name || "Unknown User",
                      profileImage:
                        userData.profileImage || "/default-avatar.png",
                    },
                  };
                }
              }
              return null; // If not found
            })
          );

          // Remove nulls and set
          setSavedPosts(saved.filter(Boolean));
        } catch (err) {
          console.error("Error fetching saved posts:", err);
        }
      };

      fetchSavedPosts();
    }
  }, [activeTab, user?.savedPosts]);

  return (
    <div className="max-w-[1280px] mx-auto px-4">
      <Image
        className="rounded-full w-full h-[164px] md:flex hidden object-cover"
        src={user.bannerImage}
        alt="Profile picture"
        width={500}
        height={500}
      />
      <div className="flex gap-6 justify-center items-center">
        <Image
          className="rounded-full w-[164px] h-[164px] md:flex hidden object-cover -mt-[50px] border-4 border-background"
          src={user.profileImage}
          alt="Profile picture"
          width={500}
          height={500}
        />
        <div className="flex flex-col py-4 w-full">
          <h2 className="font-fraunces leading-9">{user.name}</h2>
          <p>{user.bio}</p>
          {currentUser?.email === user.email && (
            <a
              className="font-roboto text-[16px] text-gray-700 pl-1 hover:underline hover:cursor-pointer"
              href="/profile/edit"
            >
              Edit profile
            </a>
          )}
        </div>
      </div>

      {/* navigation tabs */}
      <div className="border-t border-gray-200">
        <div className="max-w-3xl mx-auto flex justify-center">
          <button
            shallow
            scroll={false}
            onClick={() => setActiveTab("Artwork")}
            className={`px-4 py-2 font-medium text-[18px] rounded-none border-t-2 transition-all duration-200 ease-in-out ${
              activeTab === "Artwork"
                ? "text-black border-black"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Artwork
          </button>
          {isOwnProfile && (
            <>
              <button
                shallow
                scroll={false}
                onClick={() => setActiveTab("Likes")}
                className={`px-4 py-2 text-[18px] rounded-none font-medium border-t-2 transition-all duration-200 ease-in-out ${
                  activeTab === "Likes"
                    ? "text-black border-black"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Likes
              </button>
			  <button
                shallow
                scroll={false}
                onClick={() => setActiveTab("Archived")}
                className={`px-4 py-2 text-[18px] rounded-none font-medium border-t-2 transition-all duration-200 ease-in-out ${
                  activeTab === "Archived"
                    ? "text-black border-black"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Archived
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-12">
        <h2 className="font-fraunces">{activeTab}</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-[100px]">
        {(activeTab === "Artwork" ? posts : savedPosts).length === 0 ? (
          <p>
			No {activeTab} posted yet.
          </p>
        ) : (
          (activeTab === "Artwork" ? posts : savedPosts).map((post) => (
            <div key={post.id} className="w-[300px]">
              <ArtCard art={post} grid={true} artist={post.user} />{" "}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
