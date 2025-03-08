// pages/signup.jsx
import React, { useState } from "react";
import { NextSeo } from "next-seo";
import SignUpForm from "@/components/auth/SignUpForm";
import { auth, googleProvider } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { saveUserToFirestore } from "@/firebase/utils";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: null,
    banner: null,
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("Please fill in all required fields.");
      throw new Error("Missing required fields");
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      throw new Error("Passwords don't match");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.name,
      });

      // Save additional user data to Firestore
      await saveUserToFirestore(formData, user.uid);

      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        profile: user.photoURL ? { url: user.photoURL } : null,
        bio: '',
      };

      await saveUserToFirestore(userData, user.uid);

      toast.success("Signed up with Google!");
      // Note: No redirect here, let the form handle the confirmation step
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <div className="mb-[120px]">
      <NextSeo
        title="Sketchify.ai | Sign Up"
        description="Join Sketchify to start creating and sharing your art."
      />

      <div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto p-4">
        <h2 className="font-fraunces md:text-7xl text-5xl">
          Join Sketchify <br /> Start Creating Today!
        </h2>
        <img className="md:w-[360px] w-[300px]" src={"/signupArt.png"} alt="exploreArt" />
      </div>

      <div className="flex md:flex-row flex-col justify-between items-center xl:w-[1280px] w-full mx-auto rounded-[20px] bg-white">
        <SignUpForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEmailSignUp}
          onGoogleSignUp={handleGoogleSignUp}
          loading={loading}
        />

        <div className="md:grid grid-cols-2 w-full hidden rounded-r-[20px] overflow-clip">
          <img src="/astro.jpg" alt="signupArt" className="h-[365px]" />
          <img src="/bunny.jpg" alt="signupArt" className="h-[365px]" />
          <img src="/abstract.jpg" alt="signupArt" className="h-[365px]" />
          <img src="/forest.jpg" alt="signupArt" className="h-[365px]" />
        </div>
      </div>
    </div>
  );
}