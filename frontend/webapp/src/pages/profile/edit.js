import React, { useState } from "react";
import { useAuth } from "@/context/authContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import toast from "react-hot-toast";
import ImageSelector from "@/components/auth/ImageSelector";
import { useRouter } from "next/router";

export default function Edit() {
	const router = useRouter();
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        bio: currentUser?.bio || "",
        profile: null,
    });

    if (!currentUser) {
        return null;
    }

    const validateForm = () => {
        if (!formData.name) {
            toast.error("Name is required", { id: "name" });
            return false;
        }
        if (!formData.email || !formData.email.includes("@")) {
            toast.error("Valid email is required", { id: "email" });
            return false;
        }
        return true;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const { name, email, bio } = formData;
        const updatedUser = { name, email, bio };

        try {
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, updatedUser, { merge: true });
            toast.success("Profile updated successfully!");
			router.push(`/profile/${currentUser.uid}`);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10">
            <h2 className="font-fraunces md:text-7xl text-5xl text-center mb-6">Edit Profile</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-primary">
                        Full Name <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center justify-between border border-primary rounded-md p-2">
                        <input
                            type="text"
                            placeholder="Full Name"
                            id="name"
                            value={formData.name}
                            maxLength={40}
                            className="focus:outline-none text-primary font-roboto w-full bg-transparent text-[16px]"
                            required
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <i className="fa-solid fa-user text-primary w-fit text-[18px]" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-primary">
                        Email <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center justify-between border border-primary rounded-md p-2">
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            value={formData.email}
                            className="focus:outline-none text-primary font-roboto w-full bg-transparent text-[16px]"
                            required
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <i className="fa-solid fa-envelope text-primary w-fit text-[18px]" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="bio" className="text-primary">
                        Bio <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center justify-between border border-primary rounded-md p-2">
                        <input
                            type="text"
                            placeholder="Bio"
                            id="bio"
                            value={formData.bio}
                            maxLength={60}
                            className="focus:outline-none text-primary font-roboto w-full bg-transparent text-[16px]"
                            required
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                        <i className="fa-solid fa-user text-primary w-fit text-[18px]" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-primary">
                        Upload Profile Image <span className="text-red-600">*</span>
                    </label>
                    <ImageSelector type="profile" setFormData={setFormData} image={formData.profile} />
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
