import React from "react";
import ImageSelector from "./ImageSelector";

export default function Step2({ formData, setFormData }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-fraunces md:text-7xl text-5xl text-center">
        Sign Up
      </h2>

      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="name" className="text-primary">
          Full Name <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center justify-between border border-primary rounded-md p-2">
          <input
            type="text"
            placeholder="name"
            id="name"
            value={formData.name}
            maxLength={40}
            className="focus:outline-none text-primary font-roboto w-full bg-transparent text-[16px]"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <i className="fa-solid fa-user text-primary w-fit text-[18px] " />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="bio" className="text-primary">
          Bio <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center justify-between border border-primary rounded-md p-2">
          <input
            type="text"
            placeholder="bio"
            maxLength={60}
            id="bio"
            value={formData.bio}
            className="focus:outline-none text-primary font-roboto w-full bg-transparent text-[16px]"
            required
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
          <i className="fa-solid fa-user text-primary w-fit text-[18px] " />
        </div>
      </div>

      <div className="flex flex-col mt-4">
        <label className="">
          Upload Profile Image <span className="text-red-500">*</span>
        </label>
        <ImageSelector
          type="profile"
          setFormData={setFormData}
          image={formData.profile}
        />
      </div>

      <div className="mb-4 mt-4">
        <label className="">Upload Banner Image</label>
        <ImageSelector
          type="banner"
          setFormData={setFormData}
          image={formData.banner}
        />
      </div>
    </div>
  );
}
